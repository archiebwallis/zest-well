<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">Zest Well</router-link>
      
      <!-- Mobile hamburger button -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Main navigation links -->
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/resources">Resources</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/find-services">Find Services</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/community">Community</router-link>
          </li>
        </ul>
        
        <!-- Login/logout area -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">Sign Up</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Navigation bar component with responsive design
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  transition: color 0.2s;
}

.nav-link:hover {
  color: rgba(255, 255, 255, 0.8) !important;
}

.router-link-active {
  font-weight: bold;
}
</style>