import { ref, onMounted, onUnmounted } from 'vue'

export function useOnlineStatus() {
  const isOnline = ref(navigator.onLine)

  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  const handleOnline = () => {
    isOnline.value = true
    console.log('App is now online')
  }

  const handleOffline = () => {
    isOnline.value = false
    console.log('App is now offline')
  }

  onMounted(() => {
    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Check initial status
    updateOnlineStatus()
  })

  onUnmounted(() => {
    // Remove event listeners
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  return {
    isOnline
  }
}