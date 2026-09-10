<script setup lang="ts">
import { useRouter } from 'vue-router'
import routerNames from '@/router/names.ts'

const router = useRouter()

const goToRegistration = () => {
  router.push({ name: routerNames.REGISTRATION })
}
</script>

<template>
  <v-row no-gutters class="fill-height justify-center text-center align-content-center no-auth-bg">
    <v-col class="justify-items-center">
      <v-container class="welcome-content">
        <div class="ornament ornament-top mb-8">
          <div class="line"></div>
          <v-icon class="diamond" size="20">diamond</v-icon>
          <div class="line"></div>
        </div>
        <h1 class="welcome-title text-h2 font-weight-bold mb-4">DEMIURGE</h1>
        <div class="subtitle-divider mb-6">
          <v-divider class="divider-line-left" thickness="1" />
          <span class="divider-text text-uppercase px-4">D&D</span>
          <v-divider class="divider-line-right" thickness="1" />
        </div>
        <p class="welcome-text text-h5">Твоя вселенная ждёт творца.</p>
        <v-btn @click="goToRegistration" class="form-btn px-12 py-6" size="x-large">
          Присоединиться
        </v-btn>
        <div class="ornament ornament-bottom mt-10">
          <div class="line"></div>
          <v-icon class="diamond" size="20">diamond</v-icon>
          <div class="line"></div>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.welcome-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
}

.welcome-title {
  font-family: var(--font-primary), serif;
  font-size: 64px !important;
  color: var(--color-text-gold);
  text-shadow:
    0 0 20px rgba(var(--gold-accent-rgb), 0.6),
    0 0 40px rgba(var(--gold-accent-rgb), 0.3),
    0 4px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 8px;
  line-height: 1.2;

  @media (max-width: 600px) {
    font-size: 50px !important;
  }

  @media (max-width: 450px) {
    font-size: 40px !important;
  }
}

.subtitle-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.divider-line-left,
.divider-line-right {
  flex: 1;
  background: linear-gradient(90deg, transparent, var(--color-border-focus), transparent);
}

.divider-line-left {
  background: linear-gradient(90deg, transparent, var(--color-border-focus));
}

.divider-line-right {
  background: linear-gradient(90deg, var(--color-border-focus), transparent);
}

.divider-text {
  font-family: var(--font-primary), serif;
  font-size: 18px;
  color: var(--color-border-focus);
  letter-spacing: var(--letter-spacing-wide);
}

.welcome-text {
  font-family: var(--font-primary), serif;
  font-size: 25px !important;
  color: var(--color-text-gold);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: var(--letter-spacing-tight);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 30px auto;

  @media (max-width: 600px) {
    font-size: 20px !important;
  }

  @media (max-width: 450px) {
    font-size: 17px !important;
  }
}

.ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-hover), transparent);
}

.diamond {
  color: var(--color-border-focus) !important;
  filter: drop-shadow(0 0 10px rgba(var(--gold-accent-rgb), 0.4));
}
</style>
