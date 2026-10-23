<script setup lang="ts">
import { computed } from 'vue'
import PageTitle from '@/components/lists/PageTitle.vue'
import routerNames from '@/router/names.ts'
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits<{
  back: []
}>()

interface IProps {
  title: string
  breadcrumbTitle?: string
  loading?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Рабочие пространства',
  breadcrumbTitle: '',
  loading: false,
})

const router = useRouter()
const route = useRoute()

const isDetail = computed(() => String(route.name).includes('WORKSPACES|DETAIL'))

const getBreadcrumbTitle = (): string => {
  return props.breadcrumbTitle ? props.breadcrumbTitle : props.title
}

const goToMain = (): void => {
  router.push({
    name: routerNames.MAIN,
  })
}

const goToWorkspacesList = (): void => {
  router.push({
    name: routerNames.WORKSPACES.LIST,
  })
}
</script>

<template>
  <page-title :title="props.title" :loading="props.loading" @back="emit('back')">
    <v-row no-gutters class="align-content-center flex-wrap">
      <v-card-title class="card-title card-title--no-margins card-title__subtitle">
        <span class="text--href text--href__underline" @click="goToMain">Главная</span>
        >
        <template v-if="isDetail">
          <span class="text--href text--href__underline" @click="goToWorkspacesList">
            Рабочие пространства
          </span>
          >
        </template>
        <span class="text--href text--href__underline--static">
          {{ isDetail ? getBreadcrumbTitle() : props.title }}
        </span>
      </v-card-title>
    </v-row>
  </page-title>
</template>

<style scoped></style>
