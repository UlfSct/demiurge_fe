<script setup lang="ts">
import { computed, ref } from 'vue'
import FormDialog from '@/components/core/FormDialog.vue'
import type { ActionStore } from '@/utils/store.ts'
import { getRequestErrorText } from '@/utils/requests.ts'

interface IProps {
  uploadStore: ActionStore<FormData>
  params: Record<string, number>
  title?: string
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Добавление файлов',
})

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

const files = ref<File[] | File | null>(null)
const isUploading = ref<boolean>(false)
const uploadedCount = ref<number>(0)
const errorText = ref<string>('')

const loading = computed(() => props.uploadStore.getLoading || isUploading.value)

const getSelectedFiles = (): File[] => {
  if (!files.value) return []
  return Array.isArray(files.value) ? files.value : [files.value]
}

const onFilesChange = (): void => {
  errorText.value = ''
}

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const apply = async () => {
  if (loading.value) return

  errorText.value = ''

  const selectedFiles = getSelectedFiles()
  if (!selectedFiles.length) {
    errorText.value = 'Выберите хотя бы один файл'
    return
  }

  isUploading.value = true

  try {
    for (let index = 0; index < selectedFiles.length; index++) {
      const file = selectedFiles[index]
      if (!file) continue

      const data = new FormData()
      data.append('file', file)
      await props.uploadStore.execute(data, props.params)
      uploadedCount.value++

      // Оставляем в поле только ещё не загруженные файлы: повтор после ошибки не продублирует их.
      const remainingFiles = selectedFiles.slice(index + 1)
      files.value = remainingFiles.length ? remainingFiles : null
    }

    close(true)
  } catch (error) {
    errorText.value = getRequestErrorText(error, 'Не удалось загрузить файл')
  } finally {
    isUploading.value = false
  }
}

const onCloseHandler = (applied: boolean): void => {
  if (applied) apply()
  else close(uploadedCount.value > 0)
}
</script>

<template>
  <form-dialog
    :title="props.title"
    apply-text="Загрузить"
    :max-width="600"
    :loading="loading"
    @close="onCloseHandler"
  >
    <v-file-input
      v-model="files"
      label="Файлы"
      multiple
      :readonly="loading"
      :error="Boolean(errorText)"
      :error-messages="errorText"
      class="form-input"
      prepend-icon=""
      @update:model-value="onFilesChange"
    />
    <p class="card-title__subtitle w-100 px-3">
      Можно выбрать несколько файлов — они загрузятся по одному.
    </p>
    <p v-if="uploadedCount > 0" class="card-title__subtitle w-100 px-3">
      Уже загружено: {{ uploadedCount }}
    </p>
  </form-dialog>
</template>

<style scoped></style>
