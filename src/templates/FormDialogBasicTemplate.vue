<script setup lang="ts">
import { storeToRefs } from 'pinia'
import FormDialog from '@/components/core/FormDialog.vue'
import { ref } from 'vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import type { RequestErrorObject } from '@/types/requests.ts'

// TODO: типизация formData
type DomainActionFormData = {}

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

// TODO: store
const store = useWorldsDomainStore()
const { getLoading } = storeToRefs(store)
const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()

const formData = ref<DomainActionFormData>({})

const validateFormData = () => {
  // TODO: валидация
}

// TODO: типизация (вынести в store)
type DomainActionRequestData = {}
const prepareRequestData = (): DomainActionRequestData => {
  return {}
}

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const apply = async () => {
  clearErrors()
  validateFormData()
  if (hasErrors()) return
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
</script>

<template>
  <form-dialog title="Заголовок формы" :loading="getLoading" @close="onCloseHandler">
    <!--    <text-field-->
    <!--      v-model="formData.name"-->
    <!--      label="Название"-->
    <!--      :required="true"-->
    <!--      :readonly="getLoading"-->
    <!--      :error="hasError('name')"-->
    <!--      :error-messages="getError('name')"-->
    <!--      @input="clearError('name')"-->
    <!--    />-->
  </form-dialog>
</template>

<style scoped></style>
