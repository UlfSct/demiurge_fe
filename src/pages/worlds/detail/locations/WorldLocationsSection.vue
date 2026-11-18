<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BasicTextBlock from '@/components/core/BasicTextBlock.vue'
import LoadingBlock from '@/components/core/LoadingBlock.vue'
import routerNames from '@/router/names.ts'
import LocationFormDialog from '@/pages/worlds/detail/locations/modals/LocationFormDialog.vue'
import { useWorldLocationsStore, type WorldLocationsListItem } from '@/stores/worlds/locations'
import { getLocationIconName } from '@/utils/locations.ts'

interface IProps {
  worldId: number
  canEdit?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  canEdit: false,
})

const LOCATIONS_PAGE_SIZE = 500

const router = useRouter()
const store = useWorldLocationsStore()
const { getLoading, getData, isErrorResponse } = storeToRefs(store)

const search = ref<string>('')
const collapsedIds = ref<number[]>([])

const query = computed(() => search.value.trim().toLowerCase())

const visibleLocations = computed(() => {
  return (getData.value?.results ?? []).filter((location) => {
    return location.is_visible || props.canEdit
  })
})

type LocationNode = WorldLocationsListItem & {
  children: LocationNode[]
}

const tree = computed<LocationNode[]>(() => {
  const nodes = new Map<number, LocationNode>()

  visibleLocations.value.forEach((location) => {
    nodes.set(location.id, { ...location, children: [] })
  })

  const roots: LocationNode[] = []

  nodes.forEach((node) => {
    const parent = node.parent ? nodes.get(node.parent.id) : undefined
    if (parent) parent.children.push(node)
    else roots.push(node)
  })

  const sortNodes = (items: LocationNode[]) => {
    items.sort((left, right) => left.name.localeCompare(right.name, 'ru'))
    items.forEach((item) => sortNodes(item.children))
  }

  sortNodes(roots)
  return roots
})

type LocationRow = {
  location: WorldLocationsListItem
  depth: number
  hasChildren: boolean
}

const matchesSearch = (location: WorldLocationsListItem): boolean => {
  if (!query.value) return true
  return [location.name, location.caption, location.location_type.text].some((value) => {
    return value.toLowerCase().includes(query.value)
  })
}

const rows = computed<LocationRow[]>(() => {
  if (query.value) {
    return visibleLocations.value
      .filter(matchesSearch)
      .slice()
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .map((location) => ({ location, depth: 0, hasChildren: false }))
  }

  const result: LocationRow[] = []

  const walk = (nodes: LocationNode[], depth: number) => {
    for (const node of nodes) {
      result.push({
        location: node,
        depth,
        hasChildren: node.children.length > 0,
      })

      if (!collapsedIds.value.includes(node.id)) {
        walk(node.children, depth + 1)
      }
    }
  }

  walk(tree.value, 0)
  return result
})

const countText = computed(() => {
  if (query.value) return `Найдено: ${rows.value.length}`
  return `Всего: ${visibleLocations.value.length}`
})

const emptyText = computed(() => {
  return query.value ? 'Ничего не найдено' : 'Мест пока нет'
})

const createDialogOpened = ref<boolean>(false)

const loadLocations = async (worldId: number = props.worldId): Promise<void> => {
  await store.execute({}, {}, { world: worldId, size: LOCATIONS_PAGE_SIZE })
}

watch(
  () => props.worldId,
  async (worldId) => {
    await loadLocations(worldId)

    if (props.worldId !== worldId) {
      await loadLocations(props.worldId)
    }
  },
  { immediate: true },
)

const closeCreateDialog = async (needReload: boolean): Promise<void> => {
  createDialogOpened.value = false
  if (needReload) await loadLocations()
}

const toggleNode = (id: number): void => {
  if (collapsedIds.value.includes(id)) {
    collapsedIds.value = collapsedIds.value.filter((value) => value !== id)
    return
  }

  collapsedIds.value = [...collapsedIds.value, id]
}

const getRowStyle = (depth: number) => {
  return {
    paddingLeft: `${depth * 20 + 8}px`,
  }
}

const openLocation = (id: number): void => {
  router.push({
    name: routerNames.WORLDS.DETAIL.LOCATION_DETAIL,
    params: {
      id: props.worldId,
      locationId: id,
    },
  })
}
</script>

<template>
  <v-card class="default-card pa-5 w-100">
    <v-row no-gutters class="align-center justify-space-between flex-wrap mb-3">
      <v-card-title class="card-title card-title--no-margins card-title--small">
        Места
      </v-card-title>
      <div class="d-flex align-center flex-wrap ga-2">
        <span class="card-title__subtitle">{{ countText }}</span>
        <v-btn v-if="props.canEdit" class="form-btn px-3" @click="createDialogOpened = true">
          Добавить место
        </v-btn>
      </div>
    </v-row>

    <v-text-field
      v-model="search"
      class="form-input max-width-300 mb-3"
      density="compact"
      placeholder="Поиск мест"
      prepend-inner-icon="search"
      hide-details
      clearable
      :readonly="getLoading"
    />

    <loading-block v-if="getLoading" />
    <basic-text-block v-else-if="isErrorResponse" text="Не удалось загрузить места" />
    <basic-text-block v-else-if="!rows.length" :text="emptyText" />
    <div v-else class="locations-list">
      <div
        v-for="row of rows"
        :key="`location_${row.location.id}`"
        class="location-row"
        :style="getRowStyle(row.depth)"
        @click="openLocation(row.location.id)"
      >
        <v-btn
          v-if="row.hasChildren && !query"
          variant="text"
          density="compact"
          size="24"
          class="location-row__toggle"
          @click.stop="toggleNode(row.location.id)"
        >
          <v-icon
            :icon="collapsedIds.includes(row.location.id) ? 'chevron_right' : 'expand_more'"
            size="20"
          />
        </v-btn>
        <span v-else class="location-row__spacer" />

        <v-icon
          :icon="getLocationIconName(row.location.location_type.value)"
          size="20"
          color="gold-accent"
          class="mr-2 flex-shrink-0"
        />
        <span class="location-row__name">{{ row.location.name }}</span>
        <span class="location-row__type">{{ row.location.location_type.text }}</span>
        <span v-if="!row.location.is_visible" class="location-row__hidden">скрыто</span>
        <v-icon icon="chevron_right" size="18" class="location-row__open ml-auto" />
      </div>
    </div>

    <location-form-dialog
      v-if="createDialogOpened && props.canEdit"
      :world-id="props.worldId"
      @close="closeCreateDialog"
    />
  </v-card>
</template>

<style scoped lang="scss">
.locations-list {
  border-top: 1px solid var(--color-border);
}

.location-row {
  display: flex;
  align-items: center;
  min-height: 42px;
  padding-top: var(--spacing-xs);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;

  &:hover {
    background: var(--gradient-panel);
    border-color: var(--color-border-hover);
  }
}

.location-row__toggle {
  color: var(--gold-dark) !important;
}

.location-row__spacer {
  width: 24px;
  flex-shrink: 0;
}

.location-row__name {
  color: var(--text-light);
  font-family: var(--font-primary), serif;
  font-size: 15px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-row__type {
  margin-left: var(--spacing-sm);
  color: var(--color-text-muted);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-row__hidden {
  margin-left: var(--spacing-sm);
  color: var(--red-accent);
  font-size: 11px;
  text-transform: uppercase;
}

.location-row__open {
  color: var(--gold-dark);
}

@media (max-width: 600px) {
  .location-row__type {
    display: none;
  }
}
</style>
