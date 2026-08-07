<script setup lang="ts">
import FormDialog from '@/components/core/FormDialog.vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { type ChangePasswordRequestPayloadData, useUserStore } from '@/stores/core/user.ts'
import type { RequestErrorObject } from '@/utils/types.ts'

type ChangePasswordFormData = {
  new_password: string
  old_password: string
}

const emit = defineEmits<{
  close: []
}>()

const userStore = useUserStore()
const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()
const { getIsLoadingChangePassword } = storeToRefs(userStore)

const formData = ref<ChangePasswordFormData>({
  new_password: '',
  old_password: '',
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)

const close = (): void => {
  emit('close')
}

const toggleOldPasswordVisibility = () => {
  if (getIsLoadingChangePassword.value) return
  showOldPassword.value = !showOldPassword.value
}

const toggleNewPasswordVisibility = () => {
  if (getIsLoadingChangePassword.value) return
  showNewPassword.value = !showNewPassword.value
}

const validateFromData = () => {
  if (formData.value.new_password === formData.value.old_password) {
    setError('new_password', 'Новый пароль должен отличаться от предыдущего')
  }
  if (!formData.value.new_password) setError('new_password', 'Это поле обязательно для заполнения')
  if (!formData.value.old_password) setError('old_password', 'Это поле обязательно для заполнения')
}

const prepareFormData = (): ChangePasswordRequestPayloadData => {
  return {
    new_password: String(formData.value.new_password),
    old_password: String(formData.value.old_password),
  }
}

const apply = async () => {
  userStore.setIsLoadingChangePassword(true)
  clearErrors()
  validateFromData()
  if (hasErrors()) {
    userStore.setIsLoadingChangePassword(false)
    return
  }
  try {
    await userStore.changePassword(prepareFormData())
    close()
  } catch (error) {
    setErrors(error as RequestErrorObject)
  } finally {
    userStore.setIsLoadingChangePassword(false)
  }
}

const onCloseHandler = (applied: boolean): void => {
  if (applied) apply()
  else close()
}
</script>

<template>
  <form-dialog
    title="Смена пароля"
    :max-width="400"
    :loading="getIsLoadingChangePassword"
    @close="onCloseHandler"
  >
    <v-text-field autocomplete="=username" class="d-none" />
    <v-text-field
      v-model="formData.old_password"
      :type="showOldPassword ? 'text' : 'password'"
      density="comfortable"
      variant="solo"
      label="Старый пароль"
      autocomplete="current-password"
      :readonly="getIsLoadingChangePassword"
      :error="hasError('old_password')"
      :error-messages="getError('old_password')"
      @input="clearError('old_password')"
      class="form-input mb-1 w-100 password-input"
    >
      <template #append-inner>
        <v-btn
          :icon="showOldPassword ? 'visibility' : 'visibility_off'"
          class="form-btn__icon--no-shadow"
          :readonly="getIsLoadingChangePassword"
          @click="toggleOldPasswordVisibility"
        />
      </template>
    </v-text-field>
    <v-text-field
      v-model="formData.new_password"
      :type="showNewPassword ? 'text' : 'password'"
      density="comfortable"
      variant="solo"
      label="Новый пароль"
      autocomplete="new-password"
      :readonly="getIsLoadingChangePassword"
      :error="hasError('new_password')"
      :error-messages="getError('new_password')"
      @input="clearError('new_password')"
      class="form-input mb-1 w-100 password-input"
    >
      <template #append-inner>
        <v-btn
          :icon="showNewPassword ? 'visibility' : 'visibility_off'"
          class="form-btn__icon--no-shadow"
          :readonly="getIsLoadingChangePassword"
          @click="toggleNewPasswordVisibility"
        />
      </template>
    </v-text-field>
  </form-dialog>
</template>

<style scoped>
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
