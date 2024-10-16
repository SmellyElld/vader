import ForecastView from '@/views/ForecastView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/forecast',
      name: 'forecast',
      component: ForecastView
    },
    {
      path: '/location',
      name: 'location',
      component: () => import('@/views/LocationsView.vue')
    }
  ],
})

export default router
