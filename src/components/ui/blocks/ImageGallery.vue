<script setup lang="ts">
import { ref } from 'vue'
import type { FileDetail } from '@/types/utils.ts'

interface IProps {
  images: FileDetail[]
  title?: string
  canDelete?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Галерея',
  canDelete: false,
})

const emit = defineEmits<{
  deleteImage: [image: FileDetail]
}>()

const imageDialogOpened = ref<boolean>(false)
const selectedImage = ref<FileDetail | null>(null)

const openImage = (image: FileDetail): void => {
  selectedImage.value = image
  imageDialogOpened.value = true
}
</script>

<template>
  <v-card v-if="props.images.length" class="default-card pa-5 w-100">
    <v-card-title class="card-title card-title--no-margins card-title--small mb-3">
      {{ props.title }}
    </v-card-title>
    <v-row no-gutters class="ga-2">
      <v-col v-for="image of props.images" :key="`gallery_${image.id}`" cols="6" sm="4" md="3">
        <div class="gallery-tile" @click="openImage(image)">
          <img :src="image.file.url" :alt="image.file.name" class="gallery-image" />
          <v-btn
            v-if="props.canDelete"
            class="gallery-delete form-btn__icon px-0 form-btn__icon--s30"
            title="Удалить изображение"
            @click.stop="emit('deleteImage', image)"
          >
            <v-icon color="red-accent">delete</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="imageDialogOpened" max-width="1000">
      <v-card v-if="selectedImage" class="default-card pa-2">
        <img :src="selectedImage.file.url" :alt="selectedImage.file.name" class="gallery-preview" />
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped lang="scss">
.gallery-tile {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-gold-glow);
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--color-border-focus);
  }
}

.gallery-delete {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  z-index: 1;
}

.gallery-image {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 100%;
}

.gallery-preview {
  display: block;
  max-width: 100%;
  max-height: 80vh;
  margin: 0 auto;
}
</style>
