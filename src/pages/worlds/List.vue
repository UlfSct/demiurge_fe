<script setup lang="ts">
import { useWorldsListStore } from '@/stores/worlds/list.ts'
import { storeToRefs } from 'pinia'
import PaginationFooter from '@/components/lists/PaginationFooter.vue'
import { ref } from 'vue'
import ListTitle from '@/components/lists/ListTitle.vue'

const store = useWorldsListStore()
const { getCount, getLoading } = storeToRefs(store)

const page = ref<number>(1)
const loading = ref(false)

const changePageValue = (value: number) => {
  page.value = value
}

const openAddDialog = () => {}
</script>

<template>
  <v-row no-gutters class="pa-5">
    <list-title title="Доступные миры" @add="openAddDialog" />
    <v-card class="default-card px-5 py-4 w-100 mt-2">
      <v-text-field
        class="form-input max-width-250"
        density="compact"
        placeholder="Поиск"
        append-inner-icon="search"
        hide-details
      />
    </v-card>
    <pagination-footer
      :count="getCount"
      :items-per-page="25"
      :page="page"
      :loading="getLoading"
      class="mt-2"
      @set-page="changePageValue"
    />
  </v-row>
</template>

<style scoped></style>
