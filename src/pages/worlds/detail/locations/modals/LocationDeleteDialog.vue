<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ApplyDialog from '@/components/core/ApplyDialog.vue'
import { useLocationDeleteStore } from '@/stores/worlds/locations'

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

interface IProps {
  itemId: number
}

const props = defineProps<IProps>()

const store = useLocationDeleteStore()
const { getLoading } = storeToRefs(store)

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const apply = async () => {
  if (getLoading.value) return
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
    text="Вы уверены, что хотите удалить это место? Вложенные места останутся в мире, но потеряют родителя. Отменить это действие будет невозможно."
    :loading="getLoading"
    @close="onCloseHandler"
  />
</template>

<style scoped></style>
