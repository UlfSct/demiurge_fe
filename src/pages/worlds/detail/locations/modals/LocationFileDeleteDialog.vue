<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import ApplyDialog from '@/components/core/ApplyDialog.vue'
import type { FileDetail } from '@/types/utils.ts'
import { useLocationFileDeleteStore } from '@/stores/worlds/locations'
import { getRequestErrorText } from '@/utils/requests.ts'

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

interface IProps {
  locationId: number
  file: FileDetail
}

const props = defineProps<IProps>()

const store = useLocationFileDeleteStore()
const { getLoading } = storeToRefs(store)
const detailError = ref<string>('')

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const apply = async () => {
  if (getLoading.value) return
  detailError.value = ''

  try {
    await store.execute({}, { id: props.locationId, file_id: props.file.id })
    close(true)
  } catch (error) {
    detailError.value = getRequestErrorText(error, 'Не удалось удалить файл')
  }
}

const onCloseHandler = (applied: boolean): void => {
  if (applied) apply()
  else close(false)
}
</script>

<template>
  <apply-dialog
    :text="`Вы уверены, что хотите удалить файл «${props.file.file.name}»? Отменить это действие будет невозможно.`"
    :loading="getLoading"
    @close="onCloseHandler"
  >
    <span v-if="detailError" class="color--red text-body-1">{{ detailError }}</span>
  </apply-dialog>
</template>

<style scoped></style>
