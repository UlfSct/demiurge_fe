# RULES.md — правила кодовой базы «Демиург»

Документ фиксирует стиль и подходы, которые уже сложились в проекте, и превращает их в правила,
чтобы новый код не расходился с существующим. Правила выведены из фактического кода (49 SFC,
29 TS-модулей), конфигов линтеров и `tsconfig`, а не из абстрактных предпочтений.

- **Обязательно** — нарушение видно на ревью и должно быть исправлено.
- **Рекомендуется** — отклонение допустимо, если есть причина, и она объяснена в PR.
- Раздел 17 перечисляет места, где текущий код **не** является образцом: их не нужно копировать.

Связанные документы: [STRUCTURE.md](STRUCTURE.md) — устройство проекта и поток данных.

---

## 1. Базовые принципы

1. **Функциональный стиль.** Никаких классов, наследования и декораторов: данные — `ref`/`computed`,
   поведение — функции, переиспользование — композаблы и фабрики.
2. **Один слой — одна ответственность.** Компонент не знает URL и не вызывает `fetch`; стор не знает
   о разметке; `urls/` — только декларация эндпоинтов.
3. **Явные контракты.** Типы запросов/ответов описаны рядом с местом использования; ответ API всегда
   `RequestResponse<T>`, а не «сырой» `Response`.
4. **Состояние только для чтения снаружи.** Стор отдаёт `readonly`/`computed`-геттеры и именованные
   сеттеры; мутировать `ref` напрямую из компонента нельзя.
5. **Ошибки — данные, а не исключения на границе UI.** `sendRequest` возвращает результат-объект;
   исключения бросаются только внутри сторов и ловятся в диалогах/страницах.
6. **Тексты для пользователя — по-русски**, прямо в шаблонах (i18n в проекте нет).
7. **Никаких «магических» значений.** Цвета — из темы/токенов, размеры страницы — из
   `ITEMS_PER_PAGE_SELECTOR_ITEMS`, адреса — из `urls`, HTTP-методы — из `HTTP_METHODS`.

---

## 2. Инструменты и автоматика

### 2.1 Форматирование

Источник истины — Prettier + EditorConfig. Спорить о форматировании на ревью не нужно: запускайте
`npm run format`.

| Параметр | Значение |
| --- | --- |
| Точки с запятой | нет (`semi: false`) |
| Кавычки | одинарные (`singleQuote: true`) |
| Ширина строки | 100 |
| Отступ | 2 пробела, без табов |
| Запятые в конце | как в Prettier по умолчанию (`all`) |
| Перевод строки | LF, файл завершается переводом строки |
| Кодировка | UTF-8 |

Правила:

- **Обязательно**: не расставляйте точки с запятой «для надёжности» и не переформатируйте чужие
  блоки в своём PR — это создаёт шум в диффе.
- **Обязательно**: существующие имена CSS-классов (в том числе исторические вроде `.text--href`)
  не переименовывайте в рамках несвязанных задач.

### 2.2 Линтеры

Стек: **oxlint** (быстрые проверки корректности, `.oxlintrc.json`, категория `correctness = error`)
→ **ESLint** flat config (`eslint.config.ts`: `flat/essential` для Vue, `vueTsConfigs.recommended`,
vitest-правила для `src/**/__tests__/*`, `skipFormatting`) → **Prettier**.

Правила:

- **Обязательно**: `any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable` — запрещены. Сейчас в коде
  их **ноль**, это состояние нужно сохранять. Если тип неизвестен — используйте `unknown` и сужайте
  тип проверкой.
- **Обязательно**: не отключайте правила точечными комментариями; если правило мешает — обсуждается
  изменение конфига, а не подавление в файле.
- **Рекомендуется**: `console.*` допустим только в инфраструктурном слое (`utils/requests.ts`,
  стор пользователя) для диагностики; в компонентах — нет.
- **Обязательно**: `npm run lint` перед PR. Учтите: скрипты пока содержат путь `vue-project`
  (раздел 17), поэтому фактически запускайте `npx oxlint src --fix` и `npx eslint src --fix --cache`.
- **Обязательно**: не включайте обратно `vue/multi-word-component-names` — в `eslint.config.ts` оно
  отключено, потому что соглашение проекта требует `Page.vue` и доменных имён вроде `Worlds.vue`. Если
  правило нужно вернуть, сначала меняется соглашение (раздел 3.1), а не отдельные файлы.

### 2.3 TypeScript

`tsconfig.app.json` extends `@vue/tsconfig/tsconfig.dom.json` (строгий режим), включён
`noUncheckedIndexedAccess`, алиас `@/*` → `./src/*`.

Правила:

- **Обязательно**: не ослабляйте `tsconfig`-флаги и не добавляйте `skipLibCheck`-подобные обходы
  в приложении.
- **Обязательно**: обращение по индексу (`arr[i]`, `obj[key]`) считается `| undefined` — проверяйте
  или нормализуйте (`Number(...)`, `String(...)`, `?? ''`).
