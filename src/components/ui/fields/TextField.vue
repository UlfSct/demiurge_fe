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
  type?: string
  required?: boolean
  showAppendInner?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  label: '',
  readonly: false,
  error: false,
  errorMessages: null,
  autocomplete: undefined,
  required: false,
  type: 'text',
  showAppendInner: false,
})

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: string | null | undefined) => {
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <v-text-field
    v-model="modelValue"
    :type="props.type"
    :autocomplete="props.autocomplete"
    :readonly="props.readonly"
    :error="props.error"
    density="comfortable"
    variant="solo"
    :error-messages="props.errorMessages"
    @input="emit('input')"
    class="form-input mb-1 w-100"
  >
    <template #label>
      {{ props.label }}<span v-if="props.required" class="color--red">*</span>
    </template>
    <template v-if="props.showAppendInner" #append-inner>
      <slot name="append-inner"></slot>
    </template>
  </v-text-field>
</template>

<style scoped></style>
