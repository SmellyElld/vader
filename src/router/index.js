import ForecastView from '@/views/ForecastView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'forecast',
      component: ForecastView
    },
    {
      path: '/location',
      name: 'location',
      component: () => import('@/views/LocationsView.vue')
    },
    {
      path: '/forecast/:location',
      name: 'forecast_location',
      component: ForecastView,
      props: true
    }
  ],
})

export default router
