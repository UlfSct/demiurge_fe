<script setup lang="ts">
import type { WorldDetail } from '@/stores/worlds'
import BaseResponseBlock, { type IBaseResponseStore } from '@/components/core/BaseResponseBlock.vue'
import ItemCard from '@/components/ui/blocks/ItemCard.vue'
import ImagePlaceholder from '@/assets/listItemImagePlaceholder.svg'

interface IProps {
  store: IBaseResponseStore<WorldDetail>
}

const props = defineProps<IProps>()

const getItemImage = (item: WorldDetail): string => {
  if (!item.images.length) return ImagePlaceholder
  return ImagePlaceholder
}
</script>

<template>
  <base-response-block :store="props.store">
    <item-card
      v-if="props.store.getData"
      class="mt-2"
      :title="props.store.getData.name"
      :subtitle="props.store.getData.caption"
      :image="getItemImage(props.store.getData)"
    />
  </base-response-block>
</template>

<style scoped></style>
