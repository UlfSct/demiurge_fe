<script setup lang="ts">
import { useWorldsListStore } from '@/stores/worlds'
import ListPageTemplate from '@/components/lists/ListPageTemplate.vue'
import { ref } from 'vue'
import WorldCreateDialog from '@/pages/worlds/list/modals/WorldCreateDialog.vue'
import WorldDeleteDialog from '@/pages/worlds/list/modals/WorldDeleteDialog.vue'
import { storeToRefs } from 'pinia'
import WorldAuthorEditDialog from '@/pages/worlds/list/modals/WorldAuthorEditDialog.vue'
import WorldDemiurgeEditDialog from '@/pages/worlds/list/modals/WorldDemiurgeEditDialog.vue'

const store = useWorldsListStore()
const { getItems } = storeToRefs(store)

const createDialogOpened = ref<boolean>(false)
const authorEditDialogOpened = ref<boolean>(false)
const demiurgeEditDialogOpened = ref<boolean>(false)
const deleteDialogOpened = ref<boolean>(false)

const openCreateDialog = () => {
  createDialogOpened.value = true
}

const closeCreateDialog = (needReload: boolean) => {
  createDialogOpened.value = false
}

const openAuthorEditDialog = () => {
  authorEditDialogOpened.value = true
}

const closeAuthorEditDialog = (needReload: boolean) => {
  authorEditDialogOpened.value = false
}

const openDemiurgeEditDialog = () => {
  demiurgeEditDialogOpened.value = true
}

const closeDemiurgeEditDialog = (needReload: boolean) => {
  demiurgeEditDialogOpened.value = false
}

const openDeleteDialog = () => {
  deleteDialogOpened.value = true
}

const closeDeleteDialog = (needReload: boolean) => {
  deleteDialogOpened.value = false
}
</script>

<template>
  <list-page-template :store="store" @create="openCreateDialog">
    <template #items> {{ getItems }} </template>
  </list-page-template>
  <world-create-dialog v-if="createDialogOpened" @close="closeCreateDialog" />
  <world-author-edit-dialog :opened="authorEditDialogOpened" />
  <world-demiurge-edit-dialog :opened="demiurgeEditDialogOpened" />
  <world-delete-dialog :opened="deleteDialogOpened" />
</template>

<style scoped></style>
