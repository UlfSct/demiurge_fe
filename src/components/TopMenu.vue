<script setup lang="ts">
import logoImage from '@/assets/logo.jpg'
import { useUserStore } from '@/stores/user.ts'

const userStore = useUserStore()
</script>

<template>
  <v-app-bar class="app-bar pr-5 pl-2" :height="80">
    <v-app-bar-title>
      <div class="logo">
        <v-img :src="logoImage" width="45" height="45" class="mr-2" />
        <div class="logo-text">
          <span class="logo-title">DEMIURGE</span>
          <span class="logo-subtitle">D&D</span>
        </div>
      </div>
    </v-app-bar-title>

    <template #append>
      <v-btn
        class="login-btn text-uppercase px-3"
        variant="outlined"
        prepend-icon="person"
        color="#d4af37"
      >
        Войти
      </v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped>
.app-bar {
  background: linear-gradient(180deg, #1a0f0a 0%, #2c1810 50%, #1a0f0a 100%) !important;
  border-bottom: 3px solid #d4af37;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.logo {
  display: flex;
  max-width: fit-content;
  align-items: center;
  padding: 5px 15px;
  border-radius: 12px;
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.logo-title {
  font-size: 22px;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  letter-spacing: 3px;
}

.logo-subtitle {
  font-size: 14px;
  color: #8b7355;
  letter-spacing: 2px;
}

.login-btn {
  font-family: 'Georgia', serif !important;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: rgba(212, 175, 55, 0.05) !important;
}
</style>
