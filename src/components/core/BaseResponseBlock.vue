<script setup lang="ts">
import LoadingBlock from '@/components/core/LoadingBlock.vue'
import BasicTextBlock from '@/components/core/BasicTextBlock.vue'
import type { RequestParams, RequestQuery } from '@/types/requests.ts'

export interface IBaseResponseStore<T> {
  getLoading: boolean
  getData: T | null
  execute: (data: object, params?: RequestParams, query?: RequestQuery) => Promise<void>
  isErrorResponse: boolean
  isNotFoundResponse: boolean
}

interface IProps {
  store: IBaseResponseStore<Record<string, unknown>>
  notFoundText?: string
  errorText?: string
}

const props = withDefaults(defineProps<IProps>(), {
  notFoundText: 'Мир не существует или у вас нет прав для его просмотра',
  errorText: 'Неизвестная ошибка загрузки данных',
})
</script>

<template>
  <loading-block v-if="props.store.getLoading" class="mt-2" />
  <basic-text-block
    v-else-if="props.store.isNotFoundResponse"
    class="mt-2"
    :text="props.notFoundText"
  />
  <basic-text-block v-else-if="props.store.isErrorResponse" class="mt-2" :text="props.errorText" />
  <template v-else-if="props.store.getData">
    <slot />
  </template>
</template>

<style scoped></style>
