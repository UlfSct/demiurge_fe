<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits<{
  'update:modelValue': [value: boolean | undefined]
  change: []
}>()

interface IProps {
  modelValue?: boolean | undefined
  label?: string
  readonly?: boolean
  error?: boolean
  errorMessages?: string | string[] | null
  required?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  label: '',
  readonly: false,
  error: false,
  errorMessages: null,
  required: false,
})

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: boolean | undefined) => {
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <v-checkbox
    v-model="modelValue"
    :readonly="props.readonly"
    :error="props.error"
    density="comfortable"
    :error-messages="props.errorMessages"
    @change="emit('change')"
    class="form-input form-input__checkbox mb-1 w-100"
  >
    <template #label>
      {{ props.label }}<span v-if="props.required" class="color--red">*</span>
    </template>
  </v-checkbox>
</template>

<style scoped></style>
