<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import FormDialog from '@/components/core/FormDialog.vue'
import TextFieldWithVisibility from '@/components/ui/fields/TextFieldWithVisibility.vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import {
  useWorkspacesJoinStore,
  type WorkspaceJoinRequestData,
  type WorkspaceListItem,
} from '@/stores/workspaces'
import type { RequestErrorObject } from '@/types/requests.ts'

type WorkspaceJoinFormData = {
  password: string | null
}

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

interface IProps {
  workspace: WorkspaceListItem
}

const props = defineProps<IProps>()

const store = useWorkspacesJoinStore()
const { getLoading } = storeToRefs(store)
const { clearErrors, clearError, getError, setErrors, hasError } = useFormErrors()

const formData = ref<WorkspaceJoinFormData>({
  password: null,
})

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const getOwnerText = (): string => {
  return props.workspace.owner ? `Владелец: ${props.workspace.owner}` : 'Владелец не указан'
}

const prepareRequestData = (): WorkspaceJoinRequestData => {
  const data: WorkspaceJoinRequestData = {
    id: props.workspace.id,
  }
  if (formData.value.password) data.password = String(formData.value.password)
  return data
}

const apply = async () => {
  clearErrors()
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

const onPasswordInput = () => {
  clearError('password')
  clearError('detail')
}
</script>

<template>
  <form-dialog
    title="Вход в рабочее пространство"
    apply-text="Войти"
    :max-width="450"
    :loading="getLoading"
    @close="onCloseHandler"
  >
    <v-row no-gutters class="w-100 mb-2 flex-column">
      <span class="card-title card-title--no-margins card-title--small text-wrap text-break">
        {{ props.workspace.name }}
      </span>
      <span class="card-title__subtitle pt-1 text-wrap text-break">{{ getOwnerText() }}</span>
    </v-row>
    <text-field-with-visibility
      v-model="formData.password"
      label="Пароль (если требуется)"
      autocomplete="off"
      :readonly="getLoading"
      :error="hasError('password') || hasError('detail')"
      :error-messages="getError('password') || getError('detail')"
      @input="onPasswordInput"
    />
  </form-dialog>
</template>

<style scoped></style>
