<template>
  <Transition name="slide-down">
    <div v-if="!isOnline" class="offline-banner">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="offline-content">
              <i class="fas fa-wifi-slash me-2"></i>
              <span class="fw-bold">You're offline.</span>
              <span class="ms-2">Some features may be limited. Using cached data where available.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useOnlineStatus } from '@/composables/useOnlineStatus'

const { isOnline } = useOnlineStatus()
</script>

<style scoped>
.offline-banner {
  background-color: #ffc107;
  color: #212529;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5a503;
  position: sticky;
  top: 0;
  z-index: 1020;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.offline-content {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}

.fa-wifi-slash {
  color: #dc3545;
}

/* Transition animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .offline-content {
    flex-direction: column;
    text-align: center;
    gap: 0.25rem;
  }
  
  .offline-content span {
    font-size: 0.9rem;
  }
}
</style>