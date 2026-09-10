<script setup lang="ts">
import ApplyDialog from '@/components/core/ApplyDialog.vue'
import { useWorldsDeleteStore } from '@/stores/worlds'
import { storeToRefs } from 'pinia'

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

interface IProps {
  itemId: number
}

const props = defineProps<IProps>()

const store = useWorldsDeleteStore()
const { getLoading } = storeToRefs(store)

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const apply = async () => {
  await store.execute({}, { id: props.itemId })
  close(true)
}

const onCloseHandler = (applied: boolean): void => {
  if (applied) apply()
  else close(false)
}
</script>

<template>
  <apply-dialog
    text="Вы уверены, что хотите удалить данный мир? Отменить это действие будет невозможно."
    :loading="getLoading"
    @close="onCloseHandler"
  />
</template>

<style scoped></style>
