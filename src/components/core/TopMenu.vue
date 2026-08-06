<script setup lang="ts">
import logoImage from '@/assets/logo.jpg'
import { useUserStore } from '@/stores/core/user.ts'
import routerNames from '@/router/names.ts'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { getIsAuthenticated, getIsInitialized, getIsLoadingLogin, getIsLoadingRegister } =
  storeToRefs(userStore)

const showProfileButton = (): boolean => {
  return getIsAuthenticated.value && getIsInitialized.value && route.name !== routerNames.PROFILE
}

const showMainButton = () => {
  return getIsAuthenticated.value && getIsInitialized.value && route.name !== routerNames.MAIN
}

const showLoginButton = (): boolean => {
  return (
    !getIsAuthenticated.value &&
    getIsInitialized.value &&
    route.name !== routerNames.LOGIN &&
    route.name !== routerNames.REGISTRATION
  )
}

const showLogoutButton = (): boolean => {
  return getIsAuthenticated.value && getIsInitialized.value
}

const goToProfile = () => {
  if (getIsLoadingLogin.value || getIsLoadingRegister.value) return
  router.push({ name: routerNames.PROFILE })
}

const goToLogin = () => {
  if (getIsLoadingLogin.value || getIsLoadingRegister.value) return
  router.push({ name: routerNames.LOGIN })
}

const goToMain = () => {
  if (getIsLoadingLogin.value || getIsLoadingRegister.value) return
  router.push({ name: routerNames.MAIN })
}

const logout = async () => {
  await userStore.logout()
}
</script>

<template>
  <v-app-bar class="app-bar pr-4" :height="80" flat>
    <v-app-bar-title>
      <div class="logo" @click="goToMain">
        <div class="logo-icon">
          <v-img :src="logoImage" width="45" height="45" cover />
        </div>
        <div class="logo-text">
          <span class="logo-title">DEMIURGE</span>
          <div class="logo-divider">
            <span class="logo-subtitle">D&D</span>
          </div>
        </div>
      </div>
    </v-app-bar-title>
    <template #append v-if="getIsInitialized">
      <v-btn v-if="showMainButton()" class="form-btn px-3 mr-3" @click="goToMain">
        <v-icon left class="mr-3">home</v-icon>
        Главная
      </v-btn>
      <v-btn v-else-if="showProfileButton()" class="form-btn px-3 mr-3" @click="goToProfile">
        <v-icon left class="mr-3">person</v-icon>
        Профиль
      </v-btn>
      <v-btn v-if="showLoginButton()" class="form-btn px-3" @click="goToLogin">
        <v-icon left class="mr-3">login</v-icon>
        Войти
      </v-btn>
      <v-btn v-else-if="showLogoutButton()" class="form-btn px-3" variant="text" @click="logout">
        <v-icon left class="mr-3">logout</v-icon>
        Выйти
      </v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped lang="scss">
.app-bar {
  background: var(--gradient-bg-primary) !important;
  font-family: var(--font-primary), serif;
  position: relative;
  overflow: hidden;
  border-bottom: 3px solid var(--gold-accent);
}

.logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) 10px;
  border-radius: 0;
  background: var(--gradient-panel);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  max-width: 250px;

  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: 7px;
    background: linear-gradient(135deg, rgba(var(--gold-accent-rgb), 0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  &:hover {
    background: var(--gradient-panel-hover);
    border-color: var(--color-border-hover);
    box-shadow: var(--shadow-gold-glow);
  }
}

.logo-icon {
  position: relative;
  margin-right: 12px;

  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: rgba(var(--gold-accent-rgb), 0.1);
    filter: blur(8px);
    pointer-events: none;
  }
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-title {
  font-size: var(--font-size-title);
  font-weight: bold;
  color: var(--color-text-gold);
  text-shadow: var(--text-glow-gold);
  letter-spacing: var(--letter-spacing-wide);
}

.logo-divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-subtitle {
  font-size: var(--font-size-subtitle);
  color: var(--color-text-muted);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}
</style>