- **Обязательно**: `npm run type-check` (`vue-tsc --build`) должен проходить. Это часть `npm run build`.

### 2.4 Минимальный набор перед коммитом

```sh
npm run type-check
npm run test:unit
npm run format
npx oxlint src --fix && npx eslint src --fix --cache
npm run build
```

---

## 3. Именование

### 3.1 Файлы и каталоги

| Что | Правило | Пример |
| --- | --- | --- |
| Компонент | `PascalCase.vue`, имя = имя компонента | `WorldDeleteDialog.vue` |
| Страница маршрута | `Page.vue` в каталоге домена | `pages/worlds/list/Page.vue` |
| Контентная часть страницы | имя сущности/домена | `Worlds.vue`, `WorldDetail.vue` |
| Модальные окна | `modals/<Сущность><Действие>Dialog.vue` | `modals/WorldCreateDialog.vue` |
| Стор | `stores/<домен>/<сущность>.ts`, агрегатор — `index.ts` | `stores/core/user.ts` |
| Композабл | `composables/use<Thing>.ts` | `usePaginatedListData.ts` |
| Эндпоинты | `urls/<домен>.ts` + сборка в `urls/index.ts` | `urls/worlds.ts` |
| Общие типы | `types/<тема>.ts` | `types/requests.ts` |
| Утилита | `utils/<тема>.ts` | `utils/image.ts` |
| Ассеты | `assets/<домен>/<kebab-case>.<ext>` | `assets/main/worlds.png` |

Каталоги — `kebab-case`/строчные (`pages/worlds/detail/index`), компоненты — `PascalCase`.

### 3.2 Лексикон кода

| Префикс/имя | Смысл | Пример |
| --- | --- | --- |
| `getX` | только чтение (геттер стора, computed, локальный вычисляемый getter) | `getItems`, `getMaxPages` |
| `getIsX` | readonly-булево | `getIsAuthenticated`, `getIsLoadingLogin` |
| `isX` | булево вне пары get/set (локальное состояние, флаги) | `isInitialized`, `isFormData` |
| `setX` / `setXValue` | мутация состояния стора | `setPage`, `setIsLoadingLoginValue` |
| `isLoadingX` | флаг загрузки внутри стора | `isLoadingEditProfile` |
| `execute` | универсальный вызов API в сторе | `store.execute(data, params)` |
| `loadX` / `reloadX` | загрузка/перезагрузка данных | `loadProfile`, `reloadList` |
| `prepareRequestData` | форма → payload | `prepareRequestData()` |
| `prepareFormData` | ответ API → форма | `prepareFormData()` |
| `validateFormData` | локальная валидация | `validateFormData()` |
| `apply` | подтверждение в диалоге (submit) | `const apply = async () => {}` |
| `close` | закрытие диалога (эмит) | `close(needReload)` |
| `openXDialog` / `closeXDialog` | управление диалогом на странице | `openCreateDialog` |
| `onXHandler` | обработчик события UI | `onCloseHandler`, `onBackHandler` |

Правила:

- **Обязательно**: обработчики в `<template>` — `@click="apply"`, `@close="onCloseHandler"`;
  не пишите логику запроса прямо в разметке.
- **Обязательно**: имена обработчиков — глагол + объект (`goToDetail`, `changePageValue`), без `handle*`
  и `*Callback`.
- **Рекомендуется**: не сокращайте имена (`btn`, `dlg`, `res`, `e` допустимы только как параметры
  событий/итераций).

### 3.3 Типы

| Что | Правило | Пример |
| --- | --- | --- |
| Пропсы компонента | локальный `interface IProps` | `interface IProps { store: IPaginatedStore }` |
| Общий контракт компонента | `export interface I<Name>` из `<script setup>` | `IBaseResponseStore<T>`, `IMainRouterCard` |
| Доменная модель | `type` без префикса | `WorldsListItem`, `WorldDetail` |
| Входящие данные запроса | `type XxxRequestData` / `XxxRequestPayloadData` | `WorldsCreateRequestData` |
| Ответ API | `type XxxResponseData` | `LoginRequestResponseData` |
| Локальная модель формы | `type XxxFormData` рядом с использованием | `WorldCreateFormData` |
| Обёртки ответа | `interface ISuccessResponse` / `IErrorResponse` | `types/requests.ts` |
| Обобщённый параметр | одна буква `T`, при необходимости `TData` | `sendRequest<T>`, `createBaseActionStore<TData>` |

Правила:

- **Обязательно**: `interface` — только для контрактов (пропсы, ответы, публичные структуры);
  модели данных — `type`.
- **Обязательно**: тип пропсов называйте `IProps` и не экспортируйте, если он не нужен снаружи.
- **Обязательно**: все поля, которые могут отсутствовать, помечайте явно (`string | null`,
  `avatar: FileObject | null`) — `undefined` и `null` не смешивайте в одном поле без причины.
- **Обязательно**: для новых сущностей — `XxxRequestData`; вариант `XxxRequestPayloadData`
  встречается в `stores/core/user.ts` исторически, новые типы так не называйте.

