<script setup lang="ts">
import { computed } from 'vue'
import type { WorkspaceMemberListItem } from '@/stores/workspaces'
import IconButton from '@/components/ui/buttons/IconButton.vue'
import LoadingBlock from '@/components/core/LoadingBlock.vue'
import BasicTextBlock from '@/components/core/BasicTextBlock.vue'
import { displayDateWithTime } from '@/utils/date.ts'

interface IProps {
  members: WorkspaceMemberListItem[]
  count: number
  loading: boolean
  canManage: boolean
  roleItems: { title: string; value: number }[]
  busyMemberId?: number | null
  errorText?: string
}

const props = withDefaults(defineProps<IProps>(), {
  busyMemberId: null,
  errorText: '',
})

const emit = defineEmits<{
  changeRole: [member: WorkspaceMemberListItem, role: number]
  remove: [member: WorkspaceMemberListItem]
}>()

const canChangeRole = (member: WorkspaceMemberListItem): boolean => {
  return props.canManage && !member.is_owner && !member.its_me
}

const canRemove = (member: WorkspaceMemberListItem): boolean => {
  return props.canManage && !member.is_owner && !member.its_me
}

const emptyText = computed(() => {
  if (props.members.length === 1 && props.members[0]?.its_me) return 'Кроме вас участников нет'
  return 'Пока нет участников'
})

const onRoleChange = (member: WorkspaceMemberListItem, value: unknown): void => {
  emit('changeRole', member, Number(value))
}
</script>

<template>
  <v-card class="default-card pa-5 mt-2 w-100">
    <v-row no-gutters class="align-center justify-space-between mb-2">
      <span class="card-title card-title--no-margins card-title--small">Участники</span>
      <span class="card-title__subtitle">Всего: {{ props.count }}</span>
    </v-row>
    <span v-if="props.canManage" class="card-title__subtitle d-block mb-2">
      Вы администратор: можно менять роли и удалять участников
    </span>
    <span v-if="props.count > props.members.length" class="card-title__subtitle d-block mb-2">
      Показаны первые {{ props.members.length }}
    </span>
    <span v-if="props.errorText" class="color--red text-body-1 d-block mb-2">
      {{ props.errorText }}
    </span>
    <loading-block v-if="props.loading" />
    <basic-text-block v-else-if="!props.members.length" :text="emptyText" />
    <template v-else>
      <template v-for="(member, index) in props.members" :key="`member_${member.id}`">
        <v-row no-gutters class="align-center py-2">
          <v-col cols="12" sm="4" class="text-body-1 text-wrap text-break">
            {{ member.user }}
            <span v-if="member.its_me" class="card-title__subtitle">(вы)</span>
          </v-col>
          <v-col cols="12" sm="3" class="card-title__subtitle">
            {{ displayDateWithTime(member.joined_at) }}
          </v-col>
          <v-col cols="12" sm="5" class="d-flex align-center flex-wrap">
            <v-select
              v-if="canChangeRole(member)"
              :key="`member_role_${member.id}_${member.role.value}_${props.busyMemberId}`"
              :model-value="member.role.value"
              :items="props.roleItems"
              item-title="title"
              item-value="value"
              density="compact"
              hide-details
              class="form-input max-width-200"
              :readonly="props.busyMemberId === member.id"
              @update:model-value="(value) => onRoleChange(member, value)"
            />
            <span v-else class="text-body-1">{{ member.role.text }}</span>
            <span v-if="member.is_owner" class="card-title__subtitle ml-2">Владелец</span>
            <icon-button
              v-if="canRemove(member)"
              icon="delete"
              class="ml-auto"
              title="Удалить участника"
              :readonly="props.busyMemberId === member.id"
              @click="emit('remove', member)"
            />
          </v-col>
        </v-row>
        <v-divider v-if="index < props.members.length - 1" />
      </template>
    </template>
  </v-card>
</template>

<style scoped></style>
