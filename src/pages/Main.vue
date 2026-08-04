<script setup lang="ts">
import { useUserStore } from '@/stores/core/user.ts'

const userStore = useUserStore()

const login = () => {
  userStore.login({
    username: 'N3kit123123123',
    password: 'Pwd12345678!',
  })
}

const register = () => {
  userStore.register({
    username: 'N3kit123123123',
    password: 'Pwd12345678!',
    email: 'email@email.ru',
    first_name: 'Никита',
    last_name: 'Никитич',
  })
}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="6">
      <v-btn @click="login">Войти</v-btn>
    </v-col>
    <v-col cols="6">
      <v-btn @click="register">Регистрация</v-btn>
    </v-col>
  </v-row>
</template>

<style scoped></style>
