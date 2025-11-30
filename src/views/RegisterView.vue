<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">Create Account</h2>
            <form @submit="handleSubmit">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="firstName" class="form-label">First Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    :class="{ 'is-invalid': errors.firstName }"
                    id="firstName" 
                    placeholder="First name"
                    v-model="formData.firstName"
                  >
                  <div class="invalid-feedback" v-if="errors.firstName">
                    {{ errors.firstName }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input 
                    type="text" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.lastName }"
                    id="lastName" 
                    placeholder="Last name"
                    v-model="formData.lastName"
                  >
                  <div class="invalid-feedback" v-if="errors.lastName">
                    {{ errors.lastName }}
                  </div>
                </div>
              </div>
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
                <div class="invalid-feedback" v-if="errors.email">
                  {{ errors.email }}
                </div>
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.phone }"
                  id="phone" 
                  placeholder="Enter phone number"
                  v-model="formData.phone"
                >
                <div class="invalid-feedback" v-if="errors.phone">
                  {{ errors.phone }}
                </div>
              </div>
              <div class="mb-3">
                <label for="suburb" class="form-label">Suburb</label>
                <input 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.suburb }"
                  id="suburb" 
                  placeholder="Enter suburb"
                  v-model="formData.suburb"
                >
                <div class="invalid-feedback" v-if="errors.suburb">
                  {{ errors.suburb }}
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  id="password" 
                  placeholder="Create password"
                  v-model="formData.password"
                >
                <div class="invalid-feedback" v-if="errors.password">
                  {{ errors.password }}
                </div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  id="confirmPassword" 
                  placeholder="Confirm password"
                  v-model="formData.confirmPassword"
                >
                <div class="invalid-feedback" v-if="errors.confirmPassword">
                  {{ errors.confirmPassword }}
                </div>
              </div>
              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input"
                  :class="{ 'is-invalid': errors.terms }"
                  id="terms"
                  v-model="formData.terms"
                >
                <label class="form-check-label" for="terms">
                  I agree to the <a href="#" class="text-decoration-none">Terms of Service</a>
                </label>
                <div class="invalid-feedback" v-if="errors.terms">
                  {{ errors.terms }}
                </div>
              </div>
              <div class="alert alert-danger" v-if="errors.general">
                {{ errors.general }}
              </div>
              <button 
                type="submit" 
                class="btn btn-primary w-100"
                :disabled="!isFormValid || isSubmitting"
              >
                {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
              </button>
            </form>
            <div class="text-center mt-3">
              <p>
                Already have an account? 
                <router-link to="/login" class="text-decoration-none">Sign in</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// This form uses client-side validation to prevent invalid data submission
// Additional server-side validation and sanitization occurs in the user store
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  suburb: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const errors = ref({})
const isSubmitting = ref(false)

const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

const validateForm = () => {
  errors.value = {}

  if (!formData.value.firstName) {
    errors.value.firstName = 'First name is required'
  }

  if (!formData.value.lastName) {
    errors.value.lastName = 'Last name is required'
  }

  if (!formData.value.email) {
    errors.value.email = 'Email is required'
  } else if (!isValidEmail(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  if (!formData.value.phone) {
    errors.value.phone = 'Phone number is required'
  }

  if (!formData.value.suburb) {
    errors.value.suburb = 'Suburb is required'
  }

  if (!formData.value.password) {
    errors.value.password = 'Password is required'
  } else if (formData.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters long'
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  if (!formData.value.terms) {
    errors.value.terms = 'You must agree to the Terms of Service'
  }

  return Object.keys(errors.value).length === 0
}

const isFormValid = computed(() => {
  return formData.value.firstName &&
         formData.value.lastName &&
         formData.value.email &&
         isValidEmail(formData.value.email) &&
         formData.value.phone &&
         formData.value.suburb &&
         formData.value.password &&
         formData.value.password.length >= 8 &&
         formData.value.confirmPassword &&
         formData.value.password === formData.value.confirmPassword &&
         formData.value.terms
})

const handleSubmit = async (event) => {
  event.preventDefault()
  
  if (validateForm() && !isSubmitting.value) {
    isSubmitting.value = true
    
    try {
      await userStore.register(formData.value)
      router.push('/dashboard')
    } catch (error) {
      errors.value.general = error.message
    } finally {
      isSubmitting.value = false
    }
  }
}
</script>