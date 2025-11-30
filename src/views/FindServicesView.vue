<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1>Find Services</h1>
        <p class="lead">Locate health clinics and services in the community</p>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-8">
        <!-- Search Bar -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Search for Services</h5>
            <div class="row">
              <div class="col-md-8 mb-2">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter suburb or postcode"
                  v-model="searchTerm"
                >
              </div>
              <div class="col-md-4">
                <button class="btn btn-primary w-100">Search</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Clinics List -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Available Clinics</h5>
          </div>
          <div class="card-body">
            <div v-for="clinic in filteredClinics" :key="clinic.id" class="border rounded p-3 mb-3">
              <h6 class="fw-bold">{{ clinic.name }}</h6>
              <p class="text-muted mb-1">{{ clinic.suburb }}</p>
              <p class="mb-2">{{ clinic.address }}</p>
              
              <!-- Rating Display -->
              <div class="mb-2">
                <div class="d-flex align-items-center">
                  <span class="me-2">{{ renderStars(clinic.averageRating || 0) }}</span>
                  <small class="text-muted">
                    {{ clinic.averageRating ? clinic.averageRating.toFixed(1) : '0.0' }}/5 
                    ({{ clinic.totalRatings || 0 }} ratings)
                  </small>
                </div>
                
                <!-- Rate This Clinic -->
                <div v-if="userStore.currentUser" class="mt-2">
                  <small class="text-muted me-2">Rate this clinic:</small>
                  <span 
                    v-for="star in 5" 
                    :key="star"
                    @click="rateClinic(clinic.id, star)"
                    class="rating-star"
                    :class="{ active: star <= (userRatings[clinic.id] || 0) }"
                  >
                    ★
                  </span>
                </div>
              </div>
              
              <div class="mb-0">
                <span class="badge bg-secondary me-1" v-for="service in clinic.services" :key="service">
                  {{ service }}
                </span>
              </div>
            </div>
            <div v-if="filteredClinics.length === 0" class="text-muted text-center py-3">
              No clinics found for "{{ searchTerm }}"
            </div>
          </div>
        </div>

        <!-- Map Placeholder -->
        <div class="card">
          <div class="card-body">
            <div class="bg-light rounded p-5 text-center" style="min-height: 300px;">
              <p class="text-muted">Interactive map will be added here</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Service Types</h5>
          </div>
          <div class="card-body">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="gp">
              <label class="form-check-label" for="gp">General Practice</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="dental">
              <label class="form-check-label" for="dental">Dental Services</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="mental">
              <label class="form-check-label" for="mental">Mental Health</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="pharmacy">
              <label class="form-check-label" for="pharmacy">Pharmacy</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Note: Clinic data from store is safe (admin-controlled)
// Any future user-generated content (reviews, comments) should be sanitized
import { ref, computed, onMounted } from 'vue'
import { useClinicsStore } from '@/stores/clinics'
import { useUserStore } from '@/stores/user'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'

const clinicsStore = useClinicsStore()
const userStore = useUserStore()
const searchTerm = ref('')
const userRatings = ref({})

const filteredClinics = computed(() => {
  let clinics = clinicsStore.clinics.map(clinic => ({
    ...clinic,
    averageRating: clinic.averageRating || 0,
    totalRatings: clinic.totalRatings || 0
  }))
  
  if (!searchTerm.value) {
    return clinics
  }
  return clinics.filter(clinic => 
    clinic.suburb.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const renderStars = (rating) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = '★'.repeat(fullStars)
  if (hasHalfStar) stars += '☆'
  stars += '☆'.repeat(5 - Math.ceil(rating))
  return stars
}

const rateClinic = async (clinicId, rating) => {
  if (!userStore.currentUser) return
  
  try {
    // Save rating to Firestore
    await addDoc(collection(db, 'ratings'), {
      clinicId,
      userId: userStore.currentUser.uid,
      rating,
      createdAt: new Date()
    })
    
    // Update local user rating
    userRatings.value[clinicId] = rating
    
    // Recalculate clinic average
    await updateClinicRating(clinicId)
    
  } catch (error) {
    console.error('Error saving rating:', error)
  }
}

const updateClinicRating = async (clinicId) => {
  try {
    const ratingsQuery = query(collection(db, 'ratings'), where('clinicId', '==', clinicId))
    const snapshot = await getDocs(ratingsQuery)
    
    if (snapshot.empty) return
    
    let total = 0
    let count = 0
    snapshot.forEach(doc => {
      total += doc.data().rating
      count++
    })
    
    const averageRating = total / count
    
    // Update clinic in store
    const clinic = clinicsStore.clinics.find(c => c.id === clinicId)
    if (clinic) {
      clinic.averageRating = averageRating
      clinic.totalRatings = count
    }
  } catch (error) {
    console.error('Error updating clinic rating:', error)
  }
}

const loadUserRatings = async () => {
  if (!userStore.currentUser) return
  
  try {
    const ratingsQuery = query(
      collection(db, 'ratings'), 
      where('userId', '==', userStore.currentUser.uid)
    )
    const snapshot = await getDocs(ratingsQuery)
    
    userRatings.value = {}
    snapshot.forEach(doc => {
      const data = doc.data()
      userRatings.value[data.clinicId] = data.rating
    })
  } catch (error) {
    console.error('Error loading user ratings:', error)
  }
}

const loadClinicRatings = async () => {
  try {
    for (const clinic of clinicsStore.clinics) {
      await updateClinicRating(clinic.id)
    }
  } catch (error) {
    console.error('Error loading clinic ratings:', error)
  }
}

onMounted(() => {
  loadUserRatings()
  loadClinicRatings()
})
</script>

<style scoped>
.rating-star {
  cursor: pointer;
  font-size: 1.2em;
  color: #ddd;
  transition: color 0.2s;
}

.rating-star:hover,
.rating-star.active {
  color: #ffc107;
}
</style>