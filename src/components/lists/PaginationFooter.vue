<script setup lang="ts">
import { computed, ref } from 'vue'
import PaginationFooterPage from '@/components/lists/PaginationFooterPage.vue'
import { ITEMS_PER_PAGE_SELECTOR_ITEMS } from '@/utils/consts.ts'

const emit = defineEmits<{
  setPage: [value: number]
  changeItemsPerPageValue: [value: number]
}>()

interface IProps {
  count: number
  itemsPerPage: number
  page: number
  loading: boolean
}

const props = defineProps<IProps>()

const localItemsPerPage = ref(12)

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
  <v-card class="default-card px-5 py-4 w-100 mt-2" v-if="props.count > 0">
    <v-row no-gutters class="ga-2 flex-wrap justify-center">
      <v-row no-gutters class="text-center align-center max-width--fit-content">
        <v-row no-gutters class="ga-2">
          <template v-for="i in getMaxPages">
            <pagination-footer-page
              v-if="showPageNumber(i)"
              :selected="i === props.page"
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
      </v-row>
      <v-row no-gutters class="justify-end ml-auto flex-shrink-0 flex-wrap">
        <span class="card-title__subtitle pt-2 pr-2 text-wrap text-break">
          Записей на странице:
        </span>
        <v-select
          v-model="localItemsPerPage"
          class="form-input max-width-90"
          :items="ITEMS_PER_PAGE_SELECTOR_ITEMS"
          density="compact"
          :readonly="props.loading"
          placeholder="Поиск"
          hide-details
          @update:model-value="(val) => emit('changeItemsPerPageValue', val)"
        />
      </v-row>
    </v-row>
  </v-card>
</template>

<style scoped></style>
