<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import WorldsTitle from '@/components/worlds/WorldsTitle.vue'
import ArticleEditorDialog from '@/components/core/ArticleEditorDialog.vue'
import FileUploadDialog from '@/components/core/FileUploadDialog.vue'
import WorldDetail from '@/pages/worlds/detail/index/WorldDetail.vue'
import WorldDeleteDialog from '@/pages/worlds/list/modals/WorldDeleteDialog.vue'
import WorldEditDialog from '@/pages/worlds/list/modals/WorldEditDialog.vue'
import routerNames from '@/router/names.ts'
import {
  useWorldsArticleCreateStore,
  useWorldsArticleEditStore,
  useWorldsDetailStore,
  useWorldsFileCreateStore,
} from '@/stores/worlds'

const route = useRoute()
const router = useRouter()
const store = useWorldsDetailStore()
const articleCreateStore = useWorldsArticleCreateStore()
const articleEditStore = useWorldsArticleEditStore()
const fileCreateStore = useWorldsFileCreateStore()
const { getLoading, getData } = storeToRefs(store)

const requestParams = computed(() => ({ id: Number(route.params.id) }))
const editDialogOpened = ref<boolean>(false)
const deleteDialogOpened = ref<boolean>(false)
const articleDialogOpened = ref<boolean>(false)
const filesDialogOpened = ref<boolean>(false)

const reloadDetail = async (): Promise<void> => {
  await store.execute({}, requestParams.value)
}

const onBackHandler = (): void => {
  router.push({
    name: routerNames.WORLDS.LIST,
  })
}

const openEditDialog = (): void => {
  editDialogOpened.value = true
}

const closeEditDialog = async (needReload: boolean): Promise<void> => {
  editDialogOpened.value = false
  if (needReload) await reloadDetail()
}

const openDeleteDialog = (): void => {
  deleteDialogOpened.value = true
}

const closeDeleteDialog = async (needReload: boolean): Promise<void> => {
  deleteDialogOpened.value = false
  if (!needReload) return

  router.push({
    name: routerNames.WORLDS.LIST,
  })
}

const openArticleDialog = (): void => {
  articleDialogOpened.value = true
}

const closeArticleDialog = async (needReload: boolean): Promise<void> => {
  articleDialogOpened.value = false
  if (needReload) await reloadDetail()
}

const openFilesDialog = (): void => {
  filesDialogOpened.value = true
}

const closeFilesDialog = async (needReload: boolean): Promise<void> => {
  filesDialogOpened.value = false
  if (needReload) await reloadDetail()
}

onMounted(() => {
  reloadDetail()
})
</script>

<template>
  <v-row no-gutters class="pa-5">
    <worlds-title
      title="Мир"
      :breadcrumb-title="getData?.name ?? ''"
      :loading="getLoading"
      @back="onBackHandler"
    />
    <world-detail
      :store="store"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @edit-article="openArticleDialog"
      @add-files="openFilesDialog"
    />
  </v-row>
  <world-edit-dialog
    v-if="editDialogOpened && getData"
    :item-id="getData.id"
    @close="closeEditDialog"
  />
  <world-delete-dialog
    v-if="deleteDialogOpened && getData"
    :item-id="getData.id"
    @close="closeDeleteDialog"
  />
  <article-editor-dialog
    v-if="articleDialogOpened && getData"
    :article="getData.article"
    :create-store="articleCreateStore"
    :edit-store="articleEditStore"
    :params="requestParams"
    @close="closeArticleDialog"
  />
  <file-upload-dialog
    v-if="filesDialogOpened && getData"
    :upload-store="fileCreateStore"
    :params="requestParams"
    @close="closeFilesDialog"
  />
</template>

<style scoped></style>
