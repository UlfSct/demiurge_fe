<script setup lang="ts">
import { computed, ref } from 'vue'
import FormDialog from '@/components/core/FormDialog.vue'
import TextField from '@/components/ui/fields/TextField.vue'
import TextArea from '@/components/ui/fields/TextArea.vue'
import CheckBoxField from '@/components/ui/fields/CheckBoxField.vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import type { WorldsArticleRequestData } from '@/stores/worlds'
import type { RequestErrorObject } from '@/types/requests.ts'
import type { WorldArticle } from '@/types/utils.ts'
import type { ActionStore } from '@/utils/store.ts'
import { getRequestErrorText } from '@/utils/requests.ts'

type ArticleFormData = {
  title: string
  article_text: string
  is_visible: boolean
}

interface IProps {
  article: WorldArticle | null
  createStore: ActionStore<WorldsArticleRequestData>
  editStore: ActionStore<WorldsArticleRequestData>
  params: Record<string, number>
}

const props = defineProps<IProps>()

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()

const formData = ref<ArticleFormData>({
  title: props.article?.title ?? '',
  article_text: props.article?.article_text ?? '',
  is_visible: props.article?.is_visible ?? true,
})

const detailError = ref<string>('')

const isEditing = computed(() => Boolean(props.article))
const loading = computed(() => {
  return isEditing.value ? props.editStore.getLoading : props.createStore.getLoading
})
const submitText = computed(() => (isEditing.value ? 'Сохранить' : 'Создать'))

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const validateFormData = () => {
  if (!formData.value.title.trim()) setError('title', 'Это поле обязательно для заполнения')
  if (!formData.value.article_text.trim()) {
    setError('article_text', 'Это поле обязательно для заполнения')
  }
}

const prepareRequestData = (): WorldsArticleRequestData => {
  return {
    title: formData.value.title.trim(),
    article_text: formData.value.article_text,
    is_visible: formData.value.is_visible,
  }
}

const apply = async () => {
  if (loading.value) return

  clearErrors()
  detailError.value = ''
  validateFormData()
  if (hasErrors()) return

  const store = isEditing.value ? props.editStore : props.createStore

  try {
    await store.execute(prepareRequestData(), props.params)
    close(true)
  } catch (error) {
    setErrors(error as RequestErrorObject)
    detailError.value = getRequestErrorText(error)
  }
}

const onCloseHandler = (applied: boolean): void => {
  if (applied) apply()
  else close(false)
}
</script>

<template>
  <form-dialog
    :title="isEditing ? 'Редактирование статьи' : 'Добавление статьи'"
    :apply-text="submitText"
    :max-width="900"
    :loading="loading"
    @close="onCloseHandler"
  >
    <text-field
      v-model="formData.title"
      label="Заголовок статьи"
      :required="true"
      :readonly="loading"
      :error="hasError('title')"
      :error-messages="getError('title')"
      @input="clearError('title')"
    />
    <text-area
      v-model="formData.article_text"
      label="Текст статьи (Markdown)"
      :required="true"
      :rows="14"
      :readonly="loading"
      :error="hasError('article_text')"
      :error-messages="getError('article_text')"
      @input="clearError('article_text')"
    />
    <p class="card-title__subtitle w-100 px-3">
      Поддерживается Markdown: заголовки, списки, таблицы, цитаты, код и ссылки.
    </p>
    <check-box-field
      v-model="formData.is_visible"
      label="Статья видна читателям"
      :readonly="loading"
      :error="hasError('is_visible')"
      :error-messages="getError('is_visible')"
      @change="clearError('is_visible')"
    />
    <v-row v-if="detailError" no-gutters class="w-100 px-3">
      <span class="color--red text-body-1">{{ detailError }}</span>
    </v-row>
  </form-dialog>
</template>

<style scoped></style>
