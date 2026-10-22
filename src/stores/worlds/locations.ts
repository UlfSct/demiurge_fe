import type { FileDetail, NumberSelectorItem, WorldArticle } from '@/types/utils.ts'
import { createBaseActionStore, createPaginatedResponseStore } from '@/utils/store.ts'
import { urls } from '@/urls'

export type WorldLightLocation = {
  id: number
  string: string
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

const useWorldLocationsStore = createPaginatedResponseStore<WorldLocationsListItem>({
  storeId: 'worldLocationsList',
  url: urls.WORLDS.DETAIL.LOCATIONS.LIST,
})

const useWorldLocationDetailStore = createBaseActionStore<WorldLocationDetail>({
  storeId: 'worldLocationDetail',
  url: urls.WORLDS.DETAIL.LOCATIONS.DETAIL,
})
