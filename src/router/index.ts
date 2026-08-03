import { createRouter, createWebHistory } from 'vue-router'
import APP_ROUTES from '@/router/routes.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...APP_ROUTES],
})

export default router