### 3.4 CSS-классы

- **Обязательно**: kebab-case + БЭМ-подобные `__элемент` и `--модификатор`:
  `.card-title__subtitle`, `.card-title--no-margins`, `.form-btn__icon--s30`, `.default-title--ornament`.
- **Обязательно**: утилитарные/глобальные классы живут в `src/styles/index.scss`
  (`.default-card`, `.default-title`, `.card-title`, `.form-btn`, `.form-input`, `.text--href`,
  `.default-scrollbar`, `.main-bg`, `.user-avatar`), локальные — в `<style scoped>` компонента.
- **Обязательно**: размерные утилиты не пишите руками — они генерируются циклами:
  `max-width-<5..1000>`, `min-width-<10..1000>`, `font-size-<1..50>`, `w-<1..300>px`,
  `h-<1..200>px`, `ls-<1..10>px`.
- **Рекомендуется**: отступы и сетку делайте классами Vuetify (`pa-5`, `mt-2`, `ga-3`, `pl-1`),
  а не `margin`/`padding` в scoped-стилях.

---

## 4. Структура SFC

**Обязательно** для каждого `.vue`:

1. `<script setup lang="ts">` — всегда; Options API, `setup()`-функция и mixins запрещены.
2. `<template>`.
3. `<style scoped>` (для SCSS — `<style scoped lang="scss">`). Блок обязателен даже пустой —
   так оформлены все 49 SFC.

Порядок внутри `<script setup>`:

```vue
<script setup lang="ts">
// 1. Импорты: внешние библиотеки → @/ модули → import type
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import FormDialog from '@/components/core/FormDialog.vue'
import { useWorldsCreateStore, type WorldsCreateRequestData } from '@/stores/worlds'

// 2. Экспортируемые контракты (если есть)
export interface IMainRouterCard {
  title: string
}

// 3. Эмиты
const emit = defineEmits<{
  close: [needReload: boolean]
}>()

// 4. Пропсы
interface IProps {
  itemId: number
}
const props = defineProps<IProps>()

// 5. Стор/композаблы
const store = useWorldsCreateStore()
const { getLoading } = storeToRefs(store)

// 6. Локальное состояние
const formData = ref<WorldCreateFormData>({ name: '', caption: '', is_public: false })

// 7. Вычисляемые значения (get*)
const requestParams = computed(() => ({ id: props.itemId }))

// 8. Функции и обработчики
const close = (needReload: boolean): void => emit('close', needReload)

// 9. Хуки жизненного цикла
onMounted(() => {})
</script>
```

Порядок в `<template>` для страниц: корневой `<v-row no-gutters class="pa-5">` → заголовок
(`<slot name="title">`/`PageTitle`) → панель (`ListHeader`) → контент → `PaginationFooter`.
Диалоги монтируются **после** основного каркаса страницы.

Правила:

- **Обязательно**: сетка Vuetify — `<v-row no-gutters>`, если отступы не нужны; колонки —
  `cols="12" sm="6" xl="3"` для карточек.
- **Обязательно**: компоненты регистрируются явным импортом (глобальной регистрации нет), в шаблоне —
  kebab-case (`<world-create-dialog>`), в скрипте — `PascalCase`.
- **Обязательно**: `props` в скрипте читаются через `props.x` (или `toRefs(props)`), без
  деструктуризации, теряющей реактивность.
- **Рекомендуется**: локальные вычисления называйте `getX` и используйте `computed`, а не методы
  в шаблоне с побочными эффектами.

---

## 5. TypeScript в деталях

- **Обязательно**: пропсы — `defineProps<IProps>()`; значения по умолчанию —
  `withDefaults(defineProps<IProps>(), { loading: false, maxWidth: 800 })`, а не `props.x ?? default`
  в теле.
- **Обязательно**: эмиты — типизированные кортежи:
  ```ts
  const emit = defineEmits<{
    'update:modelValue': [value: string | null | undefined]
    input: []
    close: [applied: boolean]
  }>()
  ```
- **Обязательно**: кастомные поля работают как `v-model`: проп `modelValue` + эмит
  `update:modelValue`; дополнительно эмитится `input` без аргументов — для сброса ошибки поля
  родителем (так устроены `TextField`, `TextArea`, `TextFieldWithVisibility`).
- **Обязательно**: `as`-приведение — только на границе с внешним миром: `error as RequestErrorObject`,
  `e.target as HTMLInputElement`, `response.json() as T`. «Лечить» типы через `as` в бизнес-логике
  запрещено.
- **Обязательно**: значения из формы нормализуются при сборке запроса: `String(formData.value.name)`,
  `Number(route.params.id)`. В шаблон и в состояние пустое значение кладётся как `null`/`''`,
  а в payload уходит строка.
- **Обязательно**: брендированные типы (`ISODateString`) не «разбрендивайте» приведением; для вывода
  используйте `utils/date.ts` (`displayDate`, `displayDateWithTime`).
- **Обязательно**: возвращаемый тип функций-мутаций — `Promise<void>`, если результат не нужен.

