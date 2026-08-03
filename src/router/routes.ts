import type { RouteRecordRaw } from 'vue-router'
import ROUTER_NAMES from '@/router/names.ts'
import Main from '@/pages/Main.vue'

const APP_ROUTES: RouteRecordRaw[] = [
  {
    name: String(ROUTER_NAMES.MAIN),
    path: '/',
    component: Main,
  },
]

export default APP_ROUTES
