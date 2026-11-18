<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import WorldsTitle from '@/components/worlds/WorldsTitle.vue'
import ArticleEditorDialog from '@/components/core/ArticleEditorDialog.vue'
import FileUploadDialog from '@/components/core/FileUploadDialog.vue'
import LocationDetail from '@/pages/worlds/detail/locations/LocationDetail.vue'
import LocationDeleteDialog from '@/pages/worlds/detail/locations/modals/LocationDeleteDialog.vue'
import LocationFileDeleteDialog from '@/pages/worlds/detail/locations/modals/LocationFileDeleteDialog.vue'
import LocationFormDialog from '@/pages/worlds/detail/locations/modals/LocationFormDialog.vue'
import routerNames from '@/router/names.ts'
import type { FileDetail } from '@/types/utils.ts'
import { useWorldsDetailStore } from '@/stores/worlds'
import {
  useLocationArticleCreateStore,
  useLocationArticleEditStore,
  useLocationDetailStore,
  useLocationFileCreateStore,
} from '@/stores/worlds/locations'

const route = useRoute()
const router = useRouter()
const store = useLocationDetailStore()
const worldStore = useWorldsDetailStore()
const articleCreateStore = useLocationArticleCreateStore()
const articleEditStore = useLocationArticleEditStore()
const fileCreateStore = useLocationFileCreateStore()

const { getLoading, getData } = storeToRefs(store)
const { getData: getWorldData } = storeToRefs(worldStore)

const worldId = computed(() => Number(route.params.id))
const locationId = computed(() => Number(route.params.locationId))
const requestParams = computed(() => ({ id: locationId.value }))
const canEdit = computed(() => {
  const world = getWorldData.value
  if (!world || world.id !== worldId.value) return false
  return Boolean(world.is_author || world.is_demiurge)
})

const editDialogOpened = ref<boolean>(false)
const deleteDialogOpened = ref<boolean>(false)
const articleDialogOpened = ref<boolean>(false)
const filesDialogOpened = ref<boolean>(false)
const subLocationDialogOpened = ref<boolean>(false)
const fileToDelete = ref<FileDetail | null>(null)

const reloadLocation = async (): Promise<void> => {
  if (!Number.isFinite(locationId.value)) return
  await store.execute({}, requestParams.value)
}

watch(
  locationId,
  async (id) => {
    if (!Number.isFinite(id)) return

    await store.execute({}, { id })

    // Пока грузилось предыдущее место, пользователь мог перейти в подместо —
    // тогда стор пропустит запрос из-за loading, поэтому повторяем для актуального id.
    if (locationId.value !== id) {
      await store.execute({}, { id: locationId.value })
    }
  },
  { immediate: true },
)

watch(
  worldId,
  async (id) => {
    if (!Number.isFinite(id)) return
    await worldStore.execute({}, { id })
  },
  { immediate: true },
)

const onBackHandler = (): void => {
  router.push({
    name: routerNames.WORLDS.DETAIL.INDEX,
    params: {
      id: worldId.value,
    },
  })
}

const openLocation = (id: number): void => {
  router.push({
    name: routerNames.WORLDS.DETAIL.LOCATION_DETAIL,
    params: {
      id: worldId.value,
      locationId: id,
    },
  })
}

const openEditDialog = (): void => {
  editDialogOpened.value = true
}

const closeEditDialog = async (needReload: boolean): Promise<void> => {
  editDialogOpened.value = false
  if (needReload) await reloadLocation()
}

const openDeleteDialog = (): void => {
  deleteDialogOpened.value = true
}

const closeDeleteDialog = async (needReload: boolean): Promise<void> => {
  deleteDialogOpened.value = false
  if (!needReload) return

  const parentId = getData.value?.parent?.id
  if (parentId) {
    openLocation(parentId)
    return
  }

  router.push({
    name: routerNames.WORLDS.DETAIL.INDEX,
    params: {
      id: worldId.value,
    },
  })
}

const openArticleDialog = (): void => {
  articleDialogOpened.value = true
}

const closeArticleDialog = async (needReload: boolean): Promise<void> => {
  articleDialogOpened.value = false
  if (needReload) await reloadLocation()
}

const openFilesDialog = (): void => {
  filesDialogOpened.value = true
}

const closeFilesDialog = async (needReload: boolean): Promise<void> => {
  filesDialogOpened.value = false
  if (needReload) await reloadLocation()
}

const openSubLocationDialog = (): void => {
  subLocationDialogOpened.value = true
}

const closeSubLocationDialog = async (needReload: boolean): Promise<void> => {
  subLocationDialogOpened.value = false
  if (needReload) await reloadLocation()
}

const openDeleteFileDialog = (file: FileDetail): void => {
  fileToDelete.value = file
}

const closeDeleteFileDialog = async (needReload: boolean): Promise<void> => {
  fileToDelete.value = null
  if (needReload) await reloadLocation()
}
</script>

<template>
  <v-row no-gutters class="pa-5">
    <worlds-title
      title="Место"
      :breadcrumb-title="getData?.name ?? ''"
      :loading="getLoading"
      @back="onBackHandler"
    />
    <location-detail
      :store="store"
      :can-edit="canEdit"
      @open-location="openLocation"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @edit-article="openArticleDialog"
      @add-files="openFilesDialog"
      @delete-file="openDeleteFileDialog"
      @add-sub-location="openSubLocationDialog"
    />
  </v-row>

  <location-form-dialog
    v-if="editDialogOpened && getData"
    :world-id="worldId"
    :item-id="getData.id"
    @close="closeEditDialog"
  />
  <location-delete-dialog
    v-if="deleteDialogOpened && getData"
    :item-id="getData.id"
    @close="closeDeleteDialog"
  />
  <location-form-dialog
    v-if="subLocationDialogOpened && getData"
    :world-id="worldId"
    :parent-id="getData.id"
    @close="closeSubLocationDialog"
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
  <location-file-delete-dialog
    v-if="fileToDelete && getData"
    :location-id="getData.id"
    :file="fileToDelete"
    @close="closeDeleteFileDialog"
  />
</template>

<style scoped></style>
