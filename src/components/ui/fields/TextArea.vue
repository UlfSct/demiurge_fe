<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits<{
  'update:modelValue': [value: string | null | undefined]
  input: []
}>()

interface IProps {
  modelValue?: string | null | undefined
  label?: string
  readonly?: boolean
  error?: boolean
  errorMessages?: string | string[] | null
  autocomplete?: string | undefined
  required?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  label: '',
  readonly: false,
  error: false,
  errorMessages: null,
  autocomplete: undefined,
  required: false,
})

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: string | null | undefined) => {
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <v-textarea
    v-model="modelValue"
    :autocomplete="props.autocomplete"
    :readonly="props.readonly"
    :error="props.error"
    density="comfortable"
    variant="solo"
    rows="3"
    no-resize
    :error-messages="props.errorMessages"
    @input="emit('input')"
    class="form-input mb-1 w-100"
  >
    <template #label>
      {{ props.label }}<span v-if="props.required" class="color--red">*</span>
    </template>
  </v-textarea>
</template>

<style scoped></style>
