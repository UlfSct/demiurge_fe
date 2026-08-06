<script setup lang="ts">
import TopMenu from '@/components/core/TopMenu.vue'
import { useUserStore } from '@/stores/core/user.ts'
import { storeToRefs } from 'pinia'
import InitializationLoading from '@/components/core/InitializationLoading.vue'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import routerNames from '@/router/names.ts'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { getIsInitialized, getIsAuthenticated } = storeToRefs(userStore)

watch(getIsInitialized, (nVal) => {
  if (!nVal) return
  if (getIsAuthenticated.value) return
  if (route.name === routerNames.MAIN) return
  if (route.name === routerNames.LOGIN) return
  if (route.name === routerNames.REGISTRATION) return
  router.push({ name: routerNames.MAIN })
})

watch(getIsAuthenticated, () => {
  if (route.name === routerNames.MAIN) return
  router.push({ name: routerNames.MAIN })
})
</script>

<template>
  <v-app class="bg-brown-dark-shades">
    <top-menu />
    <v-main class="main-container bg-brown-dark-shades main-bg">
      <initialization-loading v-if="!getIsInitialized" />
      <router-view v-else />
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
.main-container {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 83px);
  padding-top: 0;
  margin-top: 83px !important;
}
</style>
