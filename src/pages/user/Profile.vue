<script setup lang="ts">
import { useUserStore } from '@/stores/core/user.ts'
import { storeToRefs } from 'pinia'
import { displayDate, displayDateWithTime } from '@/utils/date.ts'
import UserAvatar from '@/components/core/UserAvatar.vue'
import ChangePasswordDialog from '@/components/profile/ChangePasswordDialog.vue'
import EditProfileDialog from '@/components/profile/EditProfileDialog.vue'
import EditProfileAvatarDialog from '@/components/profile/EditProfileAvatarDialog.vue'
import { ref } from 'vue'

const userStore = useUserStore()
const { getProfile } = storeToRefs(userStore)

const editDialogOpened = ref(false)
const editAvatarDialogOpened = ref(false)
const changePasswordDialogOpened = ref(false)

const showSubtitleText = (): boolean => {
  if (!getProfile.value) return false
  return !!getProfile.value.first_name || !!getProfile.value.last_name
}

const getUsernameSubtitleText = (): string => {
  if (!getProfile.value) return ''
  if (!showSubtitleText()) return ''
  if (!!getProfile.value.first_name && !!getProfile.value.last_name) {
    return `(${getProfile.value.last_name} ${getProfile.value.first_name})`
  }
  if (!!getProfile.value.first_name) return `(${getProfile.value.first_name})`
  return `(${getProfile.value.last_name})`
}

const getUsernameText = (): string => {
  if (!getProfile.value) return ''
  return getProfile.value.username
}

const getAvatarUrl = (): string | undefined => {
  if (!getProfile.value || !getProfile.value.avatar) return undefined
  return getProfile.value.avatar.url
}

const getJoined = (): string => {
  if (!getProfile.value) return ''
  return displayDateWithTime(getProfile.value.date_joined)
}

const getEmail = (): string => {
  if (!getProfile.value) return ''
  return getProfile.value.email
}

const openEditDialog = () => {
  editDialogOpened.value = true
}

const openEditAvatarDialog = () => {
  editAvatarDialogOpened.value = true
}

const openChangePasswordDialog = () => {
  changePasswordDialogOpened.value = true
}

const closeEditDialog = () => {
  editDialogOpened.value = false
}

const closeEditAvatarDialog = () => {
  editAvatarDialogOpened.value = false
}

const closeChangePasswordDialog = () => {
  changePasswordDialogOpened.value = false
}
</script>

<template>
  <v-row no-gutters class="pa-5 justify-center">
    <v-col cols="12" md="8" lg="6">
      <v-card class="default-card pa-6">
        <v-card-title class="default-title mb-6">Профиль</v-card-title>
        <v-col class="d-flex flex-column align-center mb-6">
          <user-avatar
            class="cursor-pointer"
            :avatar="getAvatarUrl()"
            :size="120"
            @click="openEditAvatarDialog"
          >
            <div
              class="avatar-overlay"
              @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')"
              @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.opacity = '0')"
            >
              <v-icon icon="photo" color="gold-accent" size="32" />
            </div>
          </user-avatar>
          <v-card-text class="card-title card-title--centered text-wrap text-break">
            {{ getUsernameText() }}
          </v-card-text>
          <v-card-text
            v-if="showSubtitleText()"
            class="card-title__subtitle pt-1 text-center text-wrap text-break"
          >
            {{ getUsernameSubtitleText() }}
          </v-card-text>
          <v-row no-gutters class="d-flex ga-2">
            <v-btn icon="edit" class="form-btn__icon" @click="openEditDialog" />
            <v-btn icon="photo" class="form-btn__icon" @click="openEditAvatarDialog" />
            <v-btn icon="lock_reset" class="form-btn__icon" @click="openChangePasswordDialog" />
          </v-row>
        </v-col>
        <v-row no-gutters class="ga-3">
          <v-col cols="12" class="d-flex align-center default-card--no-border pa-2">
            <v-icon icon="email" size="20" class="mr-4 ml-2" opacity="0.7" color="gold-accent" />
            <v-row no-gutters>
              <v-col cols="12" class="text-caption"> EMAIL </v-col>
              <v-col cols="12" class="text-body-1 text-wrap text-break">
                {{ getEmail() }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="d-flex align-center default-card--no-border pa-2">
            <v-icon
              icon="calendar_month"
              size="20"
              class="mr-4 ml-2"
              opacity="0.7"
              color="gold-accent"
            />
            <v-row no-gutters>
              <v-col cols="12" class="text-caption"> НА ПОРТАЛЕ С </v-col>
              <v-col cols="12" class="text-body-1 text-wrap text-break">
                {{ getJoined() }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <change-password-dialog v-if="changePasswordDialogOpened" @close="closeChangePasswordDialog" />
    <edit-profile-dialog v-if="editDialogOpened" @close="closeEditDialog" />
    <edit-profile-avatar-dialog v-if="editAvatarDialogOpened" @close="closeEditAvatarDialog" />
  </v-row>
</template>

<style scoped>
.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold-accent);
}
</style>
