import { urls } from '@/urls'
import type { PaginatedResponse } from '@/types/requests.ts'
import type { ISODateString } from '@/types/brands.ts'
import type { FileObject, NumberSelectorItem } from '@/types/utils.ts'
import {
  createBaseActionStore,
  createBaseResponseStore,
  createPaginatedResponseStore,
} from '@/utils/store.ts'

export type WorkspaceListItem = {
  id: number
  owner: string | null
  have_membership: boolean
  my_role: NumberSelectorItem | null
  password: string | null
  avatar: FileObject | null
  name: string
}

export type WorkspaceDetail = WorkspaceListItem

export type WorkspaceMemberListItem = {
  id: number
  user: string
  is_owner: boolean
  role: NumberSelectorItem
  its_me: boolean
  joined_at: ISODateString
}

export type WorkspaceJoinRequestData = {
  id: number
  password?: string
}

export type WorkspaceMemberUpdateRequestData = {
  role: number
}

export const useWorkspacesListStore = createPaginatedResponseStore<WorkspaceListItem>({
  storeId: 'workspacesList',
  url: urls.WORKSPACES.LIST,
})

// Создание и редактирование рабочего пространства уходят multipart: аватар передаётся файлом.
export const useWorkspacesCreateStore = createBaseActionStore<FormData>({
  storeId: 'workspacesCreate',
  url: urls.WORKSPACES.CREATE,
})

export const useWorkspacesDetailStore = createBaseResponseStore<WorkspaceDetail>({
  storeId: 'workspacesDetail',
  url: urls.WORKSPACES.DETAIL,
})

export const useWorkspacesEditStore = createBaseActionStore<FormData>({
  storeId: 'workspacesEdit',
  url: urls.WORKSPACES.EDIT,
})

export const useWorkspacesJoinStore = createBaseActionStore<WorkspaceJoinRequestData>({
  storeId: 'workspacesJoin',
  url: urls.WORKSPACES.JOIN,
})

export const useWorkspacesLeaveStore = createBaseActionStore({
  storeId: 'workspacesLeave',
  url: urls.WORKSPACES.LEAVE,
})

export const useWorkspaceMembersStore = createBaseResponseStore<
  PaginatedResponse<WorkspaceMemberListItem>
>({
  storeId: 'workspaceMembers',
  url: urls.WORKSPACES.MEMBERS.LIST,
})

export const useWorkspaceMemberEditStore = createBaseActionStore<WorkspaceMemberUpdateRequestData>({
  storeId: 'workspaceMemberEdit',
  url: urls.WORKSPACES.MEMBERS.EDIT,
})

export const useWorkspaceMemberDeleteStore = createBaseActionStore({
  storeId: 'workspaceMemberDelete',
  url: urls.WORKSPACES.MEMBERS.DELETE,
})

export const useWorkspaceRolesStore = createBaseResponseStore<NumberSelectorItem[]>({
  storeId: 'workspaceRoles',
  url: urls.SELECTORS.ROLES,
})
