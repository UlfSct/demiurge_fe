<script setup lang="ts">
import { useWorldsListStore } from '@/stores/worlds/list.ts'
import { storeToRefs } from 'pinia'

const store = useWorldsListStore()
const {} = storeToRefs(store)
</script>

<template>
  <v-row no-gutters class="pa-5">
    <v-card class="default-card px-5 py-4 w-100">
      <v-card-title class="card-title card-title--no-margins">Список миров</v-card-title>
    </v-card>
    <v-card class="default-card px-5 py-4 w-100 mt-2">
      <v-text-field
        class="form-input max-width-250"
        density="compact"
        placeholder="Поиск"
        append-inner-icon="search"
        hide-details
      />
    </v-card>
  </v-row>
</template>

<style scoped></style>
