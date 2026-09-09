<script setup lang="ts">
import { useWorldsListStore } from '@/stores/worlds'
import ListPageTemplate from '@/components/lists/ListPageTemplate.vue'
import { ref } from 'vue'
import WorldAddDialog from '@/pages/worlds/modals/WorldAddDialog.vue'
import WorldDeleteDialog from '@/pages/worlds/modals/WorldDeleteDialog.vue'
import { storeToRefs } from 'pinia'
import WorldAuthorEditDialog from '@/pages/worlds/modals/WorldAuthorEditDialog.vue'
import WorldDemiurgeEditDialog from '@/pages/worlds/modals/WorldDemiurgeEditDialog.vue'

const store = useWorldsListStore()
const { getItems } = storeToRefs(store)

const addDialogOpened = ref<boolean>(false)
const authorEditDialogOpened = ref<boolean>(false)
const demiurgeEditDialogOpened = ref<boolean>(false)
const deleteDialogOpened = ref<boolean>(false)

const openAddDialog = () => {
  addDialogOpened.value = true
}

const openAuthorEditDialog = () => {
  authorEditDialogOpened.value = true
}

const openDemiurgeEditDialog = () => {
  authorEditDialogOpened.value = true
}

const openDeleteDialog = () => {
  deleteDialogOpened.value = true
}
</script>

<template>
  <list-page-template :store="store" @add="openAddDialog">
    <template #items> {{ getItems }} </template>
  </list-page-template>
  <world-add-dialog :opened="addDialogOpened" />
  <world-author-edit-dialog :opened="authorEditDialogOpened" />
  <world-demiurge-edit-dialog :opened="demiurgeEditDialogOpened" />
  <world-delete-dialog :opened="deleteDialogOpened" />
</template>

<style scoped></style>
