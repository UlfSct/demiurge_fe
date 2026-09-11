<script setup lang="ts">
import { useDisplay } from 'vuetify/framework'
import IconButton from '@/components/ui/buttons/IconButton.vue'

const emit = defineEmits<{
  create: []
}>()

interface IProps {
  loading?: boolean
  showAddButton?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  showAddButton: true,
  loading: false,
})
</script>

<template>
  <v-card class="default-card px-5 py-4 w-100 mt-2">
    <v-row no-gutters class="align-center justify-space-between">
      <v-text-field
        class="form-input max-width-250 mr-3"
        density="compact"
        placeholder="Поиск"
        append-inner-icon="search"
        hide-details
        :readonly="props.loading"
      />
      <slot name="btn-left"></slot>
      <icon-button
        icon="add"
        v-if="props.showAddButton"
        :readonly="props.loading"
        :size="40"
        @click="emit('create')"
      />
      <slot name="btn-right"></slot>
    </v-row>
  </v-card>
</template>

<style scoped></style>
