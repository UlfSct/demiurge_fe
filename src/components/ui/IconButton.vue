<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()

interface IProps {
  icon: string
}

const props = withDefaults(defineProps<IProps>(), {
  icon: 'add',
})
</script>

<template>
  <v-btn class="form-btn__icon px-0" @click="emit('click')">
    <v-icon>{{ props.icon }}</v-icon>
  </v-btn>
</template>

<style scoped></style>
