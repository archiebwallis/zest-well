<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1>Find Services</h1>
        <p class="lead">Locate health clinics and services in the community</p>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-8">
        <!-- Search Bar -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Search for Services</h5>
            <div class="row">
              <div class="col-md-8 mb-2">
                <input type="text" class="form-control" placeholder="Enter suburb or postcode">
              </div>
              <div class="col-md-4">
                <button class="btn btn-primary w-100">Search</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Map Placeholder -->
        <div class="card">
          <div class="card-body">
            <div class="bg-light rounded p-5 text-center" style="min-height: 300px;">
              <p class="text-muted">Interactive map will be added here</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Service Types</h5>
          </div>
          <div class="card-body">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="gp">
              <label class="form-check-label" for="gp">General Practice</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="dental">
              <label class="form-check-label" for="dental">Dental Services</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="mental">
              <label class="form-check-label" for="mental">Mental Health</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="pharmacy">
              <label class="form-check-label" for="pharmacy">Pharmacy</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Find services page with search and map placeholder
</script>