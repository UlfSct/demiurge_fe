<script setup lang="ts">
import TopMenu from '@/components/TopMenu.vue'
import { useUserStore } from '@/stores/core/user.ts'
import { storeToRefs } from 'pinia'
import InitializationLoading from '@/components/InitializationLoading.vue'

const userStore = useUserStore()
const { getIsInitialized, getIsAuthenticated } = storeToRefs(userStore)
</script>

<template>
  <v-app>
    <top-menu />
    <v-main class="main-container">
      <router-view v-if="false" />
      <initialization-loading v-else />
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
