<script setup lang="ts">
import PaginationFooter from '@/components/lists/PaginationFooter.vue'
import ListHeader from '@/components/lists/ListHeader.vue'
import LoadingBlock from '@/components/core/LoadingBlock.vue'

const emit = defineEmits<{
  create: []
  back: []
  'update:search': [value: string]
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
  searchable?: boolean
  search?: string
  showPagination?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  searchable: false,
  search: '',
  showPagination: true,
})

const changePageValue = (value: number): void => {
  props.store.setPage(value)
}

const changeItemsPerPageValue = (value: number) => {
  props.store.setItemsPerPage(value)
}
</script>

<template>
  <v-row no-gutters class="pa-5">
    <slot name="title" />
    <list-header
      :loading="props.store.getLoading"
      :searchable="props.searchable"
      :search="props.search"
      @update:search="emit('update:search', $event)"
      @create="emit('create')"
    />
    <slot v-if="!props.store.getLoading" />
    <loading-block v-else class="mt-2" />
    <pagination-footer
      v-if="props.showPagination"
      :count="props.store.getCount"
      :items-per-page="props.store.getItemsPerPage"
      :page="props.store.getPage"
      :loading="props.store.getLoading"
      @set-page="changePageValue"
      @change-items-per-page-value="changeItemsPerPageValue"
    />
  </v-row>
</template>

<style scoped></style>
