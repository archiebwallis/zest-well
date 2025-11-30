<script setup>
import NavBar from './components/NavBar.vue'
import OfflineBanner from './components/OfflineBanner.vue'
</script>

<template>
  <div id="app">
    <!-- Skip to main content link -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <NavBar />
    <OfflineBanner />
    <main id="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global accessibility styles */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 10000;
}

.skip-link:focus {
  top: 6px;
}

/* Focus indicators for all interactive elements */
*:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Better focus for buttons */
button:focus,
.btn:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* Better focus for form inputs */
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  border-color: #007bff;
}

/* Better focus for links */
a:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  text-decoration: underline;
}
</style>
