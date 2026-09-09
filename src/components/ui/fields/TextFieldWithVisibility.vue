<script setup lang="ts">
import { computed, ref } from 'vue'
import TextField from '@/components/ui/fields/TextField.vue'

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
  required?: boolean
  autocomplete?: string | undefined
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  label: '',
  readonly: false,
  error: false,
  errorMessages: null,
  required: false,
  autocomplete: undefined,
})

const showText = ref<boolean>(false)

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: string | null | undefined) => {
    emit('update:modelValue', value)
  },
})

const toggleShowText = () => {
  showText.value = !showText.value
}
</script>

<template>
  <text-field
    v-model="modelValue"
    :label="props.label"
    :type="showText ? 'text' : 'password'"
    :autocomplete="props.autocomplete"
    :readonly="props.readonly"
    :error="props.error"
    :error-messages="props.errorMessages"
    :required="props.required"
    :show-append-inner="true"
    @input="emit('input')"
    class="form-input mb-1 w-100"
  >
    <template #append-inner>
      <v-btn
        :icon="showText ? 'visibility' : 'visibility_off'"
        class="form-btn__icon--no-shadow"
        :readonly="props.readonly"
        @click="toggleShowText"
      />
    </template>
  </text-field>
</template>

<style scoped lang="scss">
.password-input :deep(input[type='password']::-ms-reveal),
.password-input :deep(input[type='password']::-ms-clear) {
  display: none;
}

.password-input :deep(input[type='password']::-webkit-credentials-auto-fill-button),
.password-input :deep(input[type='password']::-webkit-caps-lock-indicator) {
  visibility: hidden;
  display: none !important;
  pointer-events: none;
}
</style>
