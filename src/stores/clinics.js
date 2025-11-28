import { defineStore } from 'pinia'

export const useClinicsStore = defineStore('clinics', {
  state: () => ({
    clinics: [
      {
        id: 1,
        name: 'Melbourne Community Health Centre',
        suburb: 'Melbourne',
        address: '123 Collins Street, Melbourne VIC 3000',
        services: ['General Practice', 'Mental Health', 'Dental'],
        rating: 4.5,
        coordinates: { lat: -37.8136, lng: 144.9631 }
      },
      {
        id: 2,
        name: 'Richmond Family Clinic',
        suburb: 'Richmond',
        address: '456 Swan Street, Richmond VIC 3121',
        services: ['General Practice', 'Pharmacy', 'Women\'s Health'],
        rating: 4.2,
        coordinates: { lat: -37.8267, lng: 144.9941 }
      },
      {
        id: 3,
        name: 'Fitzroy Health Hub',
        suburb: 'Fitzroy',
        address: '789 Brunswick Street, Fitzroy VIC 3065',
        services: ['General Practice', 'Mental Health', 'Specialist Care'],
        rating: 4.7,
        coordinates: { lat: -37.7982, lng: 144.9784 }
      },
      {
        id: 4,
        name: 'St Kilda Community Clinic',
        suburb: 'St Kilda',
        address: '321 Acland Street, St Kilda VIC 3182',
        services: ['General Practice', 'Dental', 'Pharmacy'],
        rating: 4.3,
        coordinates: { lat: -37.8653, lng: 144.9742 }
      },
      {
        id: 5,
        name: 'Brunswick Medical Centre',
        suburb: 'Brunswick',
        address: '654 Sydney Road, Brunswick VIC 3056',
        services: ['General Practice', 'Mental Health', 'Youth Services'],
        rating: 4.1,
        coordinates: { lat: -37.7694, lng: 144.9581 }
      },
      {
        id: 6,
        name: 'Collingwood Family Health',
        suburb: 'Collingwood',
        address: '987 Smith Street, Collingwood VIC 3066',
        services: ['General Practice', 'Women\'s Health', 'Dental'],
        rating: 4.4,
        coordinates: { lat: -37.8050, lng: 144.9889 }
      }
    ]
  }),
  
  getters: {
    getClinicsBySuburb: (state) => (suburb) => {
      return state.clinics.filter(clinic => 
        clinic.suburb.toLowerCase().includes(suburb.toLowerCase())
      )
    },
    
    getClinicsByService: (state) => (service) => {
      return state.clinics.filter(clinic =>
        clinic.services.some(s => 
          s.toLowerCase().includes(service.toLowerCase())
        )
      )
    }
  },
  
  actions: {
    getClinicById(id) {
      return this.clinics.find(clinic => clinic.id === id)
    }
  }
})