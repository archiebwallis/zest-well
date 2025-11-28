import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/resources',
      name: 'Resources',
      component: () => import('../views/ResourcesView.vue')
    },
    {
      path: '/find-services',
      name: 'FindServices',
      component: () => import('../views/FindServicesView.vue')
    },
    {
      path: '/community',
      name: 'Community',
      component: () => import('../views/CommunityView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

export default router
