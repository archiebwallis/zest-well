<template>
  <div class="row">
    <!-- User Role Distribution Chart -->
    <div class="col-md-6 mb-4">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-users me-2"></i>
            User Distribution
          </h5>
        </div>
        <div class="card-body">
          <div v-if="loadingCharts" class="text-center">
            <p>Loading charts...</p>
          </div>
          <div v-else style="height: 300px; display: flex; justify-content: center; align-items: center;">
            <Pie 
              :data="pieChartData" 
              :options="pieChartOptions"
              style="max-height: 300px; max-width: 300px;"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- User Registrations by Month Chart -->
    <div class="col-md-6 mb-4">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-chart-bar me-2"></i>
            Monthly Registrations
          </h5>
        </div>
        <div class="card-body">
          <div v-if="loadingCharts" class="text-center">
            <p>Loading charts...</p>
          </div>
          <div v-else style="height: 300px;">
            <Bar 
              :data="barChartData" 
              :options="barChartOptions"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Pie, Bar } from 'vue-chartjs'

// Set up Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const loadingCharts = ref(true)

// Pie Chart Data for User Roles
const pieChartData = ref({
  labels: ['Regular Users', 'Staff Members'],
  datasets: [
    {
      data: [0, 0],
      backgroundColor: [
        '#007bff', // Blue for users
        '#28a745'  // Green for staff
      ],
      borderColor: [
        '#0056b3',
        '#1e7e34'
      ],
      borderWidth: 2
    }
  ]
})

const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  }
})

// Bar Chart Data for Monthly Registrations
const barChartData = ref({
  labels: [],
  datasets: [
    {
      label: 'New Registrations',
      data: [],
      backgroundColor: '#007bff',
      borderColor: '#0056b3',
      borderWidth: 1
    }
  ]
})

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `Registrations: ${context.parsed.y}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
})

const loadChartData = async () => {
  try {
    // Load user data for both charts
    const usersSnapshot = await getDocs(collection(db, 'users'))
    
    let userCount = 0
    let staffCount = 0
    const monthlyData = {}
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data()
      
      // Count users by role
      if (userData.role === 'staff') {
        staffCount++
      } else {
        userCount++
      }
      
      // Count registrations by month
      if (userData.createdAt) {
        const date = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt)
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1
      }
    })
    
    // Update pie chart data
    pieChartData.value.datasets[0].data = [userCount, staffCount]
    
    // Update bar chart data (last 6 months)
    const currentDate = new Date()
    const last6Months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
      
      last6Months.push({
        key: monthYear,
        label: monthName,
        count: monthlyData[monthYear] || 0
      })
    }
    
    barChartData.value.labels = last6Months.map(month => month.label)
    barChartData.value.datasets[0].data = last6Months.map(month => month.count)
    
  } catch (error) {
    console.error('Error loading chart data:', error)
    // Set default values on error
    pieChartData.value.datasets[0].data = [0, 0]
    barChartData.value.labels = ['No Data']
    barChartData.value.datasets[0].data = [0]
  } finally {
    loadingCharts.value = false
  }
}

onMounted(() => {
  loadChartData()
})
</script>

<style scoped>
.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.card-header h5 {
  color: #495057;
  font-weight: 600;
}

.fas {
  color: #007bff;
}
</style>