<script setup lang="ts">
import { useWorldsDetailStore } from '@/stores/worlds'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import WorldsTitle from '@/components/worlds/WorldsTitle.vue'
import routerNames from '@/router/names.ts'
import WorldDetail from '@/pages/worlds/detail/index/WorldDetail.vue'

const route = useRoute()
const router = useRouter()
const store = useWorldsDetailStore()
const { getLoading } = storeToRefs(store)

const requestParams = computed(() => ({ id: Number(route.params.id) }))

const onBackHandler = () => {
  router.push({ name: routerNames.WORLDS.LIST })
}

onMounted(() => {
  store.execute({}, requestParams.value)
})
</script>

<template>
  <v-row no-gutters class="pa-5">
    <worlds-title title="Мир" :loading="getLoading" @back="onBackHandler" />
    <world-detail :store="store" />
  </v-row>
</template>

<style scoped></style>
