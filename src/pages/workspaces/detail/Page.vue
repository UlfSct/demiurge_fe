<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseResponseBlock from '@/components/core/BaseResponseBlock.vue'
import BasicTextBlock from '@/components/core/BasicTextBlock.vue'
import WorkspacesTitle from '@/components/workspaces/WorkspacesTitle.vue'
import WorkspaceMembers from '@/pages/workspaces/detail/WorkspaceMembers.vue'
import WorkspaceEditDialog from '@/pages/workspaces/detail/modals/WorkspaceEditDialog.vue'
import WorkspaceMemberDeleteDialog from '@/pages/workspaces/detail/modals/WorkspaceMemberDeleteDialog.vue'
import WorkspaceJoinDialog from '@/pages/workspaces/list/modals/WorkspaceJoinDialog.vue'
import routerNames from '@/router/names.ts'
import {
  useWorkspaceMemberEditStore,
  useWorkspaceMembersStore,
  useWorkspaceRolesStore,
  useWorkspacesDetailStore,
  type WorkspaceMemberListItem,
} from '@/stores/workspaces'
import { WORKSPACE_ROLES } from '@/utils/consts.ts'
import { getRequestErrorText } from '@/utils/requests.ts'

const MEMBERS_PAGE_SIZE = 100

const FALLBACK_ROLE_ITEMS: { title: string; value: number }[] = [
  { title: 'Администратор', value: WORKSPACE_ROLES.ADMIN },
  { title: 'Участник', value: WORKSPACE_ROLES.MEMBER },
]

const route = useRoute()
const router = useRouter()

const detailStore = useWorkspacesDetailStore()
const membersStore = useWorkspaceMembersStore()
const rolesStore = useWorkspaceRolesStore()
const memberEditStore = useWorkspaceMemberEditStore()

const { getLoading: getDetailLoading } = storeToRefs(detailStore)
const { getLoading: getMembersLoading } = storeToRefs(membersStore)

const requestParams = computed(() => ({ id: Number(route.params.id) }))
const detail = computed(() => detailStore.getData)
const members = computed(() => membersStore.getData?.results ?? [])
const membersCount = computed(() => membersStore.getData?.count ?? 0)
const roleItems = computed(() => {
  const items = rolesStore.getData
  if (!items || !items.length) return FALLBACK_ROLE_ITEMS
  return items.map((item) => ({ title: item.text, value: item.value }))
})
const canManage = computed(() => detail.value?.my_role?.value === WORKSPACE_ROLES.ADMIN)

const editDialogOpened = ref<boolean>(false)
const joinDialogOpened = ref<boolean>(false)
const removeDialogOpened = ref<boolean>(false)
const selectedMember = ref<WorkspaceMemberListItem | null>(null)
const busyMemberId = ref<number | null>(null)
const memberActionError = ref<string>('')

const loadMembers = async (): Promise<void> => {
  await membersStore.execute(
    {},
    {},
    { workspace: Number(route.params.id), size: MEMBERS_PAGE_SIZE },
  )
}

const reloadDetail = async (): Promise<void> => {
  await detailStore.execute({}, requestParams.value)
}

const onBackHandler = (): void => {
  router.push({
    name: routerNames.WORKSPACES.LIST,
  })
}

const openEditDialog = (): void => {
  editDialogOpened.value = true
}

const closeEditDialog = async (needReload: boolean): Promise<void> => {
  editDialogOpened.value = false
  if (needReload) await reloadDetail()
}

const openJoinDialog = (): void => {
  joinDialogOpened.value = true
}

const closeJoinDialog = async (needReload: boolean): Promise<void> => {
  joinDialogOpened.value = false
  if (!needReload) return
  await reloadDetail()
  await loadMembers()
}

const openRemoveDialog = (member: WorkspaceMemberListItem): void => {
  selectedMember.value = member
  removeDialogOpened.value = true
}

const closeRemoveDialog = async (needReload: boolean): Promise<void> => {
  removeDialogOpened.value = false
  selectedMember.value = null
  if (needReload) await loadMembers()
}

const onMemberRoleChange = async (member: WorkspaceMemberListItem, role: number): Promise<void> => {
  if (role === member.role.value) return

  busyMemberId.value = member.id
  memberActionError.value = ''

  try {
    await memberEditStore.execute({ role }, { id: member.id })
  } catch (error) {
    memberActionError.value = getRequestErrorText(error, 'Не удалось изменить роль участника')
  } finally {
    await loadMembers()
    busyMemberId.value = null
  }
}

onMounted(async () => {
  await detailStore.execute({}, requestParams.value)
  await loadMembers()
  await rolesStore.execute({})
})
</script>

<template>
  <v-row no-gutters class="pa-5">
    <workspaces-title
      title="Рабочее пространство"
      :breadcrumb-title="detail ? detail.name : ''"
      :loading="getDetailLoading"
      @back="onBackHandler"
    />
    <base-response-block
      :store="detailStore"
      not-found-text="Пространство не существует или у вас нет прав для его просмотра"
    >
      <v-card class="default-card pa-6 mt-2 w-100">
        <v-row no-gutters class="align-start flex-wrap">
          <v-col cols="12" sm="2" class="d-flex justify-center justify-sm-start mb-3 mb-sm-0">
            <v-avatar :size="120" rounded="0" class="user-avatar">
              <v-img v-if="detail?.avatar" :src="detail.avatar.url" cover />
              <v-icon v-else icon="workspaces" size="48" color="gold-accent" />
            </v-avatar>
          </v-col>
          <v-col cols="12" sm="7">
            <v-card-title class="card-title card-title--no-margins text-wrap text-break">
              {{ detail?.name }}
            </v-card-title>
            <div class="card-title__subtitle pt-1 text-wrap text-break">
              Владелец: {{ detail?.owner ? detail.owner : 'не указан' }}
            </div>
            <div v-if="detail?.my_role" class="card-title__subtitle">
              Ваша роль: {{ detail.my_role.text }}
            </div>
            <div v-if="detail?.password" class="card-title__subtitle">Доступ по паролю</div>
          </v-col>
          <v-col cols="12" sm="3" class="d-flex justify-end">
            <v-btn v-if="canManage" class="form-btn px-3" @click="openEditDialog">
              Редактировать
            </v-btn>
            <v-btn
              v-else-if="!detail?.have_membership"
              class="form-btn px-3"
              @click="openJoinDialog"
            >
              Войти
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <workspace-members
        v-if="detail?.have_membership"
        :members="members"
        :count="membersCount"
        :loading="getMembersLoading"
        :can-manage="canManage"
        :role-items="roleItems"
        :busy-member-id="busyMemberId"
        :error-text="memberActionError"
        @change-role="onMemberRoleChange"
        @remove="openRemoveDialog"
      />
      <basic-text-block
        v-else
        class="mt-2"
        text="Вы не участник пространства, список участников недоступен"
      />
    </base-response-block>
    <workspace-edit-dialog
      v-if="editDialogOpened && detail"
      :workspace="detail"
      @close="closeEditDialog"
    />
    <workspace-join-dialog
      v-if="joinDialogOpened && detail"
      :workspace="detail"
      @close="closeJoinDialog"
    />
    <workspace-member-delete-dialog
      v-if="removeDialogOpened && selectedMember"
      :member="selectedMember"
      @close="closeRemoveDialog"
    />
  </v-row>
</template>

<style scoped></style>
