<script setup lang="ts">
import type { WorkspaceListItem } from '@/stores/workspaces'
import ItemCard from '@/components/ui/blocks/ItemCard.vue'
import IconButton from '@/components/ui/buttons/IconButton.vue'
import ImagePlaceholder from '@/assets/listItemImagePlaceholder.svg'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/core/user.ts'
import routerNames from '@/router/names.ts'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify/framework'

const emit = defineEmits<{
  join: [item: WorkspaceListItem]
  leave: [item: WorkspaceListItem]
}>()

interface IProps {
  items: WorkspaceListItem[]
}

const props = defineProps<IProps>()

const router = useRouter()
const userStore = useUserStore()
const { getProfile } = storeToRefs(userStore)
const display = useDisplay()

const goToDetail = (item: WorkspaceListItem): void => {
  router.push({
    name: routerNames.WORKSPACES.DETAIL,
    params: {
      id: item.id,
    },
  })
}

const getColClass = (index: number): string => {
  const getItemsPerRow = (): number => {
    let itemsPerRow = 4
    if (display.lgAndDown.value) itemsPerRow = 2
    if (display.xs.value) itemsPerRow = 1
    return itemsPerRow
  }

  const itemsPerRow = getItemsPerRow()

  const needLeftPadding = (): boolean => index % itemsPerRow !== 0
  const needRightPadding = (): boolean => index % itemsPerRow !== itemsPerRow - 1
  const needTopPadding = (): boolean => index % itemsPerRow !== index

  let classStr = ''
  if (needLeftPadding()) classStr += ` pl-1`
  if (needRightPadding()) classStr += ` pr-1`
  if (needTopPadding()) classStr += ` pt-2`
  return classStr
}

const getItemImage = (item: WorkspaceListItem): string => {
  return item.avatar ? item.avatar.url : ImagePlaceholder
}

const getItemSubtitle = (item: WorkspaceListItem): string => {
  const parts: string[] = [item.owner ? `Владелец: ${item.owner}` : 'Владелец не указан']
  if (item.my_role) parts.push(item.my_role.text)
  return parts.join(' · ')
}

const isOwner = (item: WorkspaceListItem): boolean => {
  if (!getProfile.value) return false
  return item.owner === getProfile.value.username
}

const canJoin = (item: WorkspaceListItem): boolean => {
  return !item.have_membership
}

const canLeave = (item: WorkspaceListItem): boolean => {
  return item.have_membership && !isOwner(item)
}
</script>

<template>
  <v-row no-gutters class="mt-2 justify-center align-items-stretch">
    <v-col
      v-for="(item, index) of props.items"
      :key="`workspace_${item.id}`"
      cols="12"
      sm="6"
      xl="3"
      :class="getColClass(index)"
    >
      <item-card :title="item.name" :subtitle="getItemSubtitle(item)" :image="getItemImage(item)">
        <template #btn>
          <icon-button icon="more_horiz" class="mr-2" @click="goToDetail(item)" />
          <icon-button v-if="canJoin(item)" icon="login" @click="emit('join', item)" />
          <icon-button v-else-if="canLeave(item)" icon="logout" @click="emit('leave', item)" />
        </template>
      </item-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
