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
          <li class="nav-item" v-if="userStore.currentUser">
            <router-link class="nav-link" to="/book-appointment">Book Appointment</router-link>
          </li>
        </ul>

        <!-- Admin links for staff users -->
        <ul class="navbar-nav me-auto" v-if="userStore.userRole === 'staff'">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="adminDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Admin
            </a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/admin">User Management</router-link></li>
              <li><router-link class="dropdown-item" to="/admin/clinics">Clinic Management</router-link></li>
            </ul>
          </li>
        </ul>

        <!-- Login/logout area -->
        <ul class="navbar-nav">
          <template v-if="!userStore.currentUser">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Sign Up</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <span class="nav-link">Welcome, User!</span>
            </li>
            <li class="nav-item">
              <button class="nav-link btn btn-link" @click="handleLogout">Logout</button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  await userStore.logout()
  router.push('/')
}
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

.btn-link.nav-link {
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  padding: 0.5rem 1rem;
}

.btn-link.nav-link:hover {
  color: rgba(255, 255, 255, 0.8);
}
</style>
