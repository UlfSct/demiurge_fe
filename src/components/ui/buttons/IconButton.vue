<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()

interface IProps {
  icon?: string
  readonly?: boolean
  size?: number
}

const props = withDefaults(defineProps<IProps>(), {
  icon: 'add',
  readonly: false,
  size: 30,
})
</script>

<template>
  <v-btn
    :class="`form-btn__icon px-0 form-btn__icon--s${props.size}`"
    :readonly="props.readonly"
    @click="emit('click')"
  >
    <v-icon>{{ props.icon }}</v-icon>
  </v-btn>
</template>

<style scoped></style>
