<script setup lang="ts">
import underConstructionIcon from '@/assets/underConstructionIcon.svg'
</script>

<template>
  <v-row no-gutters class="pa-5 justify-center">
    <v-card class="default-card py-8 px-16">
      <v-row no-gutters class="justify-center mb-4">
        <v-img :src="underConstructionIcon" width="200" height="200" />
      </v-row>
      <v-card-title class="card-title card-title--no-margins text-center">
        Раздел находится в разработке
      </v-card-title>
    </v-card>
  </v-row>
</template>

<style scoped></style>
