<script setup lang="ts">
import { useWorldsListStore } from '@/stores/worlds'
import ListPageTemplate from '@/components/lists/ListPageTemplate.vue'
import { ref } from 'vue'
import WorldCreateDialog from '@/pages/worlds/list/modals/WorldCreateDialog.vue'
import WorldDeleteDialog from '@/pages/worlds/list/modals/WorldDeleteDialog.vue'
import { storeToRefs } from 'pinia'
import WorldEditDialog from '@/pages/worlds/list/modals/WorldEditDialog.vue'
import Worlds from '@/pages/worlds/list/Worlds.vue'
import { useRouter } from 'vue-router'
import routerNames from '@/router/names.ts'

const router = useRouter()
const store = useWorldsListStore()
const { getItems } = storeToRefs(store)

const selectedItemId = ref<number | null>(null)
const createDialogOpened = ref<boolean>(false)
const editDialogOpened = ref<boolean>(false)
const deleteDialogOpened = ref<boolean>(false)

const openCreateDialog = () => {
  createDialogOpened.value = true
}

const closeCreateDialog = (needReload: boolean) => {
  createDialogOpened.value = false
  if (needReload) store.reloadList(false)
}

const openEditDialog = (id: number) => {
  selectedItemId.value = id
  editDialogOpened.value = true
}
const closeEditDialog = (needReload: boolean) => {
  editDialogOpened.value = false
  selectedItemId.value = null
  if (needReload) store.reloadList(false)
}

const openDeleteDialog = (id: number) => {
  selectedItemId.value = id
  deleteDialogOpened.value = true
}

const closeDeleteDialog = (needReload: boolean) => {
  deleteDialogOpened.value = false
  selectedItemId.value = null
  if (needReload) store.reloadList(true)
}

const onBackHandler = () => {
  router.push({
    name: routerNames.MAIN,
  })
}
</script>

<template>
  <list-page-template
    :store="store"
    title="Доступные миры"
    @create="openCreateDialog"
    @back="onBackHandler"
  >
    <worlds :items="getItems" @edit="openEditDialog" @delete="openDeleteDialog" />
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
