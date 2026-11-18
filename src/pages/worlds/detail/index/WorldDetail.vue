<script setup lang="ts">
import { computed } from 'vue'
import type { WorldDetail } from '@/stores/worlds'
import BaseResponseBlock, { type IBaseResponseStore } from '@/components/core/BaseResponseBlock.vue'
import BasicTextBlock from '@/components/core/BasicTextBlock.vue'
import MarkdownArticle from '@/components/core/MarkdownArticle.vue'
import FileList from '@/components/ui/blocks/FileList.vue'
import ImageGallery from '@/components/ui/blocks/ImageGallery.vue'
import WorldLocationsSection from '@/pages/worlds/detail/locations/WorldLocationsSection.vue'
import ImagePlaceholder from '@/assets/listItemImagePlaceholder.svg'

const emit = defineEmits<{
  edit: []
  delete: []
  editArticle: []
  addFiles: []
}>()

interface IProps {
  store: IBaseResponseStore<WorldDetail>
}

const props = defineProps<IProps>()

const world = computed(() => props.store.getData)
const images = computed(() => world.value?.images ?? [])
const coverImage = computed(() => images.value[0]?.file.url ?? ImagePlaceholder)
const galleryImages = computed(() => images.value.slice(1))
const files = computed(() => (world.value?.files ?? []).filter((file) => !file.is_image))
const authorsText = computed(() => {
  return (world.value?.authors ?? []).map((author) => author.text).join(', ')
})
const canEdit = computed(() => {
  return Boolean(world.value?.is_author || world.value?.is_demiurge)
})
const canDelete = computed(() => Boolean(world.value?.is_demiurge))
const article = computed(() => world.value?.article ?? null)
const articleVisible = computed(() => {
  if (!article.value) return false
  return article.value.is_visible || canEdit.value
})
</script>

<template>
  <base-response-block :store="props.store">
    <template v-if="world">
      <v-card class="default-card pa-0 mt-2 w-100 overflow-hidden">
        <div class="world-cover-wrap">
          <img :src="coverImage" :alt="world.name" class="world-cover" />
        </div>
        <div class="pa-6">
          <v-row no-gutters class="align-start justify-space-between flex-wrap">
            <v-col cols="12" md="8">
              <div class="card-title card-title--no-margins text-wrap text-break">
                {{ world.name }}
              </div>
              <div class="text-body-1 mt-2 text-wrap text-break">{{ world.caption }}</div>
              <div class="card-title__subtitle mt-3 text-wrap text-break">
                Демиург: {{ world.demiurge || 'не указан' }}
              </div>
              <div v-if="authorsText" class="card-title__subtitle text-wrap text-break">
                Авторы: {{ authorsText }}
              </div>
              <div class="card-title__subtitle">
                {{ world.is_public ? 'Публичный мир' : 'Приватный мир' }}
              </div>
            </v-col>
            <v-col cols="12" md="4" class="d-flex justify-md-end flex-wrap ga-2 mt-3 mt-md-0">
              <v-btn v-if="canEdit" class="form-btn px-3" @click="emit('edit')">
                Редактировать
              </v-btn>
              <v-btn v-if="canDelete" class="form-btn px-3" @click="emit('delete')">
                Удалить
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>

      <div v-if="canEdit" class="d-flex justify-end mt-2">
        <v-btn class="form-btn px-3" @click="emit('editArticle')">
          {{ article ? 'Редактировать статью' : 'Добавить статью' }}
        </v-btn>
      </div>
      <div v-if="article && !article.is_visible && canEdit" class="card-title__subtitle mt-2">
        Статья скрыта от читателей
      </div>
      <markdown-article
        v-if="articleVisible && article"
        class="mt-2"
        :title="article.title"
        :source="article.article_text"
      />
      <basic-text-block v-else-if="article" class="mt-2" text="Статья скрыта автором мира" />
      <basic-text-block v-else class="mt-2" text="Статья о мире пока не создана" />

      <world-locations-section :world-id="world.id" :can-edit="canEdit" class="mt-2" />

      <image-gallery :images="galleryImages" class="mt-2" />

      <file-list
        v-if="files.length || canEdit"
        class="mt-2"
        :files="files"
        :can-upload="canEdit"
        @add-files="emit('addFiles')"
      />
    </template>
  </base-response-block>
</template>

<style scoped lang="scss">
.world-cover-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 480px;
  overflow: hidden;
  background: var(--color-bg-tertiary);
  border-bottom: 2px solid var(--color-border-focus);
}

.world-cover {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 480px;
}
</style>
