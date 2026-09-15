import type { FileDetail, NumberSelectorItem, WorldArticle } from '@/types/utils.ts'
import { createBaseActionStore, createPaginatedResponseStore } from '@/utils/store.ts'
import { urls } from '@/urls'

export type WorldItemsListItem = {
  id: number
  name: string
  caption: string
  images: FileDetail[]
  item_type: NumberSelectorItem
  is_visible: boolean
  article: number | null
  world: number | null
}

export type WorldItemDetail = {
  id: number
  name: string
  caption: string
  images: FileDetail[]
  files: FileDetail[]
  item_type: NumberSelectorItem
  is_visible: boolean
  article: WorldArticle | null
  world: number | null
}

const useWorldItemsStore = createPaginatedResponseStore<WorldItemsListItem>({
  storeId: 'worldItemsList',
  url: urls.WORLDS.DETAIL.ITEMS.LIST,
})

const useWorldItemDetailStore = createBaseActionStore<WorldItemDetail>({
  storeId: 'worldItemDetail',
  url: urls.WORLDS.DETAIL.ITEMS.DETAIL,
})
