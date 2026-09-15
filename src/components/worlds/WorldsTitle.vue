<script setup lang="ts">
import PageTitle from '@/components/lists/PageTitle.vue'
import { useRoute, useRouter } from 'vue-router'
import routerNames from '@/router/names.ts'

const emit = defineEmits<{
  back: []
}>()

interface IProps {
  title: string
  breadcrumbTitle?: string
  loading?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Заголовок',
  breadcrumbTitle: '',
  loading: false,
})

const router = useRouter()
const route = useRoute()

const showWorldsList = (): boolean => {
  return String(route.name).includes('WORLDS|DETAIL')
}

const showWorldDetail = (): boolean => {
  return showWorldsList() && !String(route.name).includes('INDEX')
}

const getBreadcrumbTitle = (): string => {
  return props.breadcrumbTitle ? props.breadcrumbTitle : props.title
}

const goToMain = (): void => {
  router.push({
    name: routerNames.MAIN,
  })
}

const goToWorldsList = (): void => {
  router.push({
    name: routerNames.WORLDS.LIST,
  })
}

const goToWorldDetail = (): void => {
  router.push({
    name: routerNames.WORLDS.DETAIL.INDEX,
    params: {
      id: Number(route.params.id),
    },
  })
}
</script>

<template>
  <page-title :title="props.title" :loading="props.loading" @back="emit('back')">
    <v-row no-gutters class="align-content-center flex-wrap">
      <v-card-title class="card-title card-title--no-margins card-title__subtitle">
        <span class="text--href text--href__underline" @click="goToMain">Главная</span>
        >
        <template v-if="showWorldsList()">
          <span class="text--href text--href__underline" @click="goToWorldsList">Миры</span>
          >
        </template>
        <template v-if="showWorldDetail()">
          <span class="text--href text--href__underline" @click="goToWorldDetail">Мир</span>
          >
        </template>
        <span class="text--href text--href__underline--static">{{ getBreadcrumbTitle() }}</span>
      </v-card-title>
    </v-row>
  </page-title>
</template>

<style scoped></style>
