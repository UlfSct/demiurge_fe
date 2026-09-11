<script setup lang="ts">
interface IProps {
  title: string
  subtitle: string
  image: string
}

const props = defineProps<IProps>()
</script>

<template>
  <v-card class="default-card pa-2 fill-height d-flex flex-column">
    <v-img :src="props.image" :aspect-ratio="16 / 9" cover color="transparent" />
    <v-card-title class="card-title text-wrap pt-3 px-3">{{ props.title }}</v-card-title>
    <v-card-text class="card-title card-title__subtitle px-3">{{ props.subtitle }}</v-card-text>
    <v-row no-gutters class="px-3 pb-3 mt-auto align-content-end">
      <slot name="btn" />
    </v-row>
  </v-card>
</template>

<style scoped></style>
