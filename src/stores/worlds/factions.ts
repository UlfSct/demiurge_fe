import type { FileDetail, WorldArticle } from '@/types/utils.ts'
import { createBaseActionStore, createPaginatedResponseStore } from '@/utils/store.ts'
import { urls } from '@/urls'

export type WorldFactionsListItem = {
  id: number
  name: string
  caption: string
  images: FileDetail[]
  is_visible: boolean
  article: number | null
  world: number | null
}

export type WorldFactionDetail = {
  id: number
  name: string
  caption: string
  images: FileDetail[]
  files: FileDetail[]
  is_visible: boolean
  article: WorldArticle | null
  world: number | null
}

const useWorldFactionsStore = createPaginatedResponseStore<WorldFactionsListItem>({
  storeId: 'worldFactionsList',
  url: urls.WORLDS.DETAIL.FACTIONS.LIST,
})

const useWorldFactionDetailStore = createBaseActionStore<WorldFactionDetail>({
  storeId: 'worldFactionDetail',
  url: urls.WORLDS.DETAIL.FACTIONS.DETAIL,
})
