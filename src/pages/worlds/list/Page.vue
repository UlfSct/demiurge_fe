<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BasicTextBlock from '@/components/core/BasicTextBlock.vue'
import ListPageTemplate from '@/components/lists/ListPageTemplate.vue'
import WorldsTitle from '@/components/worlds/WorldsTitle.vue'
import { useClientListSearch } from '@/composables/useClientListSearch.ts'
import Worlds from '@/pages/worlds/list/Worlds.vue'
import WorldCreateDialog from '@/pages/worlds/list/modals/WorldCreateDialog.vue'
import WorldDeleteDialog from '@/pages/worlds/list/modals/WorldDeleteDialog.vue'
import WorldEditDialog from '@/pages/worlds/list/modals/WorldEditDialog.vue'
import routerNames from '@/router/names.ts'
import { useWorldsListStore } from '@/stores/worlds'

type WorldListFilter = 'all' | 'my' | 'available'

const FILTER_ITEMS: { title: string; value: WorldListFilter }[] = [
  { title: 'Все миры', value: 'all' },
  { title: 'Мои миры', value: 'my' },
  { title: 'Где я не автор', value: 'available' },
]

const router = useRouter()
const store = useWorldsListStore()
const { getItems, getLoading } = storeToRefs(store)

const { search, isSearching, filteredItems } = useClientListSearch(
  store,
  getItems,
  (item) => `${item.name} ${item.caption} ${item.demiurge}`,
)

const filter = ref<WorldListFilter>('all')
const selectedItemId = ref<number | null>(null)
const createDialogOpened = ref<boolean>(false)
const editDialogOpened = ref<boolean>(false)
const deleteDialogOpened = ref<boolean>(false)

// Стор живёт дольше страницы: сбрасываем фильтр, чтобы при следующем заходе
// состояние страницы совпадало с данными стора.
onBeforeUnmount(() => {
  store.deleteAdditionalQueryParam('my_world')
})

// Возврат со страницы детали после правки/удаления не должен показывать устаревший список.
onMounted(() => {
  store.reloadList(false)
})

const onFilterChange = (value: unknown): void => {
  const next = value as WorldListFilter
  filter.value = next

  if (next === 'my') {
    store.setAdditionalQueryParam('my_world', true)
    return
  }

  if (next === 'available') {
    store.setAdditionalQueryParam('my_world', false)
    return
  }

  store.deleteAdditionalQueryParam('my_world')
}

const onBackHandler = (): void => {
  router.push({
    name: routerNames.MAIN,
  })
}

const openCreateDialog = (): void => {
  createDialogOpened.value = true
}

const closeCreateDialog = (needReload: boolean): void => {
  createDialogOpened.value = false
  if (needReload) store.reloadList(false)
}

const openEditDialog = (id: number): void => {
  selectedItemId.value = id
  editDialogOpened.value = true
}

const closeEditDialog = (needReload: boolean): void => {
  editDialogOpened.value = false
  selectedItemId.value = null
  if (needReload) store.reloadList(false)
}

const openDeleteDialog = (id: number): void => {
  selectedItemId.value = id
  deleteDialogOpened.value = true
}

const closeDeleteDialog = (needReload: boolean): void => {
  deleteDialogOpened.value = false
  selectedItemId.value = null
  if (needReload) store.reloadList(true)
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
    <worlds
      v-if="filteredItems.length"
      :items="filteredItems"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
    />
    <basic-text-block v-else class="mt-2" text="Ничего не найдено" />
    <template #title>
      <worlds-title
        title="Доступные миры"
        breadcrumb-title="Миры"
        :loading="getLoading"
        @back="onBackHandler"
      />
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
  <world-create-dialog v-if="createDialogOpened" @close="closeCreateDialog" />
  <world-edit-dialog
    v-if="editDialogOpened && selectedItemId"
    :item-id="selectedItemId"
    @close="closeEditDialog"
  />
  <world-delete-dialog
    v-if="deleteDialogOpened && selectedItemId"
    :item-id="selectedItemId"
    @close="closeDeleteDialog"
  />
</template>

<style scoped></style>
