<script setup lang="ts">
import { useWorldsListStore } from '@/stores/worlds/list.ts'
import ListPageTemplate from '@/components/lists/ListPageTemplate.vue'
import { storeToRefs } from 'pinia'

const store = useWorldsListStore()
const { getItems } = storeToRefs(store)

const openAddDialog = () => {}
</script>

<template>
  <list-page-template :store="store" @add="openAddDialog">
    <template #items> 123 </template>
  </list-page-template>
</template>

<style scoped></style>
