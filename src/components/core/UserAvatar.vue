<script setup lang="ts">
import { toRefs } from 'vue'

interface Props {
  avatar?: string | undefined
  size?: number | undefined
}

const props = withDefaults(defineProps<Props>(), {
  avatar: undefined,
  size: 120,
})
const { avatar, size } = toRefs(props)
</script>

<template>
  <v-avatar :size="size" class="user-avatar" rounded="0">
    <v-img v-if="avatar" :src="avatar" cover />
    <v-icon v-else icon="person" size="64" color="gold-accent" />
    <slot />
  </v-avatar>
</template>

<style scoped></style>
