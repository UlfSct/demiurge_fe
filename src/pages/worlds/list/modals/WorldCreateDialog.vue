<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWorldsCreateStore, type WorldsCreateRequestData } from '@/stores/worlds'
import FormDialog from '@/components/core/FormDialog.vue'
import TextField from '@/components/ui/fields/TextField.vue'
import CheckBoxField from '@/components/ui/fields/CheckBoxField.vue'
import { ref } from 'vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import type { RequestErrorObject } from '@/types/requests.ts'
import TextArea from '@/components/ui/fields/TextArea.vue'

type WorldCreateFormData = {
  name: string | null
  caption: string | null
  is_public: boolean
}

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

const store = useWorldsCreateStore()
const { getLoading } = storeToRefs(store)
const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()

const formData = ref<WorldCreateFormData>({
  name: '',
  caption: '',
  is_public: false,
})

const validateFormData = () => {
  if (!formData.value.name) setError('name', 'Это поле обязательно для заполнения')
  if (!formData.value.caption) setError('caption', 'Это поле обязательно для заполнения')
}

const prepareFormData = (): WorldsCreateRequestData => {
  return {
    name: String(formData.value.name),
    caption: String(formData.value.caption),
    is_public: formData.value.is_public,
  }
}

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const apply = async () => {
  clearErrors()
  validateFormData()
  if (hasErrors()) return
  try {
    await store.execute(prepareFormData())
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
  <form-dialog title="Создание мира" :loading="getLoading" @close="onCloseHandler">
    <text-field
      v-model="formData.name"
      label="Название"
      :required="true"
      :readonly="getLoading"
      :error="hasError('name')"
      :error-messages="getError('name')"
      @input="clearError('name')"
    />
    <text-area
      v-model="formData.caption"
      label="Описание"
      :required="true"
      :readonly="getLoading"
      :error="hasError('caption')"
      :error-messages="getError('caption')"
      @input="clearError('caption')"
    />
    <check-box-field
      v-model="formData.is_public"
      label="Доступен всем"
      :readonly="getLoading"
      :error="hasError('is_public')"
      :error-messages="getError('is_public')"
      @input="clearError('is_public')"
    />
  </form-dialog>
</template>

<style scoped></style>
