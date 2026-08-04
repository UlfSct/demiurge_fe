<script setup lang="ts">
import { useUserStore } from '@/stores/core/user.ts'
import { useRouter } from 'vue-router'
import routerNames from '@/router/names.ts'

const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  await userStore.login({
    username: 'N3kit123123123',
    password: 'Pwd12345678!',
  })
  router.push({ name: routerNames.PROFILE })
}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="6">
      <v-btn @click="login">Войти</v-btn>
    </v-col>
  </v-row>
</template>

<style scoped></style>
