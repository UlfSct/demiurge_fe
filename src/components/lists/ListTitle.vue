<script setup lang="ts">
import IconButton from '@/components/ui/IconButton.vue'

const emit = defineEmits<{
  add: []
}>()

interface IProps {
  title: string
  showAddButton?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Заголовок',
  showAddButton: true,
})
</script>

<template>
  <v-card class="default-card px-5 py-4 w-100">
    <v-row no-gutters class="align-content-center justify-space-between flex-nowrap">
      <v-col cols="auto" class="flex-grow-1 flex-shrink-1">
        <v-card-title class="card-title card-title--no-margins text-wrap text-break">
          {{ props.title }}
        </v-card-title>
      </v-col>
      <v-col cols="auto" class="flex-shrink-0 pl-3">
        <slot name="btn-left"></slot>
        <icon-button icon="add" v-if="props.showAddButton" @click="emit('add')" />
        <slot name="btn-right"></slot>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped></style>
