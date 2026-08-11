<script setup lang="ts">
import { type LoginRequestPayloadData, useUserStore } from '@/stores/core/user.ts'
import routerNames from '@/router/names.ts'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import type { RequestErrorObject } from '@/types/requests.ts'
import { storeToRefs } from 'pinia'

type LoginFormData = {
  username: string | null
  password: string | null
}

const userStore = useUserStore()
const router = useRouter()
const { getIsAuthenticated, getIsLoadingLogin } = storeToRefs(userStore)
const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()

const formData = ref<LoginFormData>({
  username: null,
  password: null,
})

const showPassword = ref(false)

const goToRegistration = () => {
  if (getIsLoadingLogin.value) return
  router.push({ name: routerNames.REGISTRATION })
}

const goToMain = () => {
  if (getIsLoadingLogin.value) return
  router.push({ name: routerNames.MAIN })
}

const onInputPassword = () => {
  clearError('password')
  clearError('confirm_password')
}

const togglePasswordVisibility = () => {
  if (getIsLoadingLogin.value) return
  showPassword.value = !showPassword.value
}

const validateFormData = () => {
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
  userStore.setIsLoadingLoginValue(true)
  clearErrors()
  validateFormData()
  if (hasErrors()) {
    userStore.setIsLoadingLoginValue(false)
    return
  }
  try {
    await userStore.login(prepareFormData())
    goToMain()
  } catch (error) {
    setErrors(error as RequestErrorObject)
  } finally {
    userStore.setIsLoadingLoginValue(false)
  }
}

onMounted(() => {
  if (getIsAuthenticated.value) goToMain()
})
</script>

<template>
  <v-row no-gutters class="fill-height justify-center align-content-center no-auth-bg">
    <v-col cols="4" class="justify-items-center">
      <v-card class="default-card pa-6" max-width="420" min-width="380">
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="formData.username"
            density="comfortable"
            variant="solo"
            autocomplete="username"
            :readonly="getIsLoadingLogin"
            :error="hasError('username') || hasError('detail')"
            :error-messages="getError('username') || getError('detail')"
            @input="clearError('username')"
            @keydown.enter="login"
            class="form-input mb-1"
          >
            <template #label>Логин<span class="color--red">*</span></template>
          </v-text-field>

          <!-- Пароль с кастомной кнопкой -->
          <v-text-field
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            density="comfortable"
            variant="solo"
            autocomplete="current-password"
            :readonly="getIsLoadingLogin"
            :error="hasError('password')"
            :error-messages="getError('password')"
            @input="onInputPassword"
            @keydown.enter="login"
            class="form-input mb-1 password-input"
          >
            <template #label>Пароль<span class="color--red">*</span></template>

            <template #append-inner>
              <v-btn
                :icon="showPassword ? 'visibility' : 'visibility_off'"
                class="form-btn__icon--no-shadow"
                :readonly="getIsLoadingLogin"
                @click="togglePasswordVisibility"
              />
            </template>
          </v-text-field>
        </v-form>

        <v-btn class="form-btn w-100 mt-2" size="large" @click="login" :loading="getIsLoadingLogin">
          Войти
        </v-btn>

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

<style scoped lang="scss">
// Скрываем стандартный браузерный глазок
.password-input :deep(input[type='password']::-ms-reveal),
.password-input :deep(input[type='password']::-ms-clear) {
  display: none;
}

.password-input :deep(input[type='password']::-webkit-credentials-auto-fill-button),
.password-input :deep(input[type='password']::-webkit-caps-lock-indicator) {
  visibility: hidden;
  display: none !important;
  pointer-events: none;
}
</style>
