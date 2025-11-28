<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1>Dashboard</h1>
        <p class="lead">Welcome back! Here's an overview of health activities</p>
      </div>
    </div>

    <div class="row mt-4">
      <!-- Quick Stats -->
      <div class="col-md-3 mb-4">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h5 class="card-title">Health Check-ins</h5>
            <h2 class="mb-0">12</h2>
            <small>This month</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-4">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h5 class="card-title">Goals Achieved</h5>
            <h2 class="mb-0">8</h2>
            <small>This month</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-4">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h5 class="card-title">Appointments</h5>
            <h2 class="mb-0">3</h2>
            <small>Upcoming</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-4">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <h5 class="card-title">Resources Saved</h5>
            <h2 class="mb-0">15</h2>
            <small>Total</small>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Recent Activity -->
      <div class="col-md-8 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Recent Activity</h5>
          </div>
          <div class="card-body">
            <div class="list-group list-group-flush">
              <div class="list-group-item d-flex justify-content-between">
                <span>Completed health screening</span>
                <small class="text-muted">2 days ago</small>
              </div>
              <div class="list-group-item d-flex justify-content-between">
                <span>Joined nutrition support group</span>
                <small class="text-muted">1 week ago</small>
              </div>
              <div class="list-group-item d-flex justify-content-between">
                <span>Saved dental clinic location</span>
                <small class="text-muted">2 weeks ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-md-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Quick Actions</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/find-services" class="btn btn-outline-primary">Find Services</router-link>
              <router-link to="/resources" class="btn btn-outline-secondary">View Resources</router-link>
              <router-link to="/community" class="btn btn-outline-success">Join Groups</router-link>
              <button class="btn btn-outline-danger">Book Appointment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// User dashboard with stats and quick actions
</script>