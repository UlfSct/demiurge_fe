import { urls } from '@/urls'
import type { FileDetail, NumberSelectorItem, WorldArticle } from '@/types/utils.ts'
import {
  createBaseActionStore,
  createBaseResponseStore,
  createPaginatedResponseStore,
} from '@/utils/store.ts'

export type WorldsListItem = {
  id: number
  name: string
  caption: string
  is_public: boolean
  demiurge: string
  is_demiurge: boolean
  is_author: boolean
  authors: NumberSelectorItem[]
  images: FileDetail[]
  article: number | null
}

export type WorldDetail = {
  id: number
  name: string
  caption: string
  is_public: boolean
  demiurge: string
  is_demiurge: boolean
  is_author: boolean
  authors: NumberSelectorItem[]
  images: FileDetail[]
  files: FileDetail[]
  article: WorldArticle | null
}

export type WorldsCreateRequestData = {
  name: string
  caption: string
  is_public: boolean
}

export type WorldsAuthorEditRequestData = {
  name: string
  caption: string
  is_public: boolean
}

export const useWorldsListStore = createPaginatedResponseStore<WorldsListItem>({
  storeId: 'worldsList',
  url: urls.WORLDS.LIST,
})

export const useWorldsDetailStore = createBaseResponseStore<WorldDetail>({
  storeId: 'worldsDetail',
  url: urls.WORLDS.DETAIL.GET,
})

export const useWorldsCreateStore = createBaseActionStore<WorldsCreateRequestData>({
  storeId: 'worldsCreate',
  url: urls.WORLDS.CREATE,
})

export const useWorldsDeleteStore = createBaseActionStore({
  storeId: 'worldsDelete',
  url: urls.WORLDS.DETAIL.DEMIURGE.DELETE,
})

export const useWorldsAuthorEditStore = createBaseActionStore<WorldsAuthorEditRequestData>({
  storeId: 'worldsAuthorEdit',
  url: urls.WORLDS.DETAIL.AUTHOR.EDIT,
})

export const useWorldsDemiurgeEditStore = createBaseActionStore({
  storeId: 'worldsDelete',
  url: urls.WORLDS.DETAIL.DEMIURGE.EDIT,
})
