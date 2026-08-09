<script setup lang="ts">
const emit = defineEmits<{
  close: [applied: boolean]
}>()

interface IProps {
  title?: string
  applyText?: string
  loading?: boolean
  maxWidth?: number
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Заголовок',
  applyText: 'Подтвердить',
  loading: false,
  maxWidth: 800,
})
</script>

<template>
  <v-dialog :model-value="true" opacity="0.8" persistent :max-width="props.maxWidth">
    <v-card class="default-card pa-3">
      <v-toolbar color="transparent" density="compact" class="mb-0 mt-3 px-3">
        <v-toolbar-title class="card-title mb-0 pr-3 align-self-start">
          {{ props.title }}
        </v-toolbar-title>
        <template #append>
          <v-btn
            icon="close"
            class="form-btn__icon align-self-start"
            :readonly="props.loading"
            @click="emit('close', false)"
          />
        </template>
      </v-toolbar>
      <v-divider class="mb-3"></v-divider>
      <v-form class="w-100" @submit.prevent="emit('close', true)">
        <v-row class="w-100 ga-1 form-container default-scrollbar mb-1 px-3">
          <slot />
        </v-row>
        <v-divider class="mb-3"></v-divider>
        <v-row no-gutters class="justify-end w-100">
          <v-btn class="form-btn px-3 mr-3" :loading="loading" type="submit">
            {{ props.applyText }}
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.form-container {
  overflow-y: auto;
  max-height: calc(100vh - 48px - 48px - 48px - 48px - 22px);
}
</style>
