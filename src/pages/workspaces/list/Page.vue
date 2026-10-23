<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BasicTextBlock from '@/components/core/BasicTextBlock.vue'
import ListPageTemplate from '@/components/lists/ListPageTemplate.vue'
import WorkspacesTitle from '@/components/workspaces/WorkspacesTitle.vue'
import Workspaces from '@/pages/workspaces/list/Workspaces.vue'
import WorkspaceCreateDialog from '@/pages/workspaces/list/modals/WorkspaceCreateDialog.vue'
import WorkspaceJoinDialog from '@/pages/workspaces/list/modals/WorkspaceJoinDialog.vue'
import WorkspaceLeaveDialog from '@/pages/workspaces/list/modals/WorkspaceLeaveDialog.vue'
import routerNames from '@/router/names.ts'
import { useWorkspacesListStore, type WorkspaceListItem } from '@/stores/workspaces'
import { ITEMS_PER_PAGE_SELECTOR_ITEMS } from '@/utils/consts.ts'

type WorkspaceListFilter = 'all' | 'my' | 'available'

const FILTER_ITEMS: { title: string; value: WorkspaceListFilter }[] = [
  { title: 'Все пространства', value: 'all' },
  { title: 'Мои пространства', value: 'my' },
  { title: 'Доступные для входа', value: 'available' },
]

// API не умеет искать по названию, поэтому на время поиска грузим весь список одной страницей.
const SEARCH_ITEMS_PER_PAGE = 500

const router = useRouter()
const store = useWorkspacesListStore()
const { getItems, getLoading } = storeToRefs(store)

const search = ref<string>('')
const savedItemsPerPage = ref<number | null>(null)
const filter = ref<WorkspaceListFilter>('all')
const createDialogOpened = ref<boolean>(false)
const joinDialogOpened = ref<boolean>(false)
const leaveDialogOpened = ref<boolean>(false)
const selectedItem = ref<WorkspaceListItem | null>(null)

const isSearching = computed(() => search.value.trim().length > 0)

const filteredItems = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return getItems.value

  return getItems.value.filter((item) => {
    const name = item.name.toLowerCase()
    const owner = item.owner ? item.owner.toLowerCase() : ''
    return name.includes(query) || owner.includes(query)
  })
})

watch(isSearching, (value) => {
  if (value) {
    savedItemsPerPage.value = store.getItemsPerPage
    store.setPage(1)
    store.setItemsPerPage(SEARCH_ITEMS_PER_PAGE)
    return
  }

  const itemsPerPage = savedItemsPerPage.value ?? Number(ITEMS_PER_PAGE_SELECTOR_ITEMS[0])
  savedItemsPerPage.value = null
  store.setPage(1)
  store.setItemsPerPage(itemsPerPage)
})

// Стор живёт дольше страницы: возвращаем размер страницы и сбрасываем фильтр,
// чтобы при следующем заходе состояние страницы совпадало с данными стора.
onBeforeUnmount(() => {
  if (savedItemsPerPage.value !== null) {
    store.setItemsPerPage(savedItemsPerPage.value)
    savedItemsPerPage.value = null
  }
  store.deleteAdditionalQueryParam('my_workspaces')
})

const onBackHandler = (): void => {
  router.push({
    name: routerNames.MAIN,
  })
}

const onFilterChange = (value: unknown): void => {
  const next = value as WorkspaceListFilter
  filter.value = next

  if (next === 'my') {
    store.setAdditionalQueryParam('my_workspaces', true)
    return
  }

  if (next === 'available') {
    store.setAdditionalQueryParam('my_workspaces', false)
    return
  }

  store.deleteAdditionalQueryParam('my_workspaces')
}

const openCreateDialog = (): void => {
  createDialogOpened.value = true
}

const closeCreateDialog = (needReload: boolean): void => {
  createDialogOpened.value = false
  if (needReload) store.reloadList(false)
}

const openJoinDialog = (item: WorkspaceListItem): void => {
  selectedItem.value = item
  joinDialogOpened.value = true
}

const closeJoinDialog = (needReload: boolean): void => {
  joinDialogOpened.value = false
  selectedItem.value = null
  if (needReload) store.reloadList(false)
}

const openLeaveDialog = (item: WorkspaceListItem): void => {
  selectedItem.value = item
  leaveDialogOpened.value = true
}

const closeLeaveDialog = (needReload: boolean): void => {
  leaveDialogOpened.value = false
  selectedItem.value = null
  if (needReload) store.reloadList(false)
}
</script>

<template>
  <list-page-template
    v-model:search="search"
    :store="store"
    searchable
    :show-pagination="!isSearching"
    @create="openCreateDialog"
    @back="onBackHandler"
  >
    <workspaces
      v-if="filteredItems.length"
      :items="filteredItems"
      @join="openJoinDialog"
      @leave="openLeaveDialog"
    />
    <basic-text-block v-else-if="isSearching" class="mt-2" text="Ничего не найдено" />
    <template #title>
      <workspaces-title title="Рабочие пространства" :loading="getLoading" @back="onBackHandler" />
      <v-card class="default-card px-5 py-3 w-100 mt-2">
        <v-row no-gutters class="align-center flex-wrap">
          <span class="card-title__subtitle pr-3">Показать</span>
          <v-select
            :model-value="filter"
            class="form-input max-width-250"
            :items="FILTER_ITEMS"
            item-title="title"
            item-value="value"
            density="compact"
            hide-details
            :readonly="getLoading"
            @update:model-value="onFilterChange"
          />
        </v-row>
      </v-card>
    </template>
  </list-page-template>
  <workspace-create-dialog v-if="createDialogOpened" @close="closeCreateDialog" />
  <workspace-join-dialog
    v-if="joinDialogOpened && selectedItem"
    :workspace="selectedItem"
    @close="closeJoinDialog"
  />
  <workspace-leave-dialog
    v-if="leaveDialogOpened && selectedItem"
    :workspace="selectedItem"
    @close="closeLeaveDialog"
  />
</template>

<style scoped></style>
