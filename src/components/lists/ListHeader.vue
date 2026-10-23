<script setup lang="ts">
import { computed } from 'vue'
import IconButton from '@/components/ui/buttons/IconButton.vue'

const emit = defineEmits<{
  create: []
  'update:search': [value: string]
}>()

interface IProps {
  loading?: boolean
  showAddButton?: boolean
  searchable?: boolean
  search?: string
}

const props = withDefaults(defineProps<IProps>(), {
  showAddButton: true,
  loading: false,
  searchable: false,
  search: '',
})

const searchValue = computed({
  get: () => props.search,
  set: (value: string | null | undefined) => emit('update:search', value ?? ''),
})
</script>

<template>
  <v-card class="default-card px-5 py-4 w-100 mt-2">
    <v-row no-gutters class="align-center justify-space-between">
      <v-text-field
        v-model="searchValue"
        class="form-input max-width-250 mr-3"
        density="compact"
        placeholder="Поиск"
        append-inner-icon="search"
        hide-details
        clearable
        :readonly="!props.searchable"
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
