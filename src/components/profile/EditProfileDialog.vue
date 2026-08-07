<script setup lang="ts">
import FormDialog from '@/components/core/FormDialog.vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/core/user.ts'
import type { RequestErrorObject } from '@/utils/types.ts'

type EditProfileFormData = {
  username: string | null
  first_name: string | null
  last_name: string | null
}

const emit = defineEmits<{
  close: []
}>()

const userStore = useUserStore()
const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()
const { getProfile, getIsLoadingEditProfile } = storeToRefs(userStore)

const formData = ref<EditProfileFormData>({
  username: getProfile.value ? getProfile.value.username : '',
  first_name: getProfile.value ? getProfile.value.first_name : '',
  last_name: getProfile.value ? getProfile.value.last_name : '',
})

const close = (): void => {
  emit('close')
}

const validateFormData = () => {
  if (!formData.value.username) setError('username', 'Это поле обязательно для заполнения')
}

const prepareFormData = () => {
  let data = new FormData()
  data.append('username', String(formData.value.username))
  data.append('last_name', formData.value.last_name ? String(formData.value.last_name) : '')
  data.append('first_name', formData.value.first_name ? String(formData.value.first_name) : '')
  return data
}

const apply = async () => {
  userStore.setIsLoadingEditProfile(true)
  clearErrors()
  validateFormData()
  if (hasErrors()) {
    userStore.setIsLoadingEditProfile(false)
    return
  }
  try {
    await userStore.updateProfile(prepareFormData())
    close()
  } catch (error) {
    setErrors(error as RequestErrorObject)
  } finally {
    userStore.setIsLoadingEditProfile(false)
  }
}

const onCloseHandler = (applied: boolean): void => {
  if (applied) apply()
  else close()
}
</script>

<template>
  <form-dialog
    title="Редактирование профиля"
    :max-width="600"
    :loading="getIsLoadingEditProfile"
    @close="onCloseHandler"
  >
    <v-text-field
      v-model="formData.username"
      density="comfortable"
      variant="solo"
      label="Логин"
      autocomplete="username"
      :readonly="getIsLoadingEditProfile"
      :error="hasError('username')"
      :error-messages="getError('username')"
      @input="clearError('username')"
      class="form-input mb-1 w-100"
    />
    <v-text-field
      v-model="formData.first_name"
      density="comfortable"
      variant="solo"
      label="Имя"
      autocomplete="given-name"
      :readonly="getIsLoadingEditProfile"
      :error="hasError('first_name')"
      :error-messages="getError('first_name')"
      @input="clearError('first_name')"
      class="form-input mb-1 w-100"
    />
    <v-text-field
      v-model="formData.last_name"
      density="comfortable"
      variant="solo"
      label="Фамилия"
      autocomplete="family-name"
      :readonly="getIsLoadingEditProfile"
      :error="hasError('last_name')"
      :error-messages="getError('last_name')"
      @input="clearError('last_name')"
      class="form-input mb-1 w-100"
    />
  </form-dialog>
</template>

<style scoped></style>
