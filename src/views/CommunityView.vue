<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1>Community Support</h1>
        <p class="lead">Connect with local support groups and community programs</p>
      </div>
    </div>

    <!-- Support Groups Section -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title mb-0">Support Groups</h5>
              <div class="col-md-4">
                <select v-model="selectedCategory" class="form-select form-select-sm">
                  <option value="">All Categories</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="mental-health">Mental Health</option>
                  <option value="parenting">Parenting</option>
                  <option value="seniors">Seniors</option>
                  <option value="health-conditions">Health Conditions</option>
                </select>
              </div>
            </div>
            
            <div v-if="!userStore.currentUser" class="alert alert-info">
              <i class="fas fa-info-circle"></i> Please <router-link to="/login">login</router-link> to join support groups.
            </div>

            <div class="row">
              <div class="col-md-6 mb-3" v-for="group in filteredGroups" :key="group.id">
                <div class="card border">
                  <div class="card-body">
                    <h6 class="card-title">{{ group.name }}</h6>
                    <p class="card-text small">{{ group.description }}</p>
                    <p class="text-muted small mb-2">
                      <i class="fas fa-clock"></i> {{ group.meetingTime }} | 
                      <i class="fas fa-users"></i> {{ group.members }} members
                    </p>
                    <template v-if="userStore.currentUser">
                      <button 
                        v-if="!isJoined(group.id)"
                        @click="joinGroup(group.id)"
                        class="btn btn-sm btn-primary"
                        :disabled="joiningGroup === group.id"
                      >
                        {{ joiningGroup === group.id ? 'Joining...' : 'Join Group' }}
                      </button>
                      <div v-else class="d-flex align-items-center">
                        <span class="badge bg-success me-2">Joined</span>
                        <button 
                          @click="leaveGroup(group.id)"
                          class="btn btn-sm btn-outline-danger"
                          :disabled="leavingGroup === group.id"
                        >
                          {{ leavingGroup === group.id ? 'Leaving...' : 'Leave' }}
                        </button>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Events Section -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Upcoming Events</h5>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="event in events" :key="event.id">
                    <td>{{ event.name }}</td>
                    <td>{{ event.date }}</td>
                    <td>{{ event.location }}</td>
                    <td>
                      <template v-if="userStore.currentUser">
                        <button 
                          v-if="!isRegistered(event.id)"
                          @click="registerForEvent(event.id)"
                          class="btn btn-sm btn-outline-primary"
                          :disabled="registeringEvent === event.id"
                        >
                          {{ registeringEvent === event.id ? 'Registering...' : 'Register' }}
                        </button>
                        <span v-else class="badge bg-success">Registered</span>
                      </template>
                      <span v-else class="text-muted small">Login to register</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useUserStore } from '@/stores/user'
import { useGroupsStore } from '@/stores/groups'

const userStore = useUserStore()
const groupsStore = useGroupsStore()

const selectedCategory = ref('')
const joinedGroups = ref([])
const registeredEvents = ref([])
const joiningGroup = ref(null)
const leavingGroup = ref(null)
const registeringEvent = ref(null)

const events = ref([
  {
    id: 1,
    name: 'Community Health Fair',
    date: 'Dec 15, 2024',
    location: 'Community Centre'
  },
  {
    id: 2,
    name: 'Healthy Cooking Workshop',
    date: 'Dec 20, 2024',
    location: 'Local Library'
  },
  {
    id: 3,
    name: 'Mental Wellness Seminar',
    date: 'Jan 8, 2025',
    location: 'Town Hall'
  },
  {
    id: 4,
    name: 'Family Fitness Day',
    date: 'Jan 15, 2025',
    location: 'Community Park'
  }
])

const filteredGroups = computed(() => {
  if (!selectedCategory.value) {
    return groupsStore.groups
  }
  return groupsStore.groups.filter(group => group.category === selectedCategory.value)
})

const isJoined = (groupId) => {
  return joinedGroups.value.includes(groupId)
}

const isRegistered = (eventId) => {
  return registeredEvents.value.includes(eventId)
}

const joinGroup = async (groupId) => {
  if (!userStore.currentUser) return
  
  joiningGroup.value = groupId
  
  try {
    await addDoc(collection(db, 'groupMemberships'), {
      userId: userStore.currentUser.uid,
      groupId: groupId,
      joinedAt: new Date()
    })
    
    joinedGroups.value.push(groupId)
  } catch (error) {
    console.error('Error joining group:', error)
    alert('Failed to join group. Please try again.')
  } finally {
    joiningGroup.value = null
  }
}

const leaveGroup = async (groupId) => {
  if (!userStore.currentUser) return
  
  leavingGroup.value = groupId
  
  try {
    const membershipQuery = query(
      collection(db, 'groupMemberships'),
      where('userId', '==', userStore.currentUser.uid),
      where('groupId', '==', groupId)
    )
    
    const membershipSnapshot = await getDocs(membershipQuery)
    
    if (!membershipSnapshot.empty) {
      await deleteDoc(doc(db, 'groupMemberships', membershipSnapshot.docs[0].id))
      joinedGroups.value = joinedGroups.value.filter(id => id !== groupId)
    }
  } catch (error) {
    console.error('Error leaving group:', error)
    alert('Failed to leave group. Please try again.')
  } finally {
    leavingGroup.value = null
  }
}

const registerForEvent = async (eventId) => {
  if (!userStore.currentUser) return
  
  registeringEvent.value = eventId
  
  try {
    await addDoc(collection(db, 'eventRegistrations'), {
      userId: userStore.currentUser.uid,
      eventId: eventId,
      registeredAt: new Date()
    })
    
    registeredEvents.value.push(eventId)
  } catch (error) {
    console.error('Error registering for event:', error)
    alert('Failed to register for event. Please try again.')
  } finally {
    registeringEvent.value = null
  }
}

const loadUserMemberships = async () => {
  if (!userStore.currentUser) return
  
  try {
    // Load group memberships
    const membershipQuery = query(
      collection(db, 'groupMemberships'),
      where('userId', '==', userStore.currentUser.uid)
    )
    const membershipSnapshot = await getDocs(membershipQuery)
    joinedGroups.value = membershipSnapshot.docs.map(doc => doc.data().groupId)
    
    // Load event registrations
    const registrationQuery = query(
      collection(db, 'eventRegistrations'),
      where('userId', '==', userStore.currentUser.uid)
    )
    const registrationSnapshot = await getDocs(registrationQuery)
    registeredEvents.value = registrationSnapshot.docs.map(doc => doc.data().eventId)
  } catch (error) {
    console.error('Error loading user memberships:', error)
  }
}

onMounted(() => {
  loadUserMemberships()
})
</script>