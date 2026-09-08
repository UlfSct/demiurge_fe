<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()

interface IProps {
  icon: string
  readonly?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  icon: 'add',
  readonly: false,
})
</script>

<template>
  <v-btn class="form-btn__icon px-0" :readonly="props.readonly" @click="emit('click')">
    <v-icon>{{ props.icon }}</v-icon>
  </v-btn>
</template>

<style scoped></style>
