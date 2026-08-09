<script setup lang="ts">
import { useRouter } from 'vue-router'

export interface IMainRouterCard {
  title: string
  text: string
  routeName: string
  image: string
}

interface IProps {
  item: IMainRouterCard
}

const props = defineProps<IProps>()

const router = useRouter()

const goTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

<template>
  <v-card class="default-card pa-2 mx-3 fill-height d-flex flex-column">
    <v-img :src="props.item.image" :aspect-ratio="20 / 9" cover />
    <v-card-title class="card-title text-wrap pt-3">{{ props.item.title }}</v-card-title>
    <v-card-text class="card-title card-title__subtitle">{{ props.item.text }}</v-card-text>
    <v-row no-gutters class="px-4 pb-3 pt-2 mt-auto align-content-end">
      <v-btn class="form-btn px-3" @click="goTo(props.item.routeName)"> Перейти </v-btn>
    </v-row>
  </v-card>
</template>

<style scoped></style>
