<script setup lang="ts">
import { type LoginRequestPayloadData, useUserStore } from '@/stores/core/user.ts'
import routerNames from '@/router/names.ts'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import type { RequestErrorObject } from '@/utils/types.ts'
import { storeToRefs } from 'pinia'

type LoginFormData = {
  username: string | null
  password: string | null
}

const userStore = useUserStore()
const router = useRouter()
const { getIsAuthenticated } = storeToRefs(userStore)
const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()

const formData = ref<LoginFormData>({
  username: null,
  password: null,
})

const goToRegistration = () => {
  router.push({ name: routerNames.REGISTRATION })
}

const goToMain = () => {
  router.push({ name: routerNames.MAIN })
}

const onInputPassword = () => {
  clearError('password')
  clearError('confirm_password')
}

const validateFromData = () => {
  if (!formData.value.username) setError('username', 'Это поле обязательно для заполнения')
  if (!formData.value.password) setError('password', 'Это поле обязательно для заполнения')
}

const prepareFormData = (): LoginRequestPayloadData => {
  return {
    username: String(formData.value.username),
    password: String(formData.value.password),
  }
}

const login = async () => {
  clearErrors()
  validateFromData()
  if (hasErrors()) return
  try {
    await userStore.login(prepareFormData())
    goToMain()
  } catch (error) {
    setErrors(error as RequestErrorObject)
  }
}

onMounted(() => {
  if (getIsAuthenticated.value) goToMain()
})
</script>

<template>
  <v-row no-gutters class="fill-height justify-center align-content-center no-auth-bg">
    <v-col cols="4" class="justify-items-center">
      <v-card class="form-card pa-6" max-width="420" min-width="380">
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="formData.username"
            density="comfortable"
            variant="solo"
            autocomplete="username"
            :error="hasError('username')"
            :error-messages="getError('username')"
            @input="clearError('username')"
            class="form-input mb-1"
          >
            <template #label>Логин<span class="color--red">*</span></template>
          </v-text-field>

          <v-text-field
            v-model="formData.password"
            density="comfortable"
            variant="solo"
            type="password"
            autocomplete="current-password"
            :error="hasError('password')"
            :error-messages="getError('password')"
            @input="onInputPassword"
            class="form-input mb-1"
          >
            <template #label>Пароль<span class="color--red">*</span></template>
          </v-text-field>
        </v-form>

        <v-btn class="form-btn w-100 mt-2" size="large" @click="login"> Войти </v-btn>

        <v-card-text class="text-center mt-4 py-0">
          <span class="form-footer-text">
            Нет аккаунта?
            <span @click="goToRegistration" class="text--href"> Зарегистрироваться </span>
          </span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
