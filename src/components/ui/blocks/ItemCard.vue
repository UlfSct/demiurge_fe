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
    <div class="item-card-image-wrap">
      <img :src="props.image" :alt="props.title" class="item-card-image" loading="lazy" />
    </div>
    <v-card-title class="card-title text-wrap pt-3 px-3">{{ props.title }}</v-card-title>
    <v-card-text class="card-title card-title__subtitle px-3">{{ props.subtitle }}</v-card-text>
    <v-row no-gutters class="px-3 pb-3 mt-auto align-content-end">
      <slot name="btn" />
    </v-row>
  </v-card>
</template>

<style scoped>
.item-card-image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 280px;
  overflow: hidden;
  background: var(--color-bg-tertiary);
}

.item-card-image {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 280px;
}
</style>
