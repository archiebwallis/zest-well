<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps({
  clinics: {
    type: Array,
    required: true
  },
  searchLocation: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['location-found', 'directions-requested'])

const mapContainer = ref(null)
let map = null
let userLocation = null
const markers = ref([])

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJjaGllYndhbGxpcyIsImEiOiJjbWJuajU5eDUwaHNoMm9vYng5dnJlaW8zIn0.MkvAkBuBXuMtVXaXo_x87w'

onMounted(() => {
  initializeMap()
  getUserLocation()
  addClinicMarkers()
})

watch(() => props.searchLocation, (newSearch) => {
  if (newSearch) {
    geocodeAndFlyTo(newSearch)
  }
})

watch(() => props.clinics, () => {
  addClinicMarkers()
})

const initializeMap = () => {
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [144.9631, -37.8136], // Melbourne CBD
    zoom: 12
  })

  map.addControl(new mapboxgl.NavigationControl())
}

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = [position.coords.longitude, position.coords.latitude]
        
        // Add user location marker
        new mapboxgl.Marker({ color: 'blue' })
          .setLngLat(userLocation)
          .setPopup(new mapboxgl.Popup().setHTML('<strong>Your Location</strong>'))
          .addTo(map)
      },
      (error) => {
        console.log('Location access denied:', error)
      }
    )
  }
}

const addClinicMarkers = () => {
  // Remove existing markers
  markers.value.forEach(marker => marker.remove())
  markers.value = []

  // Add clinic markers
  props.clinics.forEach(clinic => {
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div>
        <h6>${clinic.name}</h6>
        <p>${clinic.suburb}</p>
        <p>${clinic.address}</p>
        <button 
          class="btn btn-sm btn-primary" 
          onclick="window.getDirections('${clinic.id}')"
        >
          Get Directions
        </button>
      </div>
    `)

    const marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([clinic.coordinates.lng, clinic.coordinates.lat])
      .setPopup(popup)
      .addTo(map)

    markers.value.push(marker)
  })

  // Make getDirections globally available
  window.getDirections = (clinicId) => {
    emit('directions-requested', clinicId)
  }
}

const geocodeAndFlyTo = async (query) => {
  if (!query) return

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=AU&types=place,postcode`
    )
    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center
      
      // Fly to the searched location
      map.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 2000
      })

      // Add search result marker
      new mapboxgl.Marker({ color: 'green' })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Search: ${query}</strong>`))
        .addTo(map)

      emit('location-found', { lat, lng, name: data.features[0].place_name })
    }
  } catch (error) {
    console.error('Geocoding error:', error)
  }
}

const showDirections = async (clinicId) => {
  if (!userLocation) {
    alert('Please allow location access to get directions')
    return
  }

  const clinic = props.clinics.find(c => c.id === clinicId)
  if (!clinic) return

  const start = userLocation
  const end = [clinic.coordinates.lng, clinic.coordinates.lat]

  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
    )
    const data = await response.json()

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0]

      // Remove existing route
      if (map.getSource('route')) {
        map.removeLayer('route')
        map.removeSource('route')
      }

      // Add route to map
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        }
      })

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#007bff',
          'line-width': 6
        }
      })

      // Fit map to route
      const bounds = new mapboxgl.LngLatBounds()
      bounds.extend(start)
      bounds.extend(end)
      map.fitBounds(bounds, { padding: 50 })
    }
  } catch (error) {
    console.error('Directions error:', error)
  }
}

// Expose methods for parent component
defineExpose({
  showDirections,
  geocodeAndFlyTo
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .map-container {
    height: 300px;
  }
}
</style>