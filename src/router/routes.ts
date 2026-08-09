import type { RouteRecordRaw } from 'vue-router'
import routerNames from '@/router/names.ts'
import Main from '@/pages/Main.vue'
import Registration from '@/pages/user/Registration.vue'
import Login from '@/pages/user/Login.vue'
import Profile from '@/pages/user/Profile.vue'
import WorldsList from '@/pages/worlds/List.vue'
import CharactersList from '@/pages/characters/List.vue'
import WorkspacesList from '@/pages/workspaces/List.vue'
import PartiesList from '@/pages/parties/List.vue'

const APP_ROUTES: RouteRecordRaw[] = [
  {
    name: String(routerNames.MAIN),
    path: '/',
    component: Main,
  },
  {
    name: String(routerNames.REGISTRATION),
    path: '/registration',
    component: Registration,
  },
  {
    name: String(routerNames.LOGIN),
    path: '/login',
    component: Login,
  },
  {
    name: String(routerNames.PROFILE),
    path: '/profile',
    component: Profile,
  },
  {
    name: String(routerNames.WORlDS.LIST),
    path: '/worlds',
    component: WorldsList,
  },
  {
    name: String(routerNames.CHARACTERS.LIST),
    path: '/characters',
    component: CharactersList,
  },
  {
    name: String(routerNames.WORKSPACES.LIST),
    path: '/workspaces',
    component: WorkspacesList,
  },
  {
    name: String(routerNames.PARTIES.LIST),
    path: '/parties',
    component: PartiesList,
  },
]

export default APP_ROUTES
