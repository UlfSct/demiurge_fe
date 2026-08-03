<script setup lang="ts">
import TopMenu from '@/components/TopMenu.vue'
</script>

<template>
  <v-app>
    <top-menu />
    <v-main class="main-container">
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
.main-container {
  overflow-y: auto;
  max-height: calc(100vh - 83px);
  padding-top: 0;
  margin-top: 83px !important;
}
</style>
