<script setup lang="ts">
import { useUserStore } from '@/stores/core/user.ts'
import routerNames from '@/router/names.ts'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const register = () => {
  userStore.register({
    username: 'N3kit123123123',
    password: 'Pwd12345678!',
    email: 'email@email.ru',
    first_name: 'Никита',
    last_name: 'Никитич',
  })
  router.push({ name: routerNames.PROFILE })
}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="6">
      <v-btn @click="register">Регистрация</v-btn>
    </v-col>
  </v-row>
</template>

<style scoped></style>
