<script setup lang="ts">
import FormDialog from '@/components/core/FormDialog.vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/core/user.ts'
import type { RequestErrorObject } from '@/utils/types.ts'
import { blobToBase64, sendGetFileRequest } from '@/utils/requests.ts'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { VFileInput } from 'vuetify/components'
import { ALLOWED_FILE_MIME_TYPES, ALLOWED_FILE_TYPES, EMPTY_FILE_VALUE } from '@/utils/consts.ts'
import { resizeImage } from '@/utils/image.ts'

const emit = defineEmits<{
  close: []
}>()

const CROPPER_SIZE = 300

const userStore = useUserStore()
const { clearErrors, getError, setError, setErrors, hasError, hasErrors } = useFormErrors()
const { getProfile, getIsLoadingEditProfile } = storeToRefs(userStore)

const imageSrc = ref<string | null>(null)
const avatarField = ref<File | null>(null)
const loadingAvatar = ref<boolean>(true)
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)
const fileInputRef = ref<InstanceType<typeof VFileInput> | null>(null)

const close = (): void => {
  emit('close')
}

const canvasToFile = (canvas: HTMLCanvasElement, fileName: string): Promise<File> => {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], fileName, { type: 'image/jpeg' })
          resolve(file)
        }
      },
      'image/jpeg',
      0.9,
    )
  })
}

const prepareFormData = () => {
  let data = new FormData()
  data.append('avatar', avatarField.value ? avatarField.value : EMPTY_FILE_VALUE)
  return data
}

const apply = async () => {
  userStore.setIsLoadingEditProfile(true)
  await crop()
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

const validateFile = (file: File) => {
  clearErrors()
  if (file.size === 0) setError('avatar', 'Нельзя загрузить пустой файл')
  if (!ALLOWED_FILE_MIME_TYPES.includes(file.type)) {
    setError(
      'avatar',
      `Некорректный формат файла. Допустимы только ${ALLOWED_FILE_TYPES.join(', ')}`,
    )
  }
}

const onFileChange = async (e: Event): Promise<void> => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  validateFile(file)
  if (hasErrors()) {
    deleteAvatar()
    return
  }

  const resizedBlob = await resizeImage(file, CROPPER_SIZE, CROPPER_SIZE)

  const reader = new FileReader()
  reader.onload = (event: ProgressEvent<FileReader>) => {
    imageSrc.value = event.target?.result as string
  }
  reader.readAsDataURL(resizedBlob)

  avatarField.value = new File([resizedBlob], file.name, { type: file.type })
}

const crop = async (): Promise<void> => {
  if (!cropperRef.value) return

  const { canvas } = cropperRef.value.getResult()
  if (!canvas) return

  const fileName = avatarField.value ? avatarField.value.name : `avatar-${Date.now()}.jpg`
  const croppedFile = await canvasToFile(canvas, fileName)

  const reader = new FileReader()
  reader.onload = (event: ProgressEvent<FileReader>) => {
    imageSrc.value = event.target?.result as string
  }
  reader.readAsDataURL(croppedFile)

  avatarField.value = croppedFile
}

const deleteAvatar = () => {
  imageSrc.value = null
  avatarField.value = null
}

const changeAvatar = () => {
  if (!fileInputRef.value) return
  fileInputRef.value.click()
}

onMounted(async () => {
  if (!getProfile.value || !getProfile.value.avatar) {
    loadingAvatar.value = false
    return
  }
  let fileData = await sendGetFileRequest(getProfile.value.avatar.url)

  const resizedBlob = await resizeImage(
    new File([fileData], getProfile.value.avatar.name, { type: fileData.type }),
    CROPPER_SIZE,
    CROPPER_SIZE,
  )

  imageSrc.value = await blobToBase64(resizedBlob)
  avatarField.value = new File([resizedBlob], getProfile.value.avatar.name, {
    type: resizedBlob.type,
  })
  loadingAvatar.value = false
})
</script>

<template>
  <form-dialog
    title="Редактирование аватара"
    :max-width="450"
    :loading="getIsLoadingEditProfile"
    @close="onCloseHandler"
  >
    <template v-if="imageSrc">
      <v-row no-gutters class="w-100 cropper-row-container justify-center py-3 mb-3">
        <cropper
          ref="cropperRef"
          :src="imageSrc"
          :stencil-props="{
            aspectRatio: 1,
            movable: true,
            resizable: true,
          }"
          :min-width="70"
          :min-height="70"
          :max-width="300"
          :max-height="300"
          :wheel-zoom="false"
          :zoom="false"
          :zoomable="false"
          :movable-image="false"
          image-restriction="fill-area"
          class="cropper px-3 py-4"
        />
      </v-row>
      <v-row no-gutters class="justify-end">
        <v-btn
          class="form-btn px-3 mr-3 mb-3"
          :readonly="getIsLoadingEditProfile"
          @click="changeAvatar"
        >
          Заменить
        </v-btn>
        <v-btn class="form-btn px-3 mb-3" :readonly="getIsLoadingEditProfile" @click="deleteAvatar">
          Удалить
        </v-btn>
      </v-row>
    </template>
    <v-file-input
      v-show="!imageSrc"
      ref="fileInputRef"
      v-model="avatarField"
      :accept="ALLOWED_FILE_TYPES"
      @change="onFileChange"
      :error="hasError('avatar')"
      :error-messages="getError('avatar')"
      label="Выберите изображение"
      class="form-input"
      prepend-icon=""
    />
  </form-dialog>
</template>

<style scoped>
.cropper-row-container {
  background: var(--brown-primary);
}

::v-deep(.vue-advanced-cropper__background),
::v-deep(.vue-advanced-cropper__foreground) {
  background: transparent;
}

.cropper {
  height: 300px;
  width: 300px;
  border-radius: 0;
}

::v-deep(.vue-simple-line) {
  border-color: var(--gold-accent);
  border-width: 2px;
}

::v-deep(.vue-simple-handler) {
  background: var(--gold-accent);
  width: 12px;
  height: 12px;
}
</style>
