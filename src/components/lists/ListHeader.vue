<script setup lang="ts">
import { ITEMS_PER_PAGE_SELECTOR_ITEMS } from '@/utils/consts.ts'
import { ref } from 'vue'
import { useDisplay } from 'vuetify/framework'

const emit = defineEmits<{
  changeItemsPerPageValue: [value: number]
}>()

interface IProps {
  loading: boolean
}

const props = defineProps<IProps>()

const display = useDisplay()
const itemsPerPage = ref(12)
</script>

<template>
  <v-card class="default-card px-5 py-4 w-100 mt-2">
    <v-row no-gutters class="ga-2 flex-wrap">
      <v-text-field
        class="form-input flex-grow-1 flex-shrink-1 min-width-200"
        :class="{
          'max-width-250': display.mdAndUp.value,
        }"
        density="compact"
        placeholder="Поиск"
        append-inner-icon="search"
        hide-details
        :readonly="props.loading"
      />
      <v-row no-gutters class="justify-end ml-auto flex-shrink-0 flex-wrap">
        <span class="card-title__subtitle pt-2 pr-2 text-wrap text-break">
          Записей на странице:
        </span>
        <v-select
          v-model="itemsPerPage"
          class="form-input max-width-90"
          :items="ITEMS_PER_PAGE_SELECTOR_ITEMS"
          density="compact"
          :readonly="props.loading"
          placeholder="Поиск"
          hide-details
          @update:model-value="(val) => emit('changeItemsPerPageValue', val)"
        />
      </v-row>
    </v-row>
  </v-card>
</template>

<style scoped></style>
