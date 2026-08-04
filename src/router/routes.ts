import type { RouteRecordRaw } from 'vue-router'
import routerNames from '@/router/names.ts'
import Main from '@/pages/Main.vue'
import Registration from '@/pages/user/Registration.vue'
import Login from '@/pages/user/Login.vue'
import Profile from '@/pages/user/Profile.vue'

const APP_ROUTES: RouteRecordRaw[] = [
  {
    name: String(routerNames.MAIN),
    path: '/',
    component: Main,
  },
  {
    name: String(routerNames.REGISTRATION),
    path: '/',
    component: Registration,
  },
  {
    name: String(routerNames.LOGIN),
    path: '/',
    component: Login,
  },
  {
    name: String(routerNames.PROFILE),
    path: '/',
    component: Profile,
  },
]

export default APP_ROUTES
