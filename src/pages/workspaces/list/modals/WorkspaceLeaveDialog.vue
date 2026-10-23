<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ApplyDialog from '@/components/core/ApplyDialog.vue'
import { useWorkspacesLeaveStore, type WorkspaceListItem } from '@/stores/workspaces'

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

interface IProps {
  workspace: WorkspaceListItem
}

const props = defineProps<IProps>()

const store = useWorkspacesLeaveStore()
const { getLoading } = storeToRefs(store)

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const apply = async () => {
  await store.execute({}, { id: props.workspace.id })
  close(true)
}

const onCloseHandler = (applied: boolean): void => {
  if (applied) apply()
  else close(false)
}
</script>

<template>
  <apply-dialog
    :text="`Покинуть рабочее пространство «${props.workspace.name}»?`"
    apply-text="Покинуть"
    :loading="getLoading"
    @close="onCloseHandler"
  />
</template>

<style scoped></style>
