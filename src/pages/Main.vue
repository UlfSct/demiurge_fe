<script setup lang="ts">
import { useUserStore } from '@/stores/core/user.ts'
import { storeToRefs } from 'pinia'
import MainAuthenticatedBlock from '@/components/core/MainAuthenticatedBlock.vue'
import MainNotAuthenticatedBlock from '@/components/core/MainNotAuthenticatedBlock.vue'

const userStore = useUserStore()
const { getIsAuthenticated } = storeToRefs(userStore)
</script>

<template>
  <main-authenticated-block v-if="getIsAuthenticated" />
  <main-not-authenticated-block v-else />
</template>

<style scoped></style>
