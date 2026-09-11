<script setup lang="ts">
import { useWorldsDetailStore } from '@/stores/worlds'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import LoadingBlock from '@/components/core/LoadingBlock.vue'
import BasicTextBlock from '@/components/core/BasicTextBlock.vue'

const route = useRoute()
const store = useWorldsDetailStore()
const { isErrorResponse, isNotFoundResponse, getLoading, getData } = storeToRefs(store)

const requestParams = computed(() => ({ id: Number(route.params.id) }))

onMounted(() => {
  store.execute({}, requestParams.value)
})
</script>

<template>
  <v-row no-gutters class="pa-5">
    <loading-block v-if="getLoading" />
    <basic-text-block
      v-else-if="isNotFoundResponse"
      text="Мир не существует или у вас нет прав для его просмотра"
    />
    <basic-text-block v-else-if="isErrorResponse" text="Неизвестная ошибка загрузки данных" />
    <div v-else-if="getData">getData {{ getData }}</div>
  </v-row>
</template>

<style scoped></style>
