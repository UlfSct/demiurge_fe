<script setup lang="ts">
import PageTitle from '@/components/lists/PageTitle.vue'

const emit = defineEmits<{
  back: []
}>()

interface IProps {
  title: string
  loading?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Заголовок',
  loading: false,
})
</script>

<template>
  <page-title :title="props.title" :loading="props.loading" @back="emit('back')">
    <v-row no-gutters class="align-content-center flex-wrap">
      <v-card-title
        class="card-title card-title--no-margins card-title__subtitle text-wrap text-break font-weight-bold"
      >
        Главная > <span class="text-decoration-underline"> Миры</span>
      </v-card-title>
    </v-row>
  </page-title>
</template>

<style scoped></style>
