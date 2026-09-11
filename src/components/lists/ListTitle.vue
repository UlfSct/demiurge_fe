<script setup lang="ts">
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
    <v-row no-gutters class="align-content-center justify-space-between flex-nowrap">
      <v-card-title class="card-title card-title--no-margins text-wrap text-break">
        {{ props.title }}
      </v-card-title>
    </v-row>
  </v-card>
</template>

<style scoped></style>
