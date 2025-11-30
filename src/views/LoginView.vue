<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">Login</h2>
            <form @submit="handleSubmit">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  id="email" 
                  placeholder="Enter email"
                  v-model="formData.email"
                >
                <div class="invalid-feedback" v-if="errors.email" role="alert" aria-live="polite">
                  {{ errors.email }}
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  id="password" 
                  placeholder="Enter password"
                  v-model="formData.password"
                >
                <div class="invalid-feedback" v-if="errors.password" role="alert" aria-live="polite">
                  {{ errors.password }}
                </div>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="remember">
                <label class="form-check-label" for="remember">Remember me</label>
              </div>
              <div class="alert alert-danger" v-if="errors.general" role="alert" aria-live="assertive">
                {{ errors.general }}
              </div>
              <button 
                type="submit" 
                class="btn btn-primary w-100"
                :disabled="!isFormValid || isSubmitting"
              >
                {{ isSubmitting ? 'Logging in...' : 'Login' }}
              </button>
            </form>
            <div class="text-center mt-3">
              <p class="mb-1">
                <a href="#" class="text-decoration-none">Forgot password?</a>
              </p>
              <p>
                Don't have an account? 
                <router-link to="/register" class="text-decoration-none">Sign up</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formData = ref({
  email: '',
  password: ''
})

const errors = ref({})
const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return formData.value.email && formData.value.password
})

const validateForm = () => {
  errors.value = {}

  if (!formData.value.email) {
    errors.value.email = 'Email is required'
  }

  if (!formData.value.password) {
    errors.value.password = 'Password is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async (event) => {
  event.preventDefault()
  
  if (validateForm() && !isSubmitting.value) {
    isSubmitting.value = true
    
    try {
      await userStore.login(formData.value.email, formData.value.password)
      router.push('/dashboard')
    } catch (error) {
      errors.value.general = error.message
    } finally {
      isSubmitting.value = false
    }
  }
}
</script>