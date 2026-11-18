<script setup lang="ts">
import { ref } from 'vue'
import type { FileDetail } from '@/types/utils.ts'
import IconButton from '@/components/ui/buttons/IconButton.vue'
import { downloadFile, getFileIconName, getSafeFileName } from '@/utils/files.ts'

interface IProps {
  files: FileDetail[]
  title?: string
  canUpload?: boolean
  canDelete?: boolean
  emptyText?: string
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Файлы',
  canUpload: false,
  canDelete: false,
  emptyText: 'Файлов пока нет',
})

const emit = defineEmits<{
  addFiles: []
  deleteFile: [file: FileDetail]
}>()

const downloadingFileId = ref<number | null>(null)
const downloadError = ref<string>('')

const onDownloadFile = async (file: FileDetail): Promise<void> => {
  downloadError.value = ''
  downloadingFileId.value = file.id

  try {
    const fileName = getSafeFileName(file.file.name, `file-${file.id}`)
    await downloadFile(file.file.url, fileName)
  } catch {
    downloadError.value = 'Не удалось скачать файл'
  } finally {
    downloadingFileId.value = null
  }
}
</script>

<template>
  <v-card class="default-card pa-5 w-100">
    <v-row no-gutters class="align-center justify-space-between mb-3">
      <v-card-title class="card-title card-title--no-margins card-title--small">
        {{ props.title }}
      </v-card-title>
      <v-btn v-if="props.canUpload" class="form-btn px-3" @click="emit('addFiles')">
        Добавить файлы
      </v-btn>
    </v-row>
    <p v-if="!props.files.length" class="text-body-1">{{ props.emptyText }}</p>
    <v-row
      v-for="file of props.files"
      :key="`file_${file.id}`"
      no-gutters
      class="align-center py-1"
    >
      <v-icon
        :icon="getFileIconName(file.file.name)"
        size="20"
        color="gold-accent"
        class="mr-2 flex-shrink-0"
      />
      <a
        :href="file.file.url"
        class="text--href text-wrap text-break"
        @click.prevent="onDownloadFile(file)"
      >
        {{ getSafeFileName(file.file.name, `file-${file.id}`) }}
      </a>
      <span v-if="file.help_text" class="card-title__subtitle ml-3 text-wrap text-break">
        {{ file.help_text }}
      </span>
      <icon-button
        icon="download"
        class="ml-auto"
        title="Скачать"
        :readonly="downloadingFileId === file.id"
        @click="onDownloadFile(file)"
      />
      <v-btn
        v-if="props.canDelete"
        class="form-btn__icon px-0 form-btn__icon--s30 ml-1"
        title="Удалить файл"
        :readonly="downloadingFileId === file.id"
        @click="emit('deleteFile', file)"
      >
        <v-icon color="red-accent">delete</v-icon>
      </v-btn>
    </v-row>
    <p v-if="downloadError" class="color--red text-body-1 mt-2">{{ downloadError }}</p>
  </v-card>
</template>

<style scoped></style>
