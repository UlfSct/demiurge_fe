import type { FileDetail, NumberSelectorItem, WorldArticle } from '@/types/utils.ts'
import type { PaginatedResponse } from '@/types/requests.ts'
import type { WorldsArticleRequestData } from '@/stores/worlds'
import { createBaseActionStore, createBaseResponseStore } from '@/utils/store.ts'
import { urls } from '@/urls'

export type WorldLightLocation = {
  id: number
  name: string
}

export type WorldLocationsListItem = {
  id: number
  name: string
  caption: string
  images: FileDetail[]
  location_type: NumberSelectorItem
  parent: WorldLightLocation | null
  is_visible: boolean
  article: number | null
  world: number | null
}

export type WorldLocationDetail = {
  id: number
  name: string
  caption: string
  images: FileDetail[]
  files: FileDetail[]
  location_type: NumberSelectorItem
  parent: WorldLightLocation | null
  children: WorldLightLocation[]
  is_visible: boolean
  article: WorldArticle | null
  world: number | null
}

export type LocationRequestData = {
  name: string
  caption: string
  location_type: number
  parent: number | null
  is_visible: boolean
  world: number
}

export const useWorldLocationsStore = createBaseResponseStore<
  PaginatedResponse<WorldLocationsListItem>
>({
  storeId: 'worldLocations',
  url: urls.WORLDS.DETAIL.LOCATIONS.LIST,
})

export const useLocationDetailStore = createBaseResponseStore<WorldLocationDetail>({
  storeId: 'locationDetail',
  url: urls.WORLDS.DETAIL.LOCATIONS.DETAIL,
})

export const useLocationTypesStore = createBaseResponseStore<NumberSelectorItem[]>({
  storeId: 'locationTypes',
  url: urls.SELECTORS.LOCATIONS,
})

export const useLocationCreateStore = createBaseActionStore<LocationRequestData>({
  storeId: 'locationCreate',
  url: urls.WORLDS.DETAIL.LOCATIONS.CREATE,
})

export const useLocationEditStore = createBaseActionStore<LocationRequestData>({
  storeId: 'locationEdit',
  url: urls.WORLDS.DETAIL.LOCATIONS.EDIT,
})

export const useLocationDeleteStore = createBaseActionStore({
  storeId: 'locationDelete',
  url: urls.WORLDS.DETAIL.LOCATIONS.DELETE,
})

export const useLocationArticleCreateStore = createBaseActionStore<WorldsArticleRequestData>({
  storeId: 'locationArticleCreate',
  url: urls.WORLDS.DETAIL.LOCATIONS.ARTICLE.CREATE,
})

export const useLocationArticleEditStore = createBaseActionStore<WorldsArticleRequestData>({
  storeId: 'locationArticleEdit',
  url: urls.WORLDS.DETAIL.LOCATIONS.ARTICLE.EDIT,
})

export const useLocationFileCreateStore = createBaseActionStore<FormData>({
  storeId: 'locationFileCreate',
  url: urls.WORLDS.DETAIL.LOCATIONS.FILES.CREATE,
})

export const useLocationFileDeleteStore = createBaseActionStore({
  storeId: 'locationFileDelete',
  url: urls.WORLDS.DETAIL.LOCATIONS.FILES.DELETE,
})
