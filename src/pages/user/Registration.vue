<script setup lang="ts">
import { type RegisterRequestPayloadData, useUserStore } from '@/stores/core/user.ts'
import routerNames from '@/router/names.ts'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import type { RequestErrorObject } from '@/utils/types.ts'
import { storeToRefs } from 'pinia'

type RegistrationFormData = {
  username: string | null
  password: string | null
  email: string | null
  first_name: string | null
  last_name: string | null
  confirm_password: string | null
}

const userStore = useUserStore()
const router = useRouter()
const { getIsAuthenticated } = storeToRefs(userStore)
const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()

const formData = ref<RegistrationFormData>({
  username: null,
  password: null,
  confirm_password: null,
  email: null,
  first_name: null,
  last_name: null,
})

const goToLogin = () => {
  router.push({ name: routerNames.LOGIN })
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
  if (!formData.value.email) setError('email', 'Это поле обязательно для заполнения')
  if (formData.value.password !== formData.value.confirm_password) {
    setError('confirm_password', 'Пароли не совпадают')
  }
}

const prepareFormData = (): RegisterRequestPayloadData => {
  return {
    username: String(formData.value.username),
    email: String(formData.value.email),
    password: String(formData.value.password),
    last_name: String(formData.value.last_name),
    first_name: String(formData.value.first_name),
  }
}

const register = async () => {
  clearErrors()
  validateFromData()
  if (hasErrors()) return
  try {
    await userStore.register(prepareFormData())
    goToMain()
  } catch (error) {
    setErrors(error as RequestErrorObject)
  }
}

onMounted(() => {
  console.log(getIsAuthenticated.value)
  if (getIsAuthenticated.value) goToMain()
})
</script>

<template>
  <v-row no-gutters class="fill-height justify-center align-content-center no-auth-bg">
    <v-col cols="4" class="justify-items-center">
      <v-card class="form-card pa-6" max-width="420" min-width="380">
        <v-form @submit.prevent="register">
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
            v-model="formData.email"
            density="comfortable"
            variant="solo"
            autocomplete="username"
            :error="hasError('email')"
            :error-messages="getError('email')"
            @input="clearError('email')"
            class="form-input mb-1"
          >
            <template #label>E-mail<span class="color--red">*</span></template>
          </v-text-field>
          <v-text-field
            v-model="formData.password"
            density="comfortable"
            variant="solo"
            type="password"
            autocomplete="new-password"
            :error="hasError('password')"
            :error-messages="getError('password')"
            @input="onInputPassword"
            class="form-input mb-1"
          >
            <template #label>Пароль<span class="color--red">*</span></template>
          </v-text-field>
          <v-text-field
            v-model="formData.confirm_password"
            density="comfortable"
            variant="solo"
            type="password"
            autocomplete="new-password"
            :error="hasError('confirm_password')"
            :error-messages="getError('confirm_password')"
            @input="clearError('confirm_password')"
            class="form-input mb-1"
          >
            <template #label>Подтвердите пароль<span class="color--red">*</span></template>
          </v-text-field>
          <v-text-field
            v-model="formData.first_name"
            density="comfortable"
            variant="solo"
            label="Имя"
            autocomplete="given-name"
            :error="hasError('first_name')"
            :error-messages="getError('first_name')"
            @input="clearError('first_name')"
            class="form-input mb-1"
          />
          <v-text-field
            v-model="formData.last_name"
            density="comfortable"
            variant="solo"
            label="Фамилия"
            autocomplete="family-name"
            :error="hasError('last_name')"
            :error-messages="getError('last_name')"
            @input="clearError('last_name')"
            class="form-input mb-1"
          />
        </v-form>
        <v-btn class="form-btn w-100 mt-2" size="large" @click="register">Регистрация</v-btn>
        <v-card-text class="text-center mt-4 py-0">
          <span class="form-footer-text">
            Есть аккаунт?
            <span @click="goToLogin" class="text--href"> Войти </span>
          </span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
