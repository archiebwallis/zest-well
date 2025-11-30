<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1>Dashboard</h1>
        <p class="lead">Welcome back! Here's an overview of health activities</p>
      </div>
    </div>

    <div class="row mt-4">
      <!-- Quick Stats -->
      <div v-if="loading" class="col-12 text-center">
        <p>Loading dashboard...</p>
      </div>
      <template v-else>
        <!-- Staff Stats -->
        <template v-if="userStore.userRole === 'staff'">
          <div class="col-md-3 mb-4">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <h5 class="card-title">Total Users</h5>
                <h2 class="mb-0">{{ stats.totalUsers }}</h2>
                <small>Registered</small>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card bg-success text-white">
              <div class="card-body">
                <h5 class="card-title">Total Appointments</h5>
                <h2 class="mb-0">{{ stats.totalAppointments }}</h2>
                <small>All time</small>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card bg-info text-white">
              <div class="card-body">
                <h5 class="card-title">Total Clinics</h5>
                <h2 class="mb-0">{{ stats.totalClinics }}</h2>
                <small>Available</small>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <h5 class="card-title">Total Ratings</h5>
                <h2 class="mb-0">{{ stats.totalRatings }}</h2>
                <small>Submitted</small>
              </div>
            </div>
          </div>
        </template>
        
        <!-- Regular User Stats -->
        <template v-else>
          <div class="col-md-3 mb-4">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <h5 class="card-title">My Appointments</h5>
                <h2 class="mb-0">{{ stats.myAppointments }}</h2>
                <small>Upcoming</small>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card bg-success text-white">
              <div class="card-body">
                <h5 class="card-title">Clinics Available</h5>
                <h2 class="mb-0">{{ stats.totalClinics }}</h2>
                <small>Near you</small>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card bg-info text-white">
              <div class="card-body">
                <h5 class="card-title">My Ratings</h5>
                <h2 class="mb-0">{{ stats.myRatings }}</h2>
                <small>Submitted</small>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <h5 class="card-title">Resources Viewed</h5>
                <h2 class="mb-0">15</h2>
                <small>This month</small>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>

    <div class="row">
      <!-- Recent Activity -->
      <div class="col-md-8 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Recent Activity</h5>
          </div>
          <div class="card-body">
            <div class="list-group list-group-flush">
              <div class="list-group-item d-flex justify-content-between">
                <span>Completed health screening</span>
                <small class="text-muted">2 days ago</small>
              </div>
              <div class="list-group-item d-flex justify-content-between">
                <span>Joined nutrition support group</span>
                <small class="text-muted">1 week ago</small>
              </div>
              <div class="list-group-item d-flex justify-content-between">
                <span>Saved dental clinic location</span>
                <small class="text-muted">2 weeks ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-md-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Quick Actions</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/find-services" class="btn btn-outline-primary">Find Services</router-link>
              <router-link to="/resources" class="btn btn-outline-secondary">View Resources</router-link>
              <router-link to="/community" class="btn btn-outline-success">Join Groups</router-link>
              <router-link to="/book-appointment" class="btn btn-outline-danger">Book Appointment</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Assistant -->
    <div class="row mt-4">
      <div class="col-12">
        <HealthAssistant />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useUserStore } from '@/stores/user'
import { useClinicsStore } from '@/stores/clinics'
import HealthAssistant from '@/components/HealthAssistant.vue'

const userStore = useUserStore()
const clinicsStore = useClinicsStore()

const loading = ref(true)
const stats = ref({
  totalUsers: 0,
  totalAppointments: 0,
  totalClinics: 0,
  totalRatings: 0,
  myAppointments: 0,
  myRatings: 0
})

const loadStats = async () => {
  try {
    // Get total clinics from store
    stats.value.totalClinics = clinicsStore.clinics.length

    if (userStore.userRole === 'staff') {
      // Staff stats - get all data
      const usersSnapshot = await getDocs(collection(db, 'users'))
      stats.value.totalUsers = usersSnapshot.size

      const appointmentsSnapshot = await getDocs(collection(db, 'appointments'))
      stats.value.totalAppointments = appointmentsSnapshot.size

      const ratingsSnapshot = await getDocs(collection(db, 'ratings'))
      stats.value.totalRatings = ratingsSnapshot.size
    } else {
      // User stats - get user-specific data
      if (userStore.currentUser) {
        const userAppointmentsQuery = query(
          collection(db, 'appointments'),
          where('userId', '==', userStore.currentUser.uid)
        )
        const userAppointmentsSnapshot = await getDocs(userAppointmentsQuery)
        stats.value.myAppointments = userAppointmentsSnapshot.size

        const userRatingsQuery = query(
          collection(db, 'ratings'),
          where('userId', '==', userStore.currentUser.uid)
        )
        const userRatingsSnapshot = await getDocs(userRatingsQuery)
        stats.value.myRatings = userRatingsSnapshot.size
      }
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>