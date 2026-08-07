<script setup lang="ts">
import FormDialog from '@/components/core/FormDialog.vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/core/user.ts'
import type { RequestErrorObject } from '@/utils/types.ts'
import UserAvatar from '@/components/core/UserAvatar.vue'

type EditProfileFormData = {
  avatar: File | null
}

const emit = defineEmits<{
  close: []
}>()

const userStore = useUserStore()
const { clearErrors, clearError, getError, setErrors, hasError, hasErrors } = useFormErrors()
const { getProfile, getIsLoadingEditProfile } = storeToRefs(userStore)

const formData = ref<EditProfileFormData>({
  avatar: null,
})

const close = (): void => {
  emit('close')
}

const prepareFormData = () => {
  let data = new FormData()
  data.append('avatar', formData.value.avatar ? formData.value.avatar : '')
  return data
}

const apply = async () => {
  userStore.setIsLoadingEditProfile(true)
  clearErrors()
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
    title="Редактирование аватара"
    :max-width="450"
    :loading="getIsLoadingEditProfile"
    @close="onCloseHandler"
  >
    <v-row no-gutters class="justify-space-between mb-3">
      <v-col cols="6">
        <v-row no-gutters class="w-100 justify-center">
          <user-avatar :avatar="undefined" :size="150" />
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row no-gutters class="w-100 justify-center">
          <user-avatar :avatar="undefined" :size="150" />
        </v-row>
      </v-col>
    </v-row>
  </form-dialog>
</template>

<style scoped></style>
