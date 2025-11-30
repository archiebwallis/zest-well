<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1>Admin Dashboard</h1>
        <p class="lead">Manage registered users</p>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div v-if="loading" class="text-center">
          <p>Loading users...</p>
        </div>
        <div v-else>
          <!-- Export Buttons -->
          <div class="mb-3">
            <button 
              @click="exportCSV" 
              class="btn btn-outline-success me-2"
            >
              Export CSV
            </button>
            <button 
              @click="exportPDF" 
              class="btn btn-outline-danger"
            >
              Export PDF
            </button>
          </div>
          
          <DataTable 
            ref="dataTableRef"
            :data="tableData" 
            :columns="columns"
          >
            <template #role="{ value }">
              <span class="badge" :class="value === 'staff' ? 'bg-success' : 'bg-secondary'">
                {{ value }}
              </span>
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { sanitize } from '@/utils/sanitize'
import { exportToCSV, exportToPDF } from '@/utils/export'
import DataTable from '@/components/DataTable.vue'

const users = ref([])
const loading = ref(true)

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'suburb', label: 'Suburb' },
  { key: 'joined', label: 'Joined' }
]

const tableData = computed(() => {
  return users.value.map(user => ({
    id: user.id,
    name: sanitize(user.firstName) + ' ' + sanitize(user.lastName),
    email: sanitize(user.email),
    role: user.role,
    suburb: sanitize(user.suburb),
    joined: formatDate(user.createdAt)
  }))
})

const loadUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    users.value = []
    querySnapshot.forEach((doc) => {
      users.value.push({
        id: doc.id,
        ...doc.data()
      })
    })
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  return date.toDate ? date.toDate().toLocaleDateString() : new Date(date).toLocaleDateString()
}

const exportCSV = () => {
  exportToCSV(tableData.value, 'users-export.csv')
}

const exportPDF = () => {
  exportToPDF(tableData.value, columns, 'User Management Report', 'users-export.pdf')
}

onMounted(() => {
  loadUsers()
})
</script>