---

## 6. Vue: подходы

- **Только Composition API** и `<script setup>`; `defineOptions`, `defineExpose`, `provide/inject`,
  mixins, `watchEffect` в проекте не используются — не вводите их без необходимости.
- **Реактивность**: `ref` для состояния (60+ использований), `shallowRef` — для больших списков
  (`usePaginatedListData`), `computed` — для производных значений.
- **Сторы в компоненте**: `const store = useXStore()`, затем `storeToRefs(store)` для чтения и
  прямые вызовы методов для действий:
  ```ts
  const store = useWorldsListStore()
  const { getItems, getLoading } = storeToRefs(store)
  // ...
  store.reloadList(false)
  ```
- **События компонента**: эмит `close(applied: boolean)` в UI-примитивах (`FormDialog`, `ApplyDialog`)
  и `close(needReload: boolean)` в доменных диалогах. Смысл булева флага — «данные изменились,
  перезагрузи список».
- **Слоты** — обычные (`<slot>`, `<slot name="btn">`), без `defineSlots`; имена слотов:
  `title`, `btn`, `btn-left`, `btn-right`, `append-inner`.
- **Жизненный цикл**: `onMounted` — для запуска загрузки; `onBeforeUnmount` — для освобождения
  ресурсов (лоадер в `InitializationLoading`); `watch` — только там, где нужна реакция на изменение
  (см. `App.vue`, `usePaginatedListData`).
- **Прямой DOM** — только в документированных исключениях: работа с `canvas`/`FileReader` при
  обработке изображений (`EditProfileAvatarDialog`, `utils/image.ts`) и оверлей аватара
  (`.avatar-overlay` в `Profile.vue`).
- **Отображение состояний**: `loading` → `LoadingBlock`/`:loading` у кнопки; `404` → текст «не
  существует или нет прав»; ошибка → `BaseResponseBlock`; пустой список — пустая сетка (без
  отдельного empty-state компонента).

---

## 7. Pinia: три типа сторов

Все сторы — setup-сторы. Создаются **фабриками** из `utils/store.ts`, а не пишутся руками (кроме
`stores/core/user.ts`):

| Фабрика | Назначение | API стора |
| --- | --- | --- |
| `createPaginatedResponseStore<T>` | постраничные списки | `getItems`, `getCount`, `getPage`, `getItemsPerPage`, `getLoading`, `getError`, `setPage`, `setItemsPerPage`, `setAdditionalQueryParam`, `deleteAdditionalQueryParam`, `reloadList`, `resetList`; опции `defaultParams`/`defaultQuery` |
| `createBaseResponseStore<T>` | детальная сущность | `getLoading`, `getData`, `isErrorResponse`, `isNotFoundResponse`, `execute(data, params?, query?)` |
| `createBaseActionStore<TData>` | мутации (create/update/delete) | `getLoading`, `execute(data?, params?, query?)` |

```ts
export const useWorldsCreateStore = createBaseActionStore<WorldsCreateRequestData>({
  storeId: 'worldsCreate',
  url: urls.WORLDS.CREATE,
})
```

Правила:

- **Обязательно**: `storeId` — уникальный camelCase (`worldsList`, `worldsDetail`, `worldsCreate`).
  Один `storeId` на один стор; копирование id — ошибка (см. раздел 17).
- **Обязательно**: состояние наружу — только `readonly(...)`; изменение — через именованные методы.
- **Обязательно**: внутри `execute` — защита от повторного вызова `if (loading.value) return`.
- **Обязательно**: политика ошибок зависит от фабрики:
  - `createBaseResponseStore` ошибку **не бросает**, а выставляет `statusCode` → `isErrorResponse` /
    `isNotFoundResponse` (контракт для `BaseResponseBlock`);
  - `createBaseActionStore` и `userStore` **бросают** `response.data` (объект ошибки бэкенда) — диалог
    ловит его и раскладывает по полям через `useFormErrors`.
