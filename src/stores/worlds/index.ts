import { urls } from '@/urls'
import type { NumberSelectorItem } from '@/types/utils.ts'
import { createBaseActionStore, createPaginatedListStore } from '@/utils/store.ts'

export type WorldsListItem = {
  id: number
  demiurge: string
  authors: NumberSelectorItem[]
  is_demiurge: boolean
  is_author: boolean
  name: string
  caption: string
  is_public: boolean
  article: number | null
}

export const useWorldsListStore = createPaginatedListStore<WorldsListItem>({
  storeId: 'worldsList',
  url: urls.WORLDS.LIST,
})

export const useWorldsCreateStore = createBaseActionStore({
  storeId: 'worldsCreate',
  url: urls.WORLDS.CREATE,
})

export const useWorldsDeleteStore = createBaseActionStore({
  storeId: 'worldsDelete',
  url: urls.WORLDS.DETAIL.DEMIURGE.DELETE,
})

export const useWorldsAuthorEditStore = createBaseActionStore({
  storeId: 'worldsAuthorEdit',
  url: urls.WORLDS.DETAIL.AUTHOR.EDIT,
})

export const useWorldsDemiurgeEditStore = createBaseActionStore({
  storeId: 'worldsDelete',
  url: urls.WORLDS.DETAIL.DEMIURGE.EDIT,
})
