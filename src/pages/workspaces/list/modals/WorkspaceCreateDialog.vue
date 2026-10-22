<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, ref } from 'vue'
import FormDialog from '@/components/core/FormDialog.vue'
import TextField from '@/components/ui/fields/TextField.vue'
import TextFieldWithVisibility from '@/components/ui/fields/TextFieldWithVisibility.vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import { useWorkspacesCreateStore } from '@/stores/workspaces'
import type { RequestErrorObject } from '@/types/requests.ts'
import { ALLOWED_FILE_MIME_TYPES, ALLOWED_FILE_TYPES } from '@/utils/consts.ts'

type WorkspaceCreateFormData = {
  name: string | null
  password: string | null
}

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

const store = useWorkspacesCreateStore()
const { getLoading } = storeToRefs(store)
const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()

const formData = ref<WorkspaceCreateFormData>({
  name: null,
  password: null,
})

const avatarField = ref<File | File[] | null>(null)
const avatarPreview = ref<string | null>(null)
const preparedAvatar = ref<File | null>(null)

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const validateFormData = () => {
  if (!formData.value.name) setError('name', 'Это поле обязательно для заполнения')
}

const prepareRequestData = (): FormData => {
  const data = new FormData()
  data.append('name', String(formData.value.name))
  if (formData.value.password) data.append('password', String(formData.value.password))
  if (preparedAvatar.value) data.append('avatar', preparedAvatar.value)
  return data
}

const apply = async () => {
  clearErrors()
  validateFormData()
  if (hasErrors()) return
  try {
    await store.execute(prepareRequestData())
    close(true)
  } catch (error) {
    setErrors(error as RequestErrorObject)
  }
}

const onCloseHandler = (applied: boolean): void => {
  if (applied) apply()
  else close(false)
}

const revokeAvatarPreview = (): void => {
  if (!avatarPreview.value) return
  URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = null
}

const onFileChange = (files: File | File[] | null): void => {
  clearError('avatar')
  const file = Array.isArray(files) ? files[0] : files
  if (!file) return

  if (file.size === 0) {
    setError('avatar', 'Нельзя загрузить пустой файл')
    return
  }

  if (!ALLOWED_FILE_MIME_TYPES.includes(file.type)) {
    setError(
      'avatar',
      `Некорректный формат файла. Допустимы только ${ALLOWED_FILE_TYPES.join(', ')}`,
    )
    return
  }

  // На бэкенд уходит исходный файл: без ресайза и перекодирования, чтобы не терять качество.
  revokeAvatarPreview()
  preparedAvatar.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

const deleteAvatar = () => {
  avatarField.value = null
  preparedAvatar.value = null
  revokeAvatarPreview()
}

onBeforeUnmount(revokeAvatarPreview)
</script>

<template>
  <form-dialog
    title="Создание рабочего пространства"
    :max-width="500"
    :loading="getLoading"
    @close="onCloseHandler"
  >
    <text-field
      v-model="formData.name"
      label="Название"
      :required="true"
      :readonly="getLoading"
      :error="hasError('name')"
      :error-messages="getError('name')"
      @input="clearError('name')"
    />
    <text-field-with-visibility
      v-model="formData.password"
      label="Пароль (необязательно)"
      autocomplete="new-password"
      :readonly="getLoading"
      :error="hasError('password')"
      :error-messages="getError('password')"
      @input="clearError('password')"
    />
    <v-row v-if="avatarPreview" no-gutters class="justify-center py-3">
      <v-img :src="avatarPreview" width="120" height="120" cover class="workspace-avatar-preview" />
    </v-row>
    <v-row v-if="avatarPreview" no-gutters class="justify-end mb-3">
      <v-btn class="form-btn px-3" :readonly="getLoading" @click="deleteAvatar">
        Удалить аватар
      </v-btn>
    </v-row>
    <v-file-input
      v-else
      v-model="avatarField"
      :accept="ALLOWED_FILE_TYPES"
      label="Аватар (необязательно)"
      :readonly="getLoading"
      :error="hasError('avatar')"
      :error-messages="getError('avatar')"
      class="form-input"
      prepend-icon=""
      @update:model-value="onFileChange"
    />
  </form-dialog>
</template>

<style scoped>
.workspace-avatar-preview {
  border: 2px solid var(--color-border-focus);
  box-shadow: var(--shadow-gold-glow);
}
</style>