- **Обязательно**: доменные типы (`XxxListItem`, `XxxDetail`, payload'ы) объявляются рядом со сторами
  домена (`stores/worlds/index.ts`), а не в `types/`.
- **Обязательно**: все вызовы API — с `executeWithMinDuration` (по умолчанию 500 мс), чтобы не
  «мигали» индикаторы; явное исключение — `login(data, noMinDuration)`.
- **Обязательно**: первичная загрузка списка не вызывается вручную из страницы — `usePaginatedListData`
  делает это через `watch(..., { immediate: true })`; при смене фильтров/страницы данные
  перезагружаются сами. Ручной `reloadList` — только как реакция на успешную мутацию.
- **Обязательно**: серверные фильтры списка — только через `setAdditionalQueryParam` /
  `deleteAdditionalQueryParam` (сброс страницы на первую встроен в композабл), а не через повторный
  `loadData` или локальную фильтрацию массива.
- **Обязательно**: `reloadList(true)` — после удаления (учёт последней страницы), `reloadList(false)` —
  после создания/правки.
- **Спецслучай `userStore`**: единственный «ручной» стор; отвечает за токены (`localStorage`:
  `token`, `refresh_token`), refresh каждые 10 минут, `initStore()` в `onMounted`. Новые auth-методы
  добавляются туда, а не в компоненты.

---

## 8. Слой API

### 8.1 Эндпоинты

- **Обязательно**: любой адрес — запись в `src/urls/<домен>.ts` вида
  `{ path, method, isFormData?, isEmptyResponse?, isAuthNotRequired? }`; в компонентах и сторах
  используются только ссылки `urls.X.Y`.
- **Обязательно**: `path` начинается со `/` и заканчивается `/`; параметры — `{id}`, `{file_id}`.
- **Обязательно**: `method` — из `HTTP_METHODS`, а не строкой.
- **Обязательно**: флаги:
  - `isAuthNotRequired: true` — только для login/register/refresh;
  - `isFormData: true` — для multipart (обновление профиля);
  - `isEmptyResponse: true` — если сервер отвечает `204` без тела.
- **Обязательно**: адреса группируются по префиксу пути: `/base/*` (аутентификация), `/user/*`
  (чтение), `/author/*` (правка автором), `/demiurge/*` (полные права), `/selectors/*` (справочники).
- **Обязательно**: повторяющиеся семейства путей описываются фабриками внутри `urls/<домен>.ts`
  (`getWorldChildrenUrls`, `getWorldBaseArticleUrls`, `getWorldBaseFileUrls`), а не копипастой.

### 8.2 Запросы

- **Обязательно**: `fetch` — только внутри `utils/requests.ts`. Компонент обращается к стору,
  стор — к `sendRequest`.
- **Обязательно**: `sendRequest<T>(urlEntry, data = {}, params = {}, query = {}, signal?)` возвращает
  `RequestResponse<T>` и **не бросает** исключений, кроме невозможности собрать URL. Ветки:
  success / HTTP-ошибка (`data` — словарь полей) / сеть (`statusCode: 0`, `_error`) / `AbortError`.
- **Обязательно**: заголовки и токен не собираются вручную — `Authorization: Bearer <token>`
  добавляется автоматически (`getDefaultAuthHeaders`).
- **Обязательно**: query-параметры — через аргумент `query` (`{ page, size, ... }`), массивы
  сериализуются повторяющимися ключами.
- **Обязательно**: тела запросов типизируются (`XxxRequestData`) и сериализуются в JSON, кроме
  `isFormData`-эндпоинтов.
- **Допустимое исключение**: бинарные файлы — `sendGetFileRequest(url) + blobToBase64`
  (загрузка аватара), т.к. это не JSON-эндпоинт.
- **Рекомендуется**: новые фабрики запросов добавлять в `utils/requests.ts`, а не в стор, чтобы
  сохранить единую точку сетевого слоя.

### 8.3 Формат ответа

- **Обязательно**: списки ожидаются в формате `PaginatedResponse<T>` (`results`, `count`, `next`,
  `previous`); страницы — `page`, размер — `size`.
- **Обязательно**: ошибки бэкенда — `RequestErrorObject` (`{ [field]: string | string[] }`); для
  «неизвестной» ошибки используется ключ `_error`.
- **Обязательно**: статус `401` на защищённом запросе обрабатывает auth-слой
  (`loadProfile` → `refreshAccessToken`), а не каждый стор отдельно.

---

## 9. Формы и диалоги

### 9.1 Эталонный сценарий

```ts
const formData = ref<WorldCreateFormData>({ name: '', caption: '', is_public: false })

const validateFormData = () => {
  if (!formData.value.name) setError('name', 'Это поле обязательно для заполнения')
}

const apply = async () => {
  clearErrors()
  validateFormData()
  if (hasErrors()) return
  try {
    await store.execute(prepareRequestData())
    close(true)
  } catch (error) {
    setErrors(error as RequestErrorObject)
  }
}
```

Правила:

- **Обязательно**: порядок `clearErrors()` → `validateFormData()` → `hasErrors()` → `try/catch` →
  `close(true)`; ошибка сервера раскладывается через `setErrors(error as RequestErrorObject)`.
- **Обязательно**: тексты локальной валидации — «Это поле обязательно для заполнения»,
  «Пароли не совпадают», «Новый пароль должен отличаться от предыдущего»; ключи ошибок совпадают
  с именами полей payload'а.
- **Обязательно**: привязка ошибки к полю — тройка атрибутов:
  ```vue
  :error="hasError('name')"
  :error-messages="getError('name')"
  @input="clearError('name')"
  ```
- **Обязательно**: серверные ошибки без ключа поля (`detail`, `id` и др.) показываются на ближайшем
  поле: `:error="hasError('password') || hasError('detail')"`, а `@input` чистит оба ключа
  (пример — вход в рабочее пространство).
- **Обязательно**: диалог монтируется через `v-if` (не `v-model`):
  `<world-create-dialog v-if="createDialogOpened" @close="closeCreateDialog" />`.
- **Обязательно**: `FormDialog`/`ApplyDialog` — `persistent`, всегда `:model-value="true"`,
  событие `close(applied: boolean)`.
- **Обязательно**: во время запроса поля `:readonly="loading"`, кнопка `:loading="loading"`;
  атрибут `disabled` не используется — только `readonly` (так во всём проекте).
- **Обязательно**: страница по `close(needReload)` решает, перезагружать ли список; диалог сам
  список не трогает.
- **Рекомендуется**: заголовки диалогов — по-русски, в форме отглагольного существительного
  («Создание мира», «Изменение мира», «Смена пароля», «Редактирование аватара»).

### 9.2 Профиль и файлы

- **Обязательно**: загрузка изображений — с проверкой MIME по `ALLOWED_FILE_MIME_TYPES`
  (JPEG/PNG/GIF) и проверкой пустого файла. Если кроп не нужен (аватар рабочего пространства), на
  бэкенд уходит **исходный файл**: без `resizeImage`, `canvas` и перекодирования — иначе теряется
  качество. Проверено: бэкенд сохраняет байты один-в-один (SHA-256 совпадает).
- **Обязательно**: превью выбранного файла — через `URL.createObjectURL`, а не base64 всего файла;
  ссылку освобождать при замене файла, удалении и в `onBeforeUnmount`.
- **Обязательно**: кроп (аватар профиля) — `vue-advanced-cropper`; это единственный случай, когда
  допустимо перекодирование (`resizeImage` + экспорт в JPEG), потому что пиксели вне области кропа
  всё равно отбрасываются.
- **Обязательно**: удаление файла — через сентинел `EMPTY_FILE_VALUE` (`'__clear__'`) в `FormData`,
  а не пустым `File`.
- **Обязательно**: multipart собирается в `prepareRequestData()` диалога.

---

## 10. Страницы и списки

- **Обязательно**: список строится на `ListPageTemplate` со стором, у которого есть `setPage`,
  `setItemsPerPage`, `getPage`, `getItemsPerPage`, `getCount`, `getLoading`.
- **Обязательно**: сетка карточек — `ItemCard` + `IconButton` в слоте `#btn`; кнопки
  показываются по правам (`item.is_author`, `item.is_demiurge`), а не всем подряд.
- **Обязательно**: переход в деталь — `router.push({ name: routerNames.WORLDS.DETAIL.INDEX, params })`.
- **Обязательно**: заголовок страницы — `PageTitle` (кнопка «Назад» + `@back`), для миров —
  `WorldsTitle` с автоматическими крошками; кнопка «Назад» обязательна на всех внутренних страницах.
- **Обязательно**: `selectedItemId` / `selectedItem` — один `ref` на страницу, сбрасывается в `null`
  при закрытии диалога.
- **Обязательно**: серверный фильтр — отдельная карточка в слоте `#title` рядом с заголовком
  (`Workspaces` → «Все / Мои / Доступные для входа»), значение уходит в query-параметр стора.
- **Обязательно**: поиск — только через `v-model:search` у `ListPageTemplate` (проброс в `ListHeader`,
  поле активно при `searchable`). Пока API не поддерживает `search`, фильтрация клиентская: страница
  при активном запросе грузит список одной страницей (`size = 500`), скрывает пагинацию
  (`:show-pagination="!isSearching"`) и показывает `BasicTextBlock` при пустом результате. Как только
  на бэкенде появится `search`, фильтрация переводится на `setAdditionalQueryParam('search', ...)`,
  а клиентская удаляется.
- **Обязательно**: номер страницы и размер приходят из `usePaginatedListData`, локальных дублей
  пагинации в странице нет.
- **Обязательно**: детальная страница — `BaseResponseBlock` над `createBaseResponseStore`, отдельная
  карточка с сущностью и отдельный блок участников. Управление показывается только при
  `my_role.value === 1`; владелец и текущий пользователь не редактируются и не удаляются.
- **Обязательно**: смена роли участника — `PATCH /workspace/admin/workspace/member/{id}/` с `{ role }`,
  удаление — `DELETE` того же адреса; после действия список участников перезагружается, ошибка
  показывается текстом (`getRequestErrorText`), а не молча.
- **Обязательно**: кнопка перехода в деталь на карточке списка — `IconButton icon="more_horiz"`,
  как на странице миров.
- **Рекомендуется**: новые разделы-заглушки делать через `UnderConstruction`, пока нет API
  и логики.

---

## 11. Стили и тема

- **Обязательно**: цвета — из темы Vuetify (имена: `gold-accent`, `brown-primary`, `text-light`,
  `border-focus`, `red-accent`) или CSS-переменных (`--gold-accent`, `--color-text-gold`,
  `--color-bg-primary`, `--gradient-gold`, `--shadow-card`). HEX допускается только в объявлении
  токенов — `plugins/vuetify.ts` и `styles/index.scss` (а также в конфиге JS-лоадера
  `InitializationLoading.vue`, где цвет дублирует `gold-accent`). В шаблонах — `color="gold-accent"`,
  не `#D4AF37`.
- **Обязательно**: типографика — `--font-primary` (Georgia), размеры — `--font-size-*`,
  межбуквенные интервалы — `--letter-spacing-*`; не задавайте шрифты точечно в компонентах.
- **Обязательно**: готовые классы вместо переизобретения: `.default-card` (карточка с золотой рамкой),
  `.card-title` (+`--centered`, `--underlined`, `--no-margins`, `--small`), `.default-title`,
  `.form-btn`, `.form-input`, `.text--href`, `.color--red`.
- **Обязательно**: скроллбары — класс `.default-scrollbar`.
- **Обязательно**: scoped-стили — только для локальной геометрии (`.main-container`, размеры кроппера,
  max-height контейнера формы). Всё переиспользуемое — в `styles/index.scss`.
- **Обязательно**: SCSS-вложенность — `&__element` / `&--modifier`, не глубже 3 уровней.
- **Обязательно**: фон приложения — `.main-bg` на контейнере `<v-main>`; отдельный фон страниц не
  добавляется.

---

## 12. Роутинг

- **Обязательно**: маршрут объявляется в `router/routes.ts`, имя — в дереве `router/names.ts`.
  Значения имён не пишутся руками: используется `String(routerNames.X.Y)`.
- **Обязательно**: `path` — строчные сегменты через дефис, параметры — `:id`; группы маршрутов
  собираются в локальные массивы (`worldsRoutes`, `charactersRoutes`, …) и разворачиваются в
  `APP_ROUTES`.
- **Обязательно**: компонент маршрута — страница из `pages/...`; вложенность маршрутов не
  используется (плоский список), вложенность UI задаётся компонентами.
- **Обязательно**: порядок ключей — `name`, `path`, `component`.
- **Обязательно**: параметр `id` — `Number(route.params.id)` и передаётся в `params` запроса.
- **Обязательно**: редиректы при смене auth-статуса — в `App.vue` (watch на `getIsInitialized` и
  `getIsAuthenticated`); route-guard'ов нет, новые защищённые маршруты автоматически получают
  только этот механизм.
- **Рекомендуется**: не добавлять `meta`-поля «на будущее» — сейчас они не читаются.

---

## 13. Тексты и ошибки

- **Обязательно**: весь пользовательский текст — на русском, без i18n-ключей; заголовки, кнопки,
  плейсхолдеры и сообщения пишутся прямо в шаблоне.
- **Обязательно**: сообщения об ошибках, пришедшие с бэкенда, показываются как есть (ключи словаря —
  имена полей формы); «Неизвестный формат ошибки», «Сетевая ошибка запроса», «Запрос был отменён»,
  «Не удалось обработать ответ сервера» — сообщения сетевого слоя, не дублируйте их в компонентах.
- **Обязательно**: для «не найдено» — «Мир не существует или у вас нет прав для его просмотра»
  (формулировка через «не существует / нет прав», без технических кодов).
- **Обязательно**: не показывайте пользователю `statusCode`, стек или текст исключения.
- **Обязательно**: общий текст ошибки (когда она не разложена по полям) достаётся через
  `getRequestErrorText(error)` из `utils/requests.ts` и показывается строкой; для 404 у детальной
  страницы текст переопределяется пропом `notFoundText` у `BaseResponseBlock`.
- **Рекомендуется**: заголовки кнопок — глагол в инфинитиве («Создать», «Удалить», «Подтвердить»,
  «Отмена»).
- **Обязательно**: комментарии — по-русски, только «почему», а не «что»; TODO —
  `// TODO: <что сделать>`.

---

## 14. Тесты

Каркас готов: `vitest` + `jsdom` + `@vue/test-utils`, конфиг `vitest.config.ts`, ESLint-правила
для vitest.

- **Обязательно**: тесты кладутся в `src/**/__tests__/*` (эта папка исключена из `tsconfig.app.json`
  и покрыта vitest-правилами линтера).
- **Обязательно**: чистая логика (`utils/requests.ts`, `composables/usePaginatedListData.ts`,
  `composables/useFormErrors.ts`, `utils/store.ts`) тестируется в первую очередь — она не требует
  монтирования компонентов.
- **Обязательно**: имена файлов — `<subject>.spec.ts`; describe — имя юнита, it — «что делает»
  по-русски.
- **Рекомендуется**: для компонентов — `mount` с подменённым `pinia` (`createTestingPinia` или
  `createPinia`) и стабом сетевого слоя, а не реальные запросы.
- **Обязательно**: `npm run test:unit` должен проходить до PR.

---

## 15. Git

- **Обязательно**: `node_modules/`, `dist/`, `coverage/`, `.env`, `*.tsbuildinfo`, `.eslintcache` —
  в `.gitignore`, в коммит не попадают.
- **Обязательно**: переводы строк — LF (`.gitattributes`: `* text=auto eol=lf`); не коммитьте
  CRLF-версии.
- **Обязательно**: не смешивайте в одном коммите форматирование, рефакторинг и фичу.
- **Рекомендуется**: ветки — `feat/...`, `fix/...`, `chore/...`; коммиты — Conventional Commits
  (`feat: добавлен список фракций`). История проекта пока состоит из одного коммита, формат
  фиксируется этим правилом.
- **Обязательно**: сообщение коммита отвечает на «что сделано», без «WIP» и «fix».

---

## 16. Документация

- **Обязательно**: при изменении структуры (новый слой, каталог, маршрут, фабрика) обновляйте
  `STRUCTURE.md` в том же PR.
- **Обязательно**: при изменении соглашений — `RULES.md`.
- **Рекомендуется**: не дублировать содержимое этого файла в README; README — только запуск проекта.

---

## 17. Что не копировать (известный долг)

Эти места существуют в коде, но образцом не являются. При правке рядом — исправляйте; новый код так
не пишите.

| Место | Проблема | Как правильно |
| --- | --- | --- |
| `package.json`: `name: "vue-project"`, скрипты `oxlint vue-project`, `eslint vue-project` | Остатки шаблона Vite: линтеры получают несуществующий путь | `name` — по проекту; `oxlint src`, `eslint src` (или `.`) |
| `stores/worlds/index.ts`: `useWorldsDemiurgeEditStore` с `storeId: 'worldsDelete'` | Два стора с одним id — состояние смешивается | Уникальный `storeId: 'worldsDemiurgeEdit'` |
| `CheckBoxField.vue`: эмитит `change`, а формы слушают `@input` | Ошибка чекбокса не сбрасывается при изменении | Эмитить `input` (как остальные поля) или слушать `@change` |
| `pages/worlds/list/Worlds.vue`, `detail/index/WorldDetail.vue`: `getItemImage()` | Всегда возвращает плейсхолдер, `item.images` игнорируется | Брать `item.images[0]?.file.url` с fallback на плейсхолдер |
| `styles/index.scss` | Класс `no-auth-bg` используется на 3 экранах, но не определён | Либо определить фон, либо убрать класс |
| `utils/cookie.ts`, `types/cookie.ts`, `stores/worlds/{factions,items,locations}.ts` | Мёртвый код без импортов | Удалить или подключить осознанно |
| `pages/worlds/detail/{authors,files,images,factions,items,locations}/Page.vue` | Пустые компоненты вместо заглушек | `UnderConstruction` до реализации |
| Бэкенд рабочих пространств | `PATCH /workspace/admin/workspace/{id}/` для собственных пространств отдаёт `404` (`my_role=None` в `workspace_admin/workspace.py`), `/user/workspace/{id}/` принимает только `GET` | Правка вызывается по admin-URL при `my_role.value === 1`, ошибка показывается в диалоге. Если фильтр на бэкенде поменяют — фронт заработает без изменений |
| Пароль пространства при правке | multipart не передаёт `null`, поэтому очистить пароль нельзя, только задать новый | Отдельный JSON-`PATCH` с `password: null`, если это понадобится |
| `material-icons` в зависимостях + Google Fonts в `index.html` | Два способа подключения иконок | Оставить один (package или CDN) |
| `let` для значений, которые не переприсваиваются (`let response = ...`) | Шум и лишняя мутабельность (~30 мест в `user.ts`, `requests.ts`, `router/utils.ts`) | `const`, если переменная не меняется |
| Отсутствие тестов | `vitest` настроен, тестов нет | Покрывать новую логику в `__tests__` |
| `noUncheckedIndexedAccess` + `ITEMS_PER_PAGE_SELECTOR_ITEMS[0]` | Требует нормализации | `Number(...)`/`?? 12`, как в `usePaginatedListData` |

---

## 18. Чек-лист ревью

- [ ] `<script setup lang="ts">` → `<template>` → `<style scoped>`; пустой style-блок на месте.
- [ ] Имена: `get*`/`set*`/`isLoading*`, `IProps`, `XxxRequestData`, `XxxListItem`, `*Dialog.vue`.
- [ ] Нет `any`, `@ts-ignore`, `eslint-disable`, прямых `fetch` в компонентах, HEX-цветов вне темы.
- [ ] Запросы — через стор и `sendRequest`; URL — только из `urls`.
- [ ] Ответ-список типизирован `PaginatedResponse<T>`, ошибки — `RequestErrorObject`.
- [ ] Форма: `clearErrors` → `validateFormData` → `try/catch` → `setErrors` → `close(needReload)`.
- [ ] Диалог монтируется через `v-if`, поля `:readonly="loading"`, кнопка `:loading`.
- [ ] Список: `reloadList(true)` после удаления, `false` — после создания/правки.
- [ ] Стор: `readonly`-состояние, уникальный `storeId`, защита от повторного `execute`.
- [ ] Тексты — по-русски; ошибки не содержат кодов и стеков.
- [ ] `npm run type-check`, `npm run test:unit`, линтеры, `npm run build` — зелёные.
- [ ] `STRUCTURE.md`/`RULES.md` обновлены, если менялись структура или соглашения.
