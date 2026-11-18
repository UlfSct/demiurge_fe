<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import FormDialog from '@/components/core/FormDialog.vue'
import TextField from '@/components/ui/fields/TextField.vue'
import TextArea from '@/components/ui/fields/TextArea.vue'
import CheckBoxField from '@/components/ui/fields/CheckBoxField.vue'
import { useFormErrors } from '@/composables/useFormErrors.ts'
import type { RequestErrorObject, RequestParams } from '@/types/requests.ts'
import {
  useLocationCreateStore,
  useLocationDetailStore,
  useLocationEditStore,
  useLocationTypesStore,
  useWorldLocationsStore,
  type LocationRequestData,
} from '@/stores/worlds/locations'
import { getRequestErrorText } from '@/utils/requests.ts'

const LOCATIONS_PAGE_SIZE = 500
const NO_PARENT_VALUE = 0

type LocationFormData = {
  name: string
  caption: string
  location_type: number | null
  parent: number
  is_visible: boolean
}

interface IProps {
  worldId: number
  itemId?: number
  parentId?: number
}

const props = defineProps<IProps>()

const emit = defineEmits<{
  close: [needReload: boolean]
}>()

const createStore = useLocationCreateStore()
const editStore = useLocationEditStore()
const detailStore = useLocationDetailStore()
const typesStore = useLocationTypesStore()
const locationsStore = useWorldLocationsStore()

const { getLoading: getCreateLoading } = storeToRefs(createStore)
const { getLoading: getEditLoading } = storeToRefs(editStore)
const { getLoading: getDetailLoading } = storeToRefs(detailStore)
const { getLoading: getTypesLoading } = storeToRefs(typesStore)
const { getLoading: getLocationsLoading } = storeToRefs(locationsStore)

const { clearErrors, clearError, getError, setError, setErrors, hasError, hasErrors } =
  useFormErrors()

const formData = ref<LocationFormData>({
  name: '',
  caption: '',
  location_type: null,
  parent: props.parentId ?? NO_PARENT_VALUE,
  is_visible: true,
})

const detailError = ref<string>('')

const isEditing = computed(() => Boolean(props.itemId))
const loading = computed(() => {
  return (
    getCreateLoading.value ||
    getEditLoading.value ||
    getDetailLoading.value ||
    getTypesLoading.value ||
    getLocationsLoading.value
  )
})
const submitText = computed(() => (isEditing.value ? 'Сохранить' : 'Создать'))

const typeOptions = computed(() => typesStore.getData ?? [])

const excludedIds = computed(() => {
  const result = new Set<number>()
  if (!props.itemId) return result

  result.add(props.itemId)

  const locations = locationsStore.getData?.results ?? []
  let hasChanges = true

  while (hasChanges) {
    hasChanges = false
    for (const location of locations) {
      if (location.parent && result.has(location.parent.id) && !result.has(location.id)) {
        result.add(location.id)
        hasChanges = true
      }
    }
  }

  return result
})

const parentOptions = computed(() => {
  const options = (locationsStore.getData?.results ?? [])
    .filter((location) => !excludedIds.value.has(location.id))
    .map((location) => ({ title: location.name, value: location.id }))

  return [{ title: 'Без родителя', value: NO_PARENT_VALUE }, ...options]
})

const close = (needReload: boolean): void => {
  emit('close', needReload)
}

const fillFormData = () => {
  const detail = detailStore.getData
  if (!detail || detail.id !== props.itemId) return

  formData.value = {
    name: detail.name,
    caption: detail.caption,
    location_type: detail.location_type.value,
    parent: detail.parent?.id ?? NO_PARENT_VALUE,
    is_visible: detail.is_visible,
  }
}

const validateFormData = () => {
  if (!formData.value.name.trim()) setError('name', 'Это поле обязательно для заполнения')
  if (!formData.value.caption.trim()) setError('caption', 'Это поле обязательно для заполнения')
  if (formData.value.location_type === null) {
    setError('location_type', 'Это поле обязательно для заполнения')
  }
}

const prepareRequestData = (): LocationRequestData => {
  return {
    name: formData.value.name.trim(),
    caption: formData.value.caption.trim(),
    location_type: Number(formData.value.location_type),
    parent: formData.value.parent === NO_PARENT_VALUE ? null : formData.value.parent,
    is_visible: formData.value.is_visible,
    world: props.worldId,
  }
}

const loadOptions = async (): Promise<void> => {
  await Promise.all([
    typesStore.execute({}),
    locationsStore.execute({}, {}, { world: props.worldId, size: LOCATIONS_PAGE_SIZE }),
  ])
}

const loadDetail = async (): Promise<void> => {
  if (!props.itemId) return
  await detailStore.execute({}, { id: props.itemId })
  fillFormData()
}

const apply = async () => {
  if (loading.value) return

  clearErrors()
  detailError.value = ''
  validateFormData()
  if (hasErrors()) return

  const store = isEditing.value ? editStore : createStore
  const params: RequestParams = props.itemId ? { id: props.itemId } : {}

  try {
    await store.execute(prepareRequestData(), params)
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

onMounted(async () => {
  await loadOptions()
  await loadDetail()
})
</script>

<template>
  <form-dialog
    :title="isEditing ? 'Изменение места' : 'Создание места'"
    :apply-text="submitText"
    :max-width="700"
    :loading="loading"
    @close="onCloseHandler"
  >
    <text-field
      v-model="formData.name"
      label="Название"
      :required="true"
      :readonly="loading"
      :error="hasError('name')"
      :error-messages="getError('name')"
      @input="clearError('name')"
    />
    <text-area
      v-model="formData.caption"
      label="Описание"
      :required="true"
      :readonly="loading"
      :error="hasError('caption')"
      :error-messages="getError('caption')"
      @input="clearError('caption')"
    />
    <v-select
      v-model="formData.location_type"
      :items="typeOptions"
      item-title="text"
      item-value="value"
      label="Тип места"
      density="comfortable"
      variant="solo"
      class="form-input mb-1 w-100"
      :readonly="loading"
      :error="hasError('location_type')"
      :error-messages="getError('location_type')"
      @update:model-value="clearError('location_type')"
    />
    <v-select
      v-model="formData.parent"
      :items="parentOptions"
      item-title="title"
      item-value="value"
      label="Родительское место"
      density="comfortable"
      variant="solo"
      class="form-input mb-1 w-100"
      :readonly="loading"
      :error="hasError('parent')"
      :error-messages="getError('parent')"
      @update:model-value="clearError('parent')"
    />
    <check-box-field
      v-model="formData.is_visible"
      label="Место видно читателям"
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
