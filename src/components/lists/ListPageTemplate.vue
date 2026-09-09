<script setup lang="ts">
import ListTitle from '@/components/lists/ListTitle.vue'
import PaginationFooter from '@/components/lists/PaginationFooter.vue'
import ListHeader from '@/components/lists/ListHeader.vue'

const emit = defineEmits<{
  create: []
}>()

interface IPaginatedStore {
  setPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  getPage: number
  getItemsPerPage: number
  getCount: number
  getLoading: boolean
}

interface IProps {
  store: IPaginatedStore
}

const props = defineProps<IProps>()

const changePageValue = (value: number): void => {
  props.store.setPage(value)
}

const changeItemsPerPageValue = (value: number) => {
  props.store.setItemsPerPage(value)
}
</script>

<template>
  <v-row no-gutters class="pa-5">
    <list-title title="Доступные миры" :loading="props.store.getLoading" @add="emit('create')" />
    <list-header
      :loading="props.store.getLoading"
      @change-items-per-page-value="changeItemsPerPageValue"
    />
    <slot name="items" />
    <pagination-footer
      :count="props.store.getCount"
      :items-per-page="props.store.getItemsPerPage"
      :page="props.store.getPage"
      :loading="props.store.getLoading"
      @set-page="changePageValue"
    />
  </v-row>
</template>

<style scoped></style>
