<script setup lang="ts">
const emit = defineEmits<{
  setPage: [value: number]
}>()

interface IProps {
  selected: boolean
  page: number
}

const props = defineProps<IProps>()
</script>

<template>
  <v-btn
    v-if="props.selected"
    class="form-btn__icon px-0 form-footer-text font-size-16 cursor-auto"
  >
    {{ props.page }}
  </v-btn>
  <span
    v-else
    class="form-footer-text w-30px h-30px text-center align-content-center text--href font-size-16"
    @click="emit('setPage', props.page)"
  >
    {{ props.page }}
  </span>
</template>

<style scoped></style>
