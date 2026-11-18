<script setup lang="ts">
import { computed } from 'vue'
import type { WorldLocationDetail } from '@/stores/worlds/locations'
import type { FileDetail } from '@/types/utils.ts'
import BaseResponseBlock, { type IBaseResponseStore } from '@/components/core/BaseResponseBlock.vue'
import BasicTextBlock from '@/components/core/BasicTextBlock.vue'
import MarkdownArticle from '@/components/core/MarkdownArticle.vue'
import FileList from '@/components/ui/blocks/FileList.vue'
import ImageGallery from '@/components/ui/blocks/ImageGallery.vue'
import { getLocationIconName } from '@/utils/locations.ts'

const emit = defineEmits<{
  openLocation: [id: number]
  edit: []
  delete: []
  editArticle: []
  addFiles: []
  deleteFile: [file: FileDetail]
  addSubLocation: []
}>()

interface IProps {
  store: IBaseResponseStore<WorldLocationDetail>
  canEdit?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  canEdit: false,
})

const location = computed(() => props.store.getData)
const files = computed(() => (location.value?.files ?? []).filter((file) => !file.is_image))
const children = computed(() => location.value?.children ?? [])
const article = computed(() => location.value?.article ?? null)
const articleVisible = computed(() => {
  if (!article.value) return false
  return article.value.is_visible || props.canEdit
})
</script>

<template>
  <base-response-block
    :store="props.store"
    not-found-text="Место не существует или у вас нет прав для его просмотра"
  >
    <template v-if="location">
      <v-card class="default-card pa-6 mt-2 w-100">
        <v-row no-gutters class="align-center flex-wrap">
          <v-icon
            :icon="getLocationIconName(location.location_type.value)"
            size="48"
            color="gold-accent"
            class="mr-4"
          />
          <div>
            <div class="card-title card-title--no-margins text-wrap text-break">
              {{ location.name }}
            </div>
            <div class="card-title__subtitle">{{ location.location_type.text }}</div>
          </div>
          <div v-if="props.canEdit" class="d-flex align-center flex-wrap ga-2 ml-auto mt-3 mt-sm-0">
            <v-btn class="form-btn px-3" @click="emit('addSubLocation')"> Добавить подместо </v-btn>
            <v-btn class="form-btn px-3" @click="emit('edit')">Редактировать</v-btn>
            <v-btn class="form-btn px-3" @click="emit('delete')">Удалить</v-btn>
          </div>
        </v-row>

        <div class="text-body-1 mt-4 text-wrap text-break">{{ location.caption }}</div>

        <div v-if="location.parent" class="card-title__subtitle mt-3 text-wrap text-break">
          Входит в:
          <span class="text--href" @click="emit('openLocation', location.parent.id)">
            {{ location.parent.name }}
          </span>
        </div>
        <div v-if="!location.is_visible" class="card-title__subtitle mt-2">
          Место скрыто от читателей
        </div>
      </v-card>

      <div v-if="props.canEdit" class="d-flex justify-end mt-2">
        <v-btn class="form-btn px-3" @click="emit('editArticle')">
          {{ article ? 'Редактировать статью' : 'Добавить статью' }}
        </v-btn>
      </div>
      <div v-if="article && !article.is_visible && props.canEdit" class="card-title__subtitle mt-2">
        Статья скрыта от читателей
      </div>
      <markdown-article
        v-if="articleVisible && article"
        class="mt-2"
        :title="article.title"
        :source="article.article_text"
      />
      <basic-text-block v-else-if="article" class="mt-2" text="Статья скрыта автором места" />

      <v-card v-if="children.length" class="default-card pa-5 mt-2 w-100">
        <v-card-title class="card-title card-title--no-margins card-title--small mb-3">
          Вложенные места
        </v-card-title>
        <div class="children-list">
          <div
            v-for="child of children"
            :key="`child_location_${child.id}`"
            class="child-row"
            @click="emit('openLocation', child.id)"
          >
            <v-icon icon="place" size="20" color="gold-accent" class="mr-2 flex-shrink-0" />
            <span class="child-row__name">{{ child.name }}</span>
            <v-icon icon="chevron_right" size="18" class="child-row__open ml-auto" />
          </div>
        </div>
      </v-card>

      <image-gallery
        :images="location.images"
        :can-delete="props.canEdit"
        class="mt-2"
        @delete-image="emit('deleteFile', $event)"
      />
      <file-list
        v-if="files.length || props.canEdit"
        class="mt-2"
        :files="files"
        :can-upload="props.canEdit"
        :can-delete="props.canEdit"
        @add-files="emit('addFiles')"
        @delete-file="emit('deleteFile', $event)"
      />
    </template>
  </base-response-block>
</template>

<style scoped lang="scss">
.children-list {
  border-top: 1px solid var(--color-border);
}

.child-row {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;

  &:hover {
    background: var(--gradient-panel);
    border-color: var(--color-border-hover);
  }
}

.child-row__name {
  color: var(--text-light);
  font-family: var(--font-primary), serif;
  font-size: 15px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.child-row__open {
  color: var(--gold-dark);
}
</style>
