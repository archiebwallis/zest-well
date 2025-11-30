<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1>Clinic Management</h1>
        <p class="lead">Manage health clinic listings</p>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <!-- Export Buttons -->
        <div class="mb-3">
          <button 
            @click="exportClinicsCSV" 
            class="btn btn-outline-success me-2"
          >
            Export CSV
          </button>
          <button 
            @click="exportClinicsPDF" 
            class="btn btn-outline-danger"
          >
            Export PDF
          </button>
        </div>
        
        <DataTable 
          :data="tableData" 
          :columns="columns"
        >
          <template #services="{ value }">
            <span class="badge bg-secondary me-1" v-for="service in value" :key="service">
              {{ service }}
            </span>
          </template>
          <template #rating="{ value }">
            <span class="fw-bold">{{ value.toFixed(1) }}</span>/5
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useClinicsStore } from '@/stores/clinics'
import { exportToCSV, exportToPDF } from '@/utils/export'
import DataTable from '@/components/DataTable.vue'

const clinicsStore = useClinicsStore()

const columns = [
  { key: 'name', label: 'Clinic Name' },
  { key: 'suburb', label: 'Suburb' },
  { key: 'services', label: 'Services' },
  { key: 'rating', label: 'Rating' }
]

const tableData = computed(() => {
  return clinicsStore.clinics.map(clinic => ({
    id: clinic.id,
    name: clinic.name,
    suburb: clinic.suburb,
    services: clinic.services,
    rating: clinic.rating || 0
  }))
})

const exportClinicsCSV = () => {
  const clinicData = clinicsStore.clinics
  exportToCSV(clinicData, 'clinics-export.csv')
}

const exportClinicsPDF = () => {
  const clinicData = clinicsStore.clinics
  exportToPDF(clinicData, 'clinics-report.pdf', 'Clinic Directory Report')
}
</script>