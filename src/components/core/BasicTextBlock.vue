<script setup lang="ts">
interface IProps {
  text: String
}

const props = defineProps<IProps>()
</script>

<template>
  <v-card class="default-card px-5 py-4 w-100 text-center">{{ props.text }}</v-card>
</template>

<style scoped></style>
