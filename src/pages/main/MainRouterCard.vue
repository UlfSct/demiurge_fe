<script setup lang="ts">
import { useRouter } from 'vue-router'
import IconButton from '@/components/ui/buttons/IconButton.vue'
import ItemCard from '@/components/ui/blocks/ItemCard.vue'

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
  <item-card :title="props.item.title" :subtitle="props.item.text" :image="props.item.image">
    <template #btn>
      <icon-button icon="more_horiz" @click="goTo(props.item.routeName)" />
    </template>
  </item-card>
</template>

<style scoped></style>
