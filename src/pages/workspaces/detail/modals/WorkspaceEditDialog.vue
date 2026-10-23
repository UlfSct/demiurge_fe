<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, ref } from 'vue'
import FormDialog from '@/components/core/FormDialog.vue'
import TextField from '@/components/ui/fields/TextField.vue'
import TextFieldWithVisibility from '@/components/ui/fields/TextFieldWithVisibility.vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import { useWorkspacesEditStore, type WorkspaceDetail } from '@/stores/workspaces'
import type { RequestErrorObject } from '@/types/requests.ts'
import { ALLOWED_FILE_MIME_TYPES, ALLOWED_FILE_TYPES } from '@/utils/consts.ts'
import { getRequestErrorText } from '@/utils/requests.ts'

type WorkspaceEditFormData = {
  name: string | null
  password: string | null
}

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

interface IProps {
  workspace: WorkspaceDetail
}

const props = defineProps<IProps>()

const store = useWorkspacesEditStore()
const { getLoading } = storeToRefs(store)
const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()

const formData = ref<WorkspaceEditFormData>({
  name: props.workspace.name,
  password: null,
})

const requestParams = computed(() => ({ id: props.workspace.id }))
const currentAvatar = computed(() => props.workspace.avatar?.url ?? null)

const avatarField = ref<File | File[] | null>(null)
const newAvatar = ref<File | null>(null)
const newAvatarPreview = ref<string | null>(null)
const detailError = ref<string>('')

const preview = computed(() => newAvatarPreview.value ?? currentAvatar.value)

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const revokeAvatarPreview = (): void => {
  if (!newAvatarPreview.value) return
  URL.revokeObjectURL(newAvatarPreview.value)
  newAvatarPreview.value = null
}

const validateFormData = () => {
  if (!formData.value.name) setError('name', 'Это поле обязательно для заполнения')
}

const prepareRequestData = (): FormData => {
  const data = new FormData()
  data.append('name', String(formData.value.name))
  if (formData.value.password) data.append('password', String(formData.value.password))
  if (newAvatar.value) data.append('avatar', newAvatar.value)
  return data
}

const apply = async () => {
  clearErrors()
  detailError.value = ''
  validateFormData()
  if (hasErrors()) return

  try {
    await store.execute(prepareRequestData(), requestParams.value)
    close(true)
  } catch (error) {
    setErrors(error as RequestErrorObject)
    detailError.value = getRequestErrorText(error)
  }
}

const onCloseHandler = (applied: boolean): void => {
  if (applied) apply()
  else close(false)
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

  // Исходный файл без ресайза и перекодирования.
  revokeAvatarPreview()
  newAvatar.value = file
  newAvatarPreview.value = URL.createObjectURL(file)
}

const cancelNewAvatar = () => {
  avatarField.value = null
  newAvatar.value = null
  revokeAvatarPreview()
}

onBeforeUnmount(revokeAvatarPreview)
</script>

<template>
  <form-dialog
    title="Редактирование пространства"
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
      label="Новый пароль (необязательно)"
      autocomplete="new-password"
      :readonly="getLoading"
      :error="hasError('password')"
      :error-messages="getError('password')"
      @input="clearError('password')"
    />
    <v-row v-if="preview" no-gutters class="justify-center py-3">
      <v-img :src="preview" width="120" height="120" cover class="workspace-avatar-preview" />
    </v-row>
    <v-row v-if="newAvatar" no-gutters class="justify-end mb-3">
      <v-btn class="form-btn px-3" :readonly="getLoading" @click="cancelNewAvatar">
        Отменить новый аватар
      </v-btn>
    </v-row>
    <v-file-input
      v-model="avatarField"
      :accept="ALLOWED_FILE_TYPES"
      label="Новый аватар (необязательно)"
      :readonly="getLoading"
      :error="hasError('avatar')"
      :error-messages="getError('avatar')"
      class="form-input"
      prepend-icon=""
      @update:model-value="onFileChange"
    />
    <v-row v-if="detailError" no-gutters class="w-100 mt-1">
      <span class="color--red text-body-1">{{ detailError }}</span>
    </v-row>
  </form-dialog>
</template>

<style scoped>
.workspace-avatar-preview {
  border: 2px solid var(--color-border-focus);
  box-shadow: var(--shadow-gold-glow);
}
</style>
