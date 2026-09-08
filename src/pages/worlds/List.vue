<script setup lang="ts">
import { useWorldsListStore } from '@/stores/worlds/list.ts'
import ListPageTemplate from '@/components/lists/ListPageTemplate.vue'
import { ref } from 'vue'
import WorldAddDialog from '@/pages/worlds/modals/WorldAddDialog.vue'
import WorldEditDialog from '@/pages/worlds/modals/WorldEditDialog.vue'
import WorldDeleteDialog from '@/pages/worlds/modals/WorldDeleteDialog.vue'

const store = useWorldsListStore()

const addDialogOpened = ref<boolean>(false)
const editDialogOpened = ref<boolean>(false)
const deleteDialogOpened = ref<boolean>(false)

const openAddDialog = () => {
  addDialogOpened.value = true
}

const openEditDialog = () => {
  editDialogOpened.value = true
}

const openDeleteDialog = () => {
  deleteDialogOpened.value = true
}
</script>

<template>
  <list-page-template :store="store" @add="openAddDialog">
    <template #items> 123 </template>
  </list-page-template>
  <world-add-dialog :opened="addDialogOpened" />
  <world-edit-dialog :opened="editDialogOpened" />
  <world-delete-dialog :opened="deleteDialogOpened" />
</template>

<style scoped></style>
