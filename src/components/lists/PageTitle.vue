<script setup lang="ts">
import IconButton from '@/components/ui/buttons/IconButton.vue'

const emit = defineEmits<{
  back: []
}>()

interface IProps {
  title: string
  loading?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Заголовок',
  showAddButton: true,
  loading: false,
})
</script>

<template>
  <v-card class="default-card px-5 py-4 w-100">
    <slot />
    <v-row no-gutters class="align-content-center mt-2 flex-nowrap">
      <icon-button icon="arrow_back" class="mr-3" @click="emit('back')" />
      <v-row no-gutters style="margin-top: 2px">
        <v-card-title class="card-title card-title--no-margins text-wrap text-break">
          {{ props.title }}
        </v-card-title>
      </v-row>
    </v-row>
  </v-card>
</template>

<style scoped></style>
