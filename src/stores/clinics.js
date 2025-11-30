import { defineStore } from 'pinia'

const CLINICS_CACHE_KEY = 'zest-well-clinics'
const CACHE_TIMESTAMP_KEY = 'zest-well-clinics-timestamp'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export const useClinicsStore = defineStore('clinics', {
  state: () => ({
    clinics: [],
    isUsingCachedData: false,
    defaultClinics: [
      {
        id: 1,
        name: 'Melbourne Community Health Centre',
        suburb: 'Melbourne',
        address: '109 Collins Street, Melbourne VIC 3000',
        services: ['General Practice', 'Mental Health', 'Dental'],
        rating: 4.5,
        coordinates: { lat: -37.8136, lng: 144.9631 },
      },
      {
        id: 2,
        name: 'Richmond Family Clinic',
        suburb: 'Richmond',
        address: '400 Swan Street, Richmond VIC 3121',
        services: ['General Practice', 'Pharmacy', "Women's Health"],
        rating: 4.2,
        coordinates: { lat: -37.8267, lng: 144.9941 },
      },
      {
        id: 3,
        name: 'Fitzroy Health Hub',
        suburb: 'Fitzroy',
        address: '10 Brunswick Street, Fitzroy VIC 3065',
        services: ['General Practice', 'Mental Health', 'Specialist Care'],
        rating: 4.7,
        coordinates: { lat: -37.7982, lng: 144.9784 },
      },
      {
        id: 4,
        name: 'St Kilda Community Clinic',
        suburb: 'St Kilda',
        address: '71 Acland Street, St Kilda VIC 3182',
        services: ['General Practice', 'Dental', 'Pharmacy'],
        rating: 4.3,
        coordinates: { lat: -37.8653, lng: 144.9742 },
      },
      {
        id: 5,
        name: 'Brunswick Medical Centre',
        suburb: 'Brunswick',
        address: '23 Sydney Road, Brunswick VIC 3056',
        services: ['General Practice', 'Mental Health', 'Youth Services'],
        rating: 4.1,
        coordinates: { lat: -37.7694, lng: 144.9581 },
      },
      {
        id: 6,
        name: 'Collingwood Family Health',
        suburb: 'Collingwood',
        address: '50 Smith Street, Collingwood VIC 3066',
        services: ['General Practice', "Women's Health", 'Dental'],
        rating: 4.4,
        coordinates: { lat: -37.805, lng: 144.9889 },
      },
    ],
  }),

  getters: {
    getClinicsBySuburb: (state) => (suburb) => {
      return state.clinics.filter((clinic) =>
        clinic.suburb.toLowerCase().includes(suburb.toLowerCase()),
      )
    },

    getClinicsByService: (state) => (service) => {
      return state.clinics.filter((clinic) =>
        clinic.services.some((s) => s.toLowerCase().includes(service.toLowerCase())),
      )
    },
  },

  actions: {
    getClinicById(id) {
      return this.clinics.find((clinic) => clinic.id === id)
    },

    // Load clinics with caching support
    async loadClinics() {
      try {
        // Check if we're online
        if (navigator.onLine) {
          // Online: try to use fresh data, fall back to cache if needed
          await this.loadFreshData()
        } else {
          // Offline: load from cache or use defaults
          this.loadFromCache()
        }
      } catch (error) {
        console.warn('Error loading clinics, using cached data:', error)
        this.loadFromCache()
      }
    },

    // Load fresh data from "server" (in this case, use default data)
    async loadFreshData() {
      try {
        // Simulating loading from server
        await new Promise(resolve => setTimeout(resolve, 100))
        
        this.clinics = [...this.defaultClinics]
        this.isUsingCachedData = false
        
        // Save the data to cache
        this.saveToCache()
        console.log('Loaded fresh clinic data')
        
      } catch (error) {
        console.error('Failed to load fresh data:', error)
        // Use cached data instead
        this.loadFromCache()
      }
    },

    // Save current clinic data to localStorage
    saveToCache() {
      try {
        localStorage.setItem(CLINICS_CACHE_KEY, JSON.stringify(this.clinics))
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
        console.log('Clinics data cached to localStorage')
      } catch (error) {
        console.warn('Failed to cache clinics data:', error)
      }
    },

    // Load clinic data from localStorage
    loadFromCache() {
      try {
        const cachedData = localStorage.getItem(CLINICS_CACHE_KEY)
        const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
        
        if (cachedData && cacheTimestamp) {
          const age = Date.now() - parseInt(cacheTimestamp)
          
          if (age < CACHE_DURATION) {
            // Cache is still good
            this.clinics = JSON.parse(cachedData)
            this.isUsingCachedData = true
            console.log('Loaded clinics from cache')
            return
          } else {
            console.log('Cache expired, using defaults')
          }
        }
        
        // No cache found, use default data
        this.clinics = [...this.defaultClinics]
        this.isUsingCachedData = true
        console.log('Using default clinic data (offline mode)')
        
      } catch (error) {
        console.error('Error loading from cache, using defaults:', error)
        this.clinics = [...this.defaultClinics]
        this.isUsingCachedData = true
      }
    },

    // Clear cache data
    clearCache() {
      try {
        localStorage.removeItem(CLINICS_CACHE_KEY)
        localStorage.removeItem(CACHE_TIMESTAMP_KEY)
        console.log('Clinic cache cleared')
      } catch (error) {
        console.warn('Failed to clear cache:', error)
      }
    }
  },
})
