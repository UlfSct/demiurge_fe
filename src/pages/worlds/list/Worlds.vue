<script setup lang="ts">
import type { WorldsListItem } from '@/stores/worlds'
import ItemCard from '@/components/ui/blocks/ItemCard.vue'
import IconButton from '@/components/ui/buttons/IconButton.vue'
import ImagePlaceholder from '@/assets/worlds/worldsListItemImagePlaceholder.svg'
import routerNames from '@/router/names.ts'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify/framework'

const emit = defineEmits<{
  delete: [id: number]
  edit: [id: number]
}>()

interface IProps {
  items: WorldsListItem[]
}

const props = defineProps<IProps>()
const router = useRouter()
const display = useDisplay()

const getColClass = (index: number): string => {
  const getItemsPerRow = (): number => {
    let itemsPerRow = 4
    if (display.smAndDown.value) itemsPerRow = 2
    if (display.xs.value) itemsPerRow = 1
    return itemsPerRow
  }

  const itemsPerRow = getItemsPerRow()

  const needLeftPadding = (): boolean => index % itemsPerRow !== 0
  const needRightPadding = (): boolean => index % itemsPerRow !== itemsPerRow - 1

  let classStr = ''
  if (needLeftPadding()) classStr += ` pl-2`
  if (needRightPadding()) classStr += ` pr-2`
  return classStr
}

const showEditButton = (item: WorldsListItem): boolean => {
  return item.is_author || item.is_demiurge
}

const showDeleteButton = (item: WorldsListItem): boolean => {
  return item.is_demiurge
}

const getItemTitle = (item: WorldsListItem) => {
  return item.name
}

const getItemSubtitle = (item: WorldsListItem) => {
  return item.caption
}

const getItemImage = (item: WorldsListItem): string => {
  if (!item.images.length) return ImagePlaceholder
  return ImagePlaceholder
}

const goToDetail = (item: WorldsListItem) => {
  router.push({
    name: routerNames.WORlDS.DETAIL.INDEX,
    params: {
      id: item.id,
    },
  })
}
</script>

<template>
  <v-row no-gutters class="mt-2 justify-center align-items-stretch">
    <v-col
      v-for="(item, index) of props.items"
      :key="`world_${item.id}`"
      cols="12"
      sm="6"
      xl="3"
      :class="getColClass(index)"
    >
      <item-card
        :title="getItemTitle(item)"
        :subtitle="getItemSubtitle(item)"
        :image="getItemImage(item)"
      >
        <template #btn>
          <icon-button icon="more_horiz" class="mr-2" @click="goToDetail(item)" />
          <icon-button
            v-if="showEditButton(item)"
            icon="edit"
            class="mr-2"
            @click="emit('edit', item.id)"
          />
          <icon-button
            v-if="showDeleteButton(item)"
            icon="delete"
            @click="emit('delete', item.id)"
          />
        </template>
      </item-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
