<script setup lang="ts">
import { type ActiveLoader, useLoading } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const loaderConfig = useLoading({
  isFullPage: false,
  height: 100,
  width: 100,
  color: '#D4AF37',
  backgroundColor: '#000',
  opacity: 0.7,
  loader: 'dots',
})

const loader = ref<ActiveLoader | null>(null)

onMounted(() => {
  loader.value = loaderConfig.show()
})

onBeforeUnmount(() => {
  if (!loader.value) return
  loader.value.hide()
})
</script>

<template>
  <v-row no-gutters class="fill-height vl-parent position-relative"></v-row>
</template>

<style scoped></style>
