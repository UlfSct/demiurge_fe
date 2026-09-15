import type { RouteRecordRaw } from 'vue-router'
import routerNames from '@/router/names.ts'
import Main from '@/pages/Main.vue'
import Registration from '@/pages/user/Registration.vue'
import Login from '@/pages/user/Login.vue'
import Profile from '@/pages/user/Profile.vue'
import WorldsList from '@/pages/worlds/list/Page.vue'
import WorldDetail from '@/pages/worlds/detail/index/Page.vue'
import WorldAuthors from '@/pages/worlds/detail/authors/Page.vue'
import WorldImages from '@/pages/worlds/detail/images/Page.vue'
import WorldFiles from '@/pages/worlds/detail/files/Page.vue'
import WorldFactions from '@/pages/worlds/detail/factions/Page.vue'
import WorldLocations from '@/pages/worlds/detail/locations/Page.vue'
import WorldItems from '@/pages/worlds/detail/items/Page.vue'
import CharactersList from '@/pages/characters/List.vue'
import WorkspacesList from '@/pages/workspaces/List.vue'
import PartiesList from '@/pages/parties/List.vue'

const worldsRoutes: RouteRecordRaw[] = [
  {
    name: String(routerNames.WORLDS.LIST),
    path: '/worlds',
    component: WorldsList,
  },
  {
    name: String(routerNames.WORLDS.DETAIL.INDEX),
    path: '/worlds/:id',
    component: WorldDetail,
  },
  {
    name: String(routerNames.WORLDS.DETAIL.AUTHORS),
    path: '/worlds/:id/authors',
    component: WorldAuthors,
  },
  {
    name: String(routerNames.WORLDS.DETAIL.IMAGES),
    path: '/worlds/:id/images',
    component: WorldImages,
  },
  {
    name: String(routerNames.WORLDS.DETAIL.FILES),
    path: '/worlds/:id/files',
    component: WorldFiles,
  },
  {
    name: String(routerNames.WORLDS.DETAIL.FACTIONS),
    path: '/worlds/:id/factions',
    component: WorldFactions,
  },
  {
    name: String(routerNames.WORLDS.DETAIL.LOCATIONS),
    path: '/worlds/:id/locations',
    component: WorldLocations,
  },
  {
    name: String(routerNames.WORLDS.DETAIL.ITEMS),
    path: '/worlds/:id/items',
    component: WorldItems,
  },
]

const charactersRoutes: RouteRecordRaw[] = [
  {
    name: String(routerNames.CHARACTERS.LIST),
    path: '/characters',
    component: CharactersList,
  },
]

const workspacesRoutes: RouteRecordRaw[] = [
  {
    name: String(routerNames.WORKSPACES.LIST),
    path: '/workspaces',
    component: WorkspacesList,
  },
]

const partiesRoutes: RouteRecordRaw[] = [
  {
    name: String(routerNames.PARTIES.LIST),
    path: '/parties',
    component: PartiesList,
  },
]

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
  ...worldsRoutes,
  ...charactersRoutes,
  ...workspacesRoutes,
  ...partiesRoutes,
]

export default APP_ROUTES
