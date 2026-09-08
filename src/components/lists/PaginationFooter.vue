<script setup lang="ts">
import { computed } from 'vue'
import PaginationFooterPage from '@/components/lists/PaginationFooterPage.vue'

const emit = defineEmits<{
  setPage: [value: number]
}>()

interface IProps {
  count: number
  itemsPerPage: number
  page: number
  loading: boolean
}

const props = defineProps<IProps>()

const getMaxPages = computed(() => Math.ceil(props.count / props.itemsPerPage))

const setPage = (page: number): void => {
  if (props.loading) return
  emit('setPage', page)
}

const showPageNumber = (value: number): boolean => {
  if (getMaxPages.value <= 7) return true
  if (value === 1) return true
  if (value === getMaxPages.value) return true
  if (Math.abs(value - props.page) <= 1) return true
  if (getMaxPages.value - value <= 4 && getMaxPages.value - props.page < 4) return true
  return value <= 5 && props.page <= 4
}

const showAfterPageEllipsis = (value: number): boolean => {
  if (getMaxPages.value <= 7) return false
  if (value === getMaxPages.value) return false
  if (value === props.page) return false
  if (value === props.page - 1) return false
  if (props.page > 4 && value === 1) return true
  return props.page < getMaxPages.value - 3 && value === getMaxPages.value - 1
}
</script>

<template>
  <v-card class="default-card px-5 py-4 w-100">
    <v-row no-gutters class="ga-2 justify-center text-center">
      <template v-for="i in getMaxPages">
        <pagination-footer-page
          v-if="showPageNumber(i)"
          :selected="i === page"
          :page="i"
          :key="`pagination-footer-page-${i}`"
          @set-page="setPage"
        />
        <span
          v-if="showAfterPageEllipsis(i)"
          class="w-30px h-30px form-footer-text font-size-16 text-center justify-center ls-3px pt-1"
        >
          ...
        </span>
      </template>
    </v-row>
  </v-card>
</template>

<style scoped></style>
