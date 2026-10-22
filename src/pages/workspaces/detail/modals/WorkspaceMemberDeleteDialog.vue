<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import ApplyDialog from '@/components/core/ApplyDialog.vue'
import { useWorkspaceMemberDeleteStore, type WorkspaceMemberListItem } from '@/stores/workspaces'
import { getRequestErrorText } from '@/utils/requests.ts'

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

interface IProps {
  member: WorkspaceMemberListItem
}

const props = defineProps<IProps>()

const store = useWorkspaceMemberDeleteStore()
const { getLoading } = storeToRefs(store)
const errorText = ref<string>('')

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const apply = async () => {
  errorText.value = ''
  try {
    await store.execute({}, { id: props.member.id })
    close(true)
  } catch (error) {
    errorText.value = getRequestErrorText(error, 'Не удалось удалить участника')
  }
}

const onCloseHandler = (applied: boolean): void => {
  if (applied) apply()
  else close(false)
}
</script>

<template>
  <apply-dialog
    :text="`Удалить участника «${props.member.user}» из пространства?`"
    apply-text="Удалить"
    :loading="getLoading"
    @close="onCloseHandler"
  >
    <span v-if="errorText" class="color--red text-body-1">{{ errorText }}</span>
  </apply-dialog>
</template>

<style scoped></style>
