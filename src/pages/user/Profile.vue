<script setup lang="ts">
import { useUserStore } from '@/stores/core/user.ts'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { getProfile, getToken } = storeToRefs(userStore)

const showSubtitleText = (): boolean => {
  if (!getProfile.value) return false
  return !!getProfile.value.first_name || !!getProfile.value.last_name
}

const getSubtitleText = (): string => {
  if (!getProfile.value) return ''
  return 'Подзаголовок'
}

const getCardTitle = (): string => {
  if (!getProfile.value) return ''
  return getProfile.value.username
}
</script>

<template>
  <v-row no-gutters class="pa-5">
    <v-card class="form-card pa-6 w-100">
      <v-card-title class="card-title"> {{ getCardTitle() }} </v-card-title>
      <v-card-text v-if="showSubtitleText()" class="card-title__subtitle">
        {{ getSubtitleText() }}
      </v-card-text>
    </v-card>
  </v-row>
</template>

<style scoped></style>
