<template>
  <div class="container-fluid">
    <!-- Hero Section -->
    <div class="row bg-primary text-white py-5">
      <div class="col-12 text-center">
        <h1 class="display-4 fw-bold">Zest Well</h1>
        <p class="lead">Supporting healthy communities for low-income families</p>
        <router-link to="/find-services" class="btn btn-light btn-lg mt-3">
          Find Services Near Me
        </router-link>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="row mt-5 mb-5">
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Health Resources</h5>
            <p class="card-text">Access nutrition guides, wellness tips, and health information</p>
            <router-link to="/resources" class="btn btn-outline-primary">Learn More</router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Find Services</h5>
            <p class="card-text">Locate nearby health clinics and community services</p>
            <router-link to="/find-services" class="btn btn-outline-primary">Search Now</router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">Community Support</h5>
            <p class="card-text">Connect with support groups and community programs</p>
            <router-link to="/community" class="btn btn-outline-primary">Join Now</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home page component for Zest Well
</script>

<style scoped>
.bg-primary {
  background-color: #007bff;
}
</style>