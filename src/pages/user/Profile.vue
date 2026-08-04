<script setup lang="ts">
import { useUserStore } from '@/stores/core/user.ts'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { getProfile, getToken } = storeToRefs(userStore)
</script>

<template>
  <div>Профиль</div>
  <div>{{ getProfile }}</div>
  <div>{{ getToken }}</div>
</template>

<style scoped></style>
