<template>
  <div class="card">
    <div class="card-body">
      <!-- Table -->
      <div class="table-responsive">
        <table class="table table-striped">
          <thead class="table-dark">
            <!-- Column Headers -->
            <tr>
              <th 
                v-for="column in columns" 
                :key="column.key"
                class="sortable-header"
                @click="toggleSort(column.key)"
              >
                {{ column.label }}
                <span v-if="sortBy === column.key">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
            <!-- Filter Inputs -->
            <tr>
              <th v-for="column in columns" :key="column.key + '-filter'">
                <input 
                  v-model="columnFilters[column.key]"
                  type="text" 
                  class="form-control form-control-sm"
                  :placeholder="'Filter ' + column.label"
                >
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in paginatedData" :key="row.id || Math.random()">
              <td v-for="column in columns" :key="column.key">
                <slot 
                  :name="column.key" 
                  :value="getColumnValue(row, column.key)" 
                  :row="row"
                >
                  {{ getColumnValue(row, column.key) }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Data Message -->
      <div v-if="filteredData.length === 0" class="text-muted text-center py-3">
        No data found
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-3">
        <div>
          <small class="text-muted">
            Page {{ currentPage }} of {{ totalPages }} ({{ filteredData.length }} total items)
          </small>
        </div>
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button 
                class="page-link" 
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
              >
                Previous
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button 
                class="page-link" 
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  }
})

const sortBy = ref('')
const sortOrder = ref('asc')
const columnFilters = ref({})
const currentPage = ref(1)
const itemsPerPage = 10

// Set up filters
watch(() => props.columns, (newColumns) => {
  newColumns.forEach(column => {
    if (!columnFilters.value[column.key]) {
      columnFilters.value[column.key] = ''
    }
  })
}, { immediate: true })

const getColumnValue = (row, key) => {
  return row[key] || ''
}

const filteredData = computed(() => {
  let data = [...props.data]
  
  // Apply column filters
  Object.keys(columnFilters.value).forEach(key => {
    const filterValue = columnFilters.value[key]
    if (filterValue) {
      data = data.filter(row => {
        const cellValue = getColumnValue(row, key).toString().toLowerCase()
        return cellValue.includes(filterValue.toLowerCase())
      })
    }
  })
  
  // Apply sorting
  if (sortBy.value) {
    data.sort((a, b) => {
      const aVal = getColumnValue(a, sortBy.value)
      const bVal = getColumnValue(b, sortBy.value)
      
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return data
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredData.value.slice(start, end)
})

const toggleSort = (columnKey) => {
  if (sortBy.value === columnKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = columnKey
    sortOrder.value = 'asc'
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Reset page when filters change
watch(filteredData, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.sortable-header {
  cursor: pointer;
  user-select: none;
}

.sortable-header:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>