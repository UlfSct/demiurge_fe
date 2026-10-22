<script setup lang="ts">
import { type LoginRequestPayloadData, useUserStore } from '@/stores/core/user.ts'
import routerNames from '@/router/names.ts'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import type { RequestErrorObject } from '@/types/requests.ts'
import { storeToRefs } from 'pinia'
import TextField from '@/components/ui/fields/TextField.vue'
import TextFieldWithVisibility from '@/components/ui/fields/TextFieldWithVisibility.vue'

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

const validateFormData = () => {
  if (!formData.value.username) setError('username', 'Это поле обязательно для заполнения')
  if (!formData.value.password) setError('password', 'Это поле обязательно для заполнения')
}

const prepareRequestData = (): LoginRequestPayloadData => {
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
    await userStore.login(prepareRequestData())
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
        <v-form @submit.prevent>
          <text-field
            v-model="formData.username"
            autocomplete="username"
            label="Логин"
            :required="true"
            :readonly="getIsLoadingLogin"
            :error="hasError('username') || hasError('detail')"
            :error-messages="getError('username') || getError('detail')"
            @input="clearError('username')"
          />
          <text-field-with-visibility
            v-model="formData.password"
            label="Пароль"
            :required="true"
            autocomplete="current-password"
            :readonly="getIsLoadingLogin"
            :error="hasError('password')"
            :error-messages="getError('password')"
            @input="onInputPassword"
          />
          <v-btn
            type="submit"
            class="form-btn w-100 mt-2"
            size="large"
            @click="login"
            :loading="getIsLoadingLogin"
          >
            Войти
          </v-btn>
        </v-form>

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
