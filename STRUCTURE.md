# STRUCTURE.md — структура проекта «Демиург»

Документ описывает устройство фронтенд-приложения `demiurge_fe-main`: стек, слои, каталоги, маршруты,
поток данных и принятые соглашения. Состояние на момент описания — ветка `deepseek`
(базовый коммит `0fcc91b`).

---

## 1. Что это за проект

SPA-клиент портала **DEMIURGE (D&D)** — инструмента для ведения настольных ролевых кампаний:
миры, персонажи, рабочие пространства, игровые сессии. Приложение общается с отдельным REST API
(адрес задаётся переменной окружения `VITE_API_URL`), авторизация — JWT (access/refresh).

| Параметр | Значение |
| --- | --- |
| Тип | Одностраничное приложение (CSR), без SSR |
| Фреймворк | Vue 3 (`<script setup lang="ts">`, Composition API) |
| Сборка | Vite 8 |
| Роутинг | Vue Router 5 (`createWebHistory`) |
| Состояние | Pinia 4 (setup-сторы) |
| UI-кит | Vuetify 4 (кастомная «золото-коричневая» тема) |
| Язык | TypeScript 5.8, strict-настройки из `@vue/tsconfig` |
| Стили | SCSS + CSS-переменные, `sass-embedded` |
| Тесты | Vitest + jsdom (конфиг есть, тестов пока нет) |
| Линт/формат | oxlint + ESLint (flat config) + Prettier |
| Node | `^22.18.0 || >=24.12.0` |

Масштаб: 87 файлов в `src` (49 `.vue`, 29 `.ts`, 1 `.scss`, 8 изображений), ~4,7 тыс. строк
`.vue`/`.ts`.

---

## 2. Быстрый старт

```sh
npm install
# создать .env в корне проекта:
# VITE_API_URL=https://<адрес-api>
npm run dev          # vite dev-сервер
npm run build        # vue-tsc --build + vite build (параллельно)
npm run preview      # предпросмотр сборки
npm run test:unit    # vitest
npm run lint         # oxlint --fix, затем eslint --fix
npm run format       # prettier для src
```

Важно: `.env` в репозитории отсутствует и находится в `.gitignore`. Без `VITE_API_URL`
все запросы уйдут на строку `"undefined"` (см. `src/utils/consts.ts`), поэтому файл нужно создать
локально. Эталонного `.env.example` в проекте нет.

---

## 3. Дерево каталогов

```
demiurge_fe-main/
├─ index.html                 HTML-оболочка (#app, подключение Material Icons, тайтл «Демиург»)
├─ package.json               скрипты и зависимости, engines.node
├─ vite.config.ts             плагин Vue + алиас @ -> ./src
├─ vitest.config.ts           jsdom-окружение, наследует vite.config
├─ tsconfig.json              solution-style: ссылки на app/node/vitest
├─ tsconfig.app.json          настройки приложения, noUncheckedIndexedAccess, paths @/*
├─ tsconfig.node.json         настройки для vite/vitest конфигов
├─ tsconfig.vitest.json       настройки тестов
├─ env.d.ts                   /// <reference types="vite/client" />
├─ eslint.config.ts           flat config: vue + TS + vitest + oxlint + prettier
├─ .oxlintrc.json             быстрый линтер (категория correctness = error)
├─ .prettierrc.json           без точек с запятой, одинарные кавычки, printWidth 100
├─ .editorconfig, .gitattributes, .gitignore, README.md
├─ public/
│  └─ favicon.ico
└─ src/
   ├─ main.ts                 Точка входа: app + Vuetify + Pinia + Router
   ├─ App.vue                 Каркас: TopMenu, router-view, экран инициализации, редиректы
   ├─ assets/                 Изображения: логотип, фон, иконки, превью разделов, плейсхолдер
   ├─ components/
   │  ├─ core/                Каркасные и диалоговые компоненты
   │  ├─ lists/               Шаблон списка: заголовок, панель поиска/создания, пагинация
   │  ├─ ui/                  Атомарные элементы: blocks/, buttons/, fields/
   │  ├─ worlds/              Компоненты, специфичные для миров
   │  └─ workspaces/          Компоненты рабочих пространств (заголовок с крошками)
   ├─ composables/            Переиспользуемая логика (пагинация, ошибки форм)
   ├─ pages/                  Экран-уровень, по одному компоненту на маршрут
   ├─ plugins/vuetify.ts      Инициализация Vuetify: компоненты, директивы, иконки, тема
   ├─ router/                 Маршруты, имена, история, утилита генерации имён
   ├─ stores/                 Pinia: core/ (пользователь), worlds/, workspaces/
   ├─ styles/index.scss       Дизайн-токены, утилитарные классы, кастомный скроллбар
   ├─ types/                  Типы запросов, URL-дескрипторов, брендированные типы
   ├─ urls/                   Декларативное описание эндпоинтов API
   └─ utils/                  fetch-обёртка, фабрики сторов, константы, даты, изображения
```

---

## 4. Слои и их назначение

### 4.1 Точка входа и каркас

`src/main.ts` создаёт приложение и подключает плагины в порядке: `vuetify` → `createPinia()` → `router`,
затем монтирует в `#app`. Здесь же подключаются глобальные стили `@/styles/index.scss` и CSS
`vue-loading-overlay`.

`src/App.vue` — корневой каркас:

- `<top-menu>` (app-bar с логотипом, кнопками «Профиль/Главная/Войти/Выйти»);
- `<v-main class="main-container ... main-bg">` с фиксированной высотой `calc(100vh - 83px)`;
- пока `getIsInitialized === false` показывается `<initialization-loading>` (оверлей-лоадер),
  иначе `<router-view>`;
- два `watch` реализуют «мягкую» защиту маршрутов: после инициализации неавторизованного
  пользователя выкидывает на главную, а при смене статуса авторизации — тоже на главную.
  Отдельных навигационных guard'ов в роутере нет.

Инициализация пользователя запускается из стора (`onMounted` внутри `useUserStore`), т.е. при первом
обращении к стору в `App.vue`.

### 4.2 Роутинг (`src/router`)

| Файл | Роль |
| --- | --- |
| `index.ts` | `createRouter` + `createWebHistory(import.meta.env.BASE_URL)` |
| `routes.ts` | Массив `APP_ROUTES`, сгруппированный по доменам: `worldsRoutes`, `charactersRoutes`, `workspacesRoutes`, `partiesRoutes` |
| `names.ts` | Дерево констант имён маршрутов (значения `undefined` до вызова утилиты) |
| `utils.ts` | `completeRouterNames()` — рекурсивно превращает дерево в плоские строки |

Соглашение об именах: `completeRouterNames(routerNames, 'USER')` собирает имена вида
`USER|MAIN`, `USER|WORLDS|DETAIL|INDEX`. В `routes.ts` и в компонентах они используются как
`String(routerNames.WORLDS.LIST)`; по подстроке (`includes('WORLDS|DETAIL')`) строятся хлебные крошки
в `WorldsTitle.vue`.

### 4.3 Страницы (`src/pages`)

Каждый маршрут ссылается на «страницу» — компонент, который сам запрашивает данные через стор
и открывает модальные окна. Дерево:

```
pages/
├─ Main.vue                     выбор блока по авторизации
├─ main/
│  ├─ MainAuthenticatedBlock.vue   4 карточки-раздела (миры, персонажи, пространства, сессии)
│  ├─ MainNotAuthenticatedBlock.vue гостевая заглушка с кнопкой «Присоединиться»
│  └─ MainRouterCard.vue           карточка-ссылка
├─ user/
│  ├─ Login.vue / Registration.vue / Profile.vue
│  └─ modals/  ChangePasswordDialog, EditProfileDialog, EditProfileAvatarDialog
├─ worlds/
│  ├─ list/    Page.vue (список + диалоги), Worlds.vue (сетка карточек), modals/ (Create/Edit/Delete)
│  └─ detail/  index/ (Page.vue + WorldDetail.vue), authors|files|factions|images|items|locations/Page.vue
├─ characters/List.vue          «Раздел в разработке»
├─ workspaces/
│  ├─ list/    Page.vue (список + фильтр + диалоги), Workspaces.vue (сетка карточек), modals/ (Create/Join/Leave)
│  └─ detail/  Page.vue (карточка + участники), WorkspaceMembers.vue, modals/ (Edit, MemberDelete)
└─ parties/List.vue             «Раздел в разработке»
```

Паттерн list-страницы (`pages/worlds/list/Page.vue`, `pages/workspaces/list/Page.vue`):

1. берёт стор списка и `storeToRefs` от него;
2. держит локальные `ref` для диалогов и выбранного элемента;
3. рендерит `<list-page-template :store>` со слотами `title` (хлебные крошки, фильтры) и контентом (сетка);
4. диалоги монтируются через `v-if` и по событию `close(needReload)` вызывают `store.reloadList(...)`
   (для удаления — с `needLastItemDeletedCheck = true`, чтобы откатиться на предыдущую страницу).

В списке рабочих пространств фильтр «Все / Мои / Доступные для входа» управляет query-параметром
`my_workspaces` через `store.setAdditionalQueryParam` / `store.deleteAdditionalQueryParam`; параметр
сбрасывает страницу на первую и перезагружает список.

Поиск в рабочих пространствах клиентский: API не принимает `search`, поэтому при вводе запроса
страница грузит список одной страницей (`size = 500`), фильтрует его по названию и владельцу и
скрывает пагинацию (`:show-pagination="!isSearching"`). Поле живёт в `ListHeader` и управляется
через `v-model:search` → `update:search`; `searchable` включает его, иначе поле остаётся readonly
(так сейчас на странице миров).

Страница детали (`pages/worlds/detail/index/Page.vue`) вычисляет `requestParams` из `route.params.id`
и вызывает `store.execute({}, params)` в `onMounted`.

Детальная страница пространства (`pages/workspaces/detail/Page.vue`) устроена так: `BaseResponseBlock`
над `useWorkspacesDetailStore`, карточка с аватаром/владельцем/ролью, кнопка «Редактировать» при
`my_role.value === 1` (администратор), иначе «Войти» для не-участника. Участники грузятся отдельным
запросом `GET /user/workspace/member/?workspace=<id>&size=100` в `useWorkspaceMembersStore`
(`PaginatedResponse`), роли редактируются через `PATCH /workspace/admin/workspace/member/{id}/`,
участники удаляются через `DELETE` того же адреса; владельца и себя редактировать нельзя (UI скрывает
управление, бэкенд дополнительно запрещает владельца).

### 4.4 Компоненты (`src/components`)

| Каталог | Компонент | Назначение |
| --- | --- | --- |
| `core/` | `TopMenu.vue` | Верхняя панель: логотип, навигация, вход/выход |
| | `FormDialog.vue` | Универсальный модальный диалог с формой, кнопка «Подтвердить», событие `close(applied: boolean)` |
| | `ApplyDialog.vue` | Диалог подтверждения действия (удаление и т.п.) |
| | `BaseResponseBlock.vue` | Обёртка над стором детали: loading → текст ошибки → `404` → слот с данными; тексты `notFoundText`/`errorText` переопределяются |
| | `InitializationLoading.vue` | Полноэкранный лоадер первичной инициализации |
| | `LoadingBlock.vue` / `BasicTextBlock.vue` | Карточка «Идёт загрузка…» / произвольный текст в карточке |
| | `UnderConstruction.vue` | Заглушка «Раздел находится в разработке» |
| | `UserAvatar.vue` | Аватар с fallback-иконкой и слотом |
| `lists/` | `ListPageTemplate.vue` | Каркас списка: слот заголовка, `ListHeader`, контент или лоадер, `PaginationFooter`; пробрасывает поиск и умеет скрывать пагинацию (`showPagination`) |
| | `ListHeader.vue` | Поле поиска (`v-model:search`, активно при `searchable`) и кнопка «+» |
| | `PageTitle.vue` / `WorldsTitle.vue` | Заголовок с кнопкой «Назад» / плюс хлебные крошки «Главная → Миры → Мир» |
| | `PaginationFooter.vue` / `PaginationFooterPage.vue` | Номера страниц с многоточиями и выбор `size` |
| `ui/` | `blocks/ItemCard.vue` | Карточка: изображение 16:9, заголовок, подзаголовок, слот кнопок |
| | `buttons/IconButton.vue` | Квадратная иконочная кнопка в стиле `form-btn__icon` |
| | `fields/TextField.vue` | `v-text-field` с обязательным `*`, ошибками и слотом `append-inner` |
| | `fields/TextArea.vue` | Многострочное поле (`rows=3`, без ресайза) |
| | `fields/TextFieldWithVisibility.vue` | Пароль с переключателем видимости |
| | `fields/CheckBoxField.vue` | Чекбокс с обязательным `*` и ошибками |
| `worlds/` | `WorldsTitle.vue` | Заголовок миров + автоматические крошки по имени маршрута |
| `workspaces/` | `WorkspacesTitle.vue` | Заголовок пространств; на детали крошки «Главная → Рабочие пространства → <название>» |

Особенность полей: все они `v-model`-совместимы и дополнительно эмитят событие `input` (без значения),
чтобы родитель мог сбросить ошибку поля. Исключение — `CheckBoxField`: он эмитит `change`
(см. раздел 9).

### 4.5 Состояние (`src/stores`)

Все сторы — setup-сторы Pinia, возвращающие `readonly`-ссылки с префиксом `get*` и явные сеттеры.

**`stores/core/user.ts`** — единственный «ручной» стор, отвечает за весь auth-цикл:

- состояние: `token`, `refreshToken`, `profile`, `isAuthenticated`, `isInitialized`, пять флагов
  загрузки (login/register/editProfile/editProfileAvatar/changePassword);
- хранение токенов в `localStorage` под ключами `token` и `refresh_token`;
- методы: `login`, `register` (сразу логинит), `logout`, `updateProfile` (FormData), `changePassword`;
- `loadProfile()` → `GET /user/user/`; при `401` — `refreshAccessToken()` (`POST /base/token/refresh/`);
  при повторном `401` — очистка токенов и `isAuthenticated = false`;
- `setupRefreshTokenInterval()` — автообновление access-токена каждые 10 минут
  (`REFRESH_INTERVAL_TIMEOUT_MS`);
- `initStore()` вызывается в `onMounted` стора и завершает инициализацию приложения
  (`isInitialized = true`).

**`stores/worlds/index.ts`** — типы домена (`WorldsListItem`, `WorldDetail`, payload'ы create/edit)
и сторы, собранные фабриками:

| Стор | Фабрика | Эндпоинт |
| --- | --- | --- |
| `useWorldsListStore` | `createPaginatedResponseStore` | `GET /user/world/` |
| `useWorldsDetailStore` | `createBaseResponseStore` | `GET /user/world/{id}/` |
| `useWorldsCreateStore` | `createBaseActionStore` | `POST /user/world/` |
| `useWorldsAuthorEditStore` | `createBaseActionStore` | `PATCH /author/world/{id}/` |
| `useWorldsDeleteStore` | `createBaseActionStore` | `DELETE /demiurge/world/{id}/` |
| `useWorldsDemiurgeEditStore` | `createBaseActionStore` | `PATCH /demiurge/world/{id}/` |

**`stores/workspaces/index.ts`** — типы домена (`WorkspaceListItem`, `WorkspaceJoinRequestData`)
и сторы рабочих пространств:

| Стор | Фабрика | Эндпоинт |
| --- | --- | --- |
| `useWorkspacesListStore` | `createPaginatedResponseStore` | `GET /user/workspace/` |
| `useWorkspacesDetailStore` | `createBaseResponseStore` | `GET /user/workspace/{id}/` |
| `useWorkspacesCreateStore` | `createBaseActionStore<FormData>` | `POST /user/workspace/` (multipart) |
| `useWorkspacesEditStore` | `createBaseActionStore<FormData>` | `PATCH /workspace/admin/workspace/{id}/` (multipart) |
| `useWorkspacesJoinStore` | `createBaseActionStore` | `POST /user/workspace/join/` |
| `useWorkspacesLeaveStore` | `createBaseActionStore` | `POST /user/workspace/{id}/leave/` |
| `useWorkspaceMembersStore` | `createBaseResponseStore<PaginatedResponse<...>>` | `GET /user/workspace/member/` (`?workspace=<id>&size=100`) |
| `useWorkspaceMemberEditStore` | `createBaseActionStore` | `PATCH /workspace/admin/workspace/member/{id}/` |
| `useWorkspaceMemberDeleteStore` | `createBaseActionStore` | `DELETE /workspace/admin/workspace/member/{id}/` |
| `useWorkspaceRolesStore` | `createBaseResponseStore<NumberSelectorItem[]>` | `GET /selectors/workspace/role/` |

Фабрики живут в `utils/store.ts` и задают три типовых поведения:

- **paginated** — оборачивает `usePaginatedListData`, принимает `defaultParams`/`defaultQuery`,
  отдаёт `getItems/getCount/getPage/getItemsPerPage/getLoading/getError`, методы
  `setPage/setItemsPerPage/reloadList/resetList` и управление фильтрами
  `setAdditionalQueryParam/deleteAdditionalQueryParam`;
- **base response** — `getLoading/getData/isErrorResponse/isNotFoundResponse/execute`; `execute`
  защищён от повторного вызова, ошибки не пробрасывает, а лишь выставляет статус (для `BaseResponseBlock`);
- **base action** — `getLoading/execute`; ошибки пробрасываются наверх, чтобы диалог разложил их
  по полям формы.

`stores/worlds/{factions,items,locations}.ts` описывают типы и сторы для вложенных сущностей мира
(фракции, предметы, локации) — сейчас нигде не импортируются.

### 4.6 Композаблы (`src/composables`)

- **`usePaginatedListData<T>(url, defaultParams?, defaultQuery?, pageQueryKey='page',
  itemsPerPageQueryKey='size')`** — ядро постраничных списков: `shallowRef` с элементами, `page`,
  `itemsPerPage` (по умолчанию 12 из `ITEMS_PER_PAGE_SELECTOR_ITEMS`), `count`, `loading`, `error`;
  `watch` с `immediate: true` перезагружает данные при изменении параметров, страницы или размера
  страницы; сеттеры параметров сбрасывают страницу на первую (`withPageReset`); `reloadList(true)`
  умеет откатиться на предыдущую страницу после удаления последнего элемента.
- **`useFormErrors()`** — словарь ошибок `RequestErrorObject`: `getError/getErrors/setError/setErrors/
  clearError/clearErrors/hasError/hasErrors`. Ошибки бэкенда раскладываются прямо по именам полей.

### 4.7 Слой API (`src/urls`, `src/utils/requests.ts`, `src/types`)

Эндпоинты описаны декларативно, без вызовов:

```ts
{ path: '/user/world/{id}/', method: HTTP_METHODS.GET }
```

`UrlEntry` (в `types/urls.ts`) поддерживает флаги `isFormData`, `isEmptyResponse`, `isAuthNotRequired`.
Дерево эндпоинтов собирается в `urls/index.ts`: `BASE` (login/register/logout/token), `USER`
(профиль, смена пароля), `WORLDS` (миры, статьи, файлы, фракции/предметы/локации, правки автора и
демиурга), `WORKSPACES` (список, деталь, создание, редактирование, вход/выход, участники),
`SELECTORS` (справочники пользователей, типов локаций/предметов, ролей).
Часть путей генерируется фабриками внутри `urls/worlds.ts`
(`getWorldChildrenUrls`, `getWorldBaseArticleUrls`, `getWorldBaseFileUrls`).

`utils/requests.ts` — тонкая обёртка над `fetch`:

- `sendRequest<T>(urlEntry, data = {}, params = {}, query = {}, signal?)`:
  подставляет `{id}`-параметры в путь (при отсутствии параметра — `console.error` и `false`-путь),
  добавляет query-строку (массивы — повторяющиеся ключи), выбирает заголовки
  (`Content-Type: application/json` либо ничего для `FormData`), добавляет `Authorization: Bearer <token>`
  для защищённых эндпоинтов, сериализует тело (`JSON.stringify` / `FormData`);
- возвращает дискриминированный `RequestResponse<T>`: `{ isSuccess: true, statusCode, data }` либо
  `{ isSuccess: false, statusCode, data: RequestErrorObject }`; отдельно обрабатываются `AbortError`,
  сетевые ошибки (`statusCode: 0`) и невалидный JSON;
- вспомогательные: `sendGetFileRequest(url)` (загрузка файла в `Blob`), `blobToBase64`,
  `executeWithMinDuration(fn, minTime = 500)` — не даёт спиннерам «мигать» на быстрых ответах.

`types/` содержит: `RequestResponse`/`PaginatedResponse` (`results/next/previous/count`), `RequestParams`/
`RequestQuery`, `UrlEntry`, `FileObject`/`FileDetail`/`WorldArticle`/`SelectorItem`, брендированный
`ISODateString`, `EmptyObject`.

### 4.8 Стили и тема

- `plugins/vuetify.ts` — `createVuetify` со всеми компонентами и директивами, набор иконок `md`,
  тема `light` с палитрой: золото (`gold-accent #D4AF37`, `gold-light`, `gold-dark`), коричневые
  (`brown-primary #2C1810`, `brown-secondary #1E1109`, `brown-dark #1A0F0A`), текст `text-light #C4B5A5`,
  ошибки `#CC4444`, рамки `border-*` на основе золота с прозрачностью.
- `styles/index.scss` — те же цвета в CSS-переменных (`--gold-accent`, `--brown-*`), семантические
  алиасы (`--color-text-*`, `--color-bg-*`, `--color-border-*`), градиенты (`--gradient-gold`,
  `--gradient-card`, `--gradient-bg-primary`), тени/свечения, типографика (Georgia, `--font-size-*`,
  `--letter-spacing-*`), отступы и радиусы; утилитарные классы, сгенерированные циклами
  (`max-width-N`, `min-width-N`, `font-size-N`, `w-Npx`, `h-Npx`, `ls-Npx`);
  кастомный скроллбар `.default-scrollbar` с золотыми стрелками; готовые классы `.default-card`,
  `.default-title`, `.card-title`, `.form-btn`, `.form-input`, `.text--href`, `.main-bg`, `.user-avatar`.
- Иконки подключаются в `index.html` через Google Fonts (Material Icons), хотя пакет
  `material-icons` также присутствует в зависимостях.

### 4.9 Ассеты (`src/assets`)

`authBackground.jpg` (фон приложения, 1376×768), `logo.jpg` (1024×1024), четыре превью разделов
`main/*.png` (1376×768), `underConstructionIcon.svg`, общий плейсхолдер карточек
`listItemImagePlaceholder.svg` (используется мирами и рабочими пространствами).
Изображения импортируются как модули Vite и попадают в сборку (суммарно ~7 МБ исходников —
кандидат на оптимизацию).

---

## 5. Маршруты

| Путь | Имя (константа) | Компонент | Состояние |
| --- | --- | --- | --- |
| `/` | `MAIN` | `pages/Main.vue` | Готово |
| `/login` | `LOGIN` | `pages/user/Login.vue` | Готово |
| `/registration` | `REGISTRATION` | `pages/user/Registration.vue` | Готово |
| `/profile` | `PROFILE` | `pages/user/Profile.vue` | Готово |
| `/worlds` | `WORLDS.LIST` | `pages/worlds/list/Page.vue` | Готово (список, создание, правка, удаление) |
| `/worlds/:id` | `WORLDS.DETAIL.INDEX` | `pages/worlds/detail/index/Page.vue` | Готово (карточка мира) |
| `/worlds/:id/authors` | `WORLDS.DETAIL.AUTHORS` | `.../authors/Page.vue` | Пустой компонент (заглушка) |
| `/worlds/:id/images` | `WORLDS.DETAIL.IMAGES` | `.../images/Page.vue` | Пустой компонент |
| `/worlds/:id/files` | `WORLDS.DETAIL.FILES` | `.../files/Page.vue` | Пустой компонент |
| `/worlds/:id/factions` | `WORLDS.DETAIL.FACTIONS` | `.../factions/Page.vue` | Пустой компонент |
| `/worlds/:id/locations` | `WORLDS.DETAIL.LOCATIONS` | `.../locations/Page.vue` | Пустой компонент |
| `/worlds/:id/items` | `WORLDS.DETAIL.ITEMS` | `.../items/Page.vue` | Пустой компонент |
| `/characters` | `CHARACTERS.LIST` | `pages/characters/List.vue` | «В разработке» |
| `/workspaces` | `WORKSPACES.LIST` | `pages/workspaces/list/Page.vue` | Готово (список, фильтр, поиск, создание, вход/выход) |
| `/workspaces/:id` | `WORKSPACES.DETAIL` | `pages/workspaces/detail/Page.vue` | Готово (карточка, участники, роли, правка) |
| `/parties` | `PARTIES.LIST` | `pages/parties/List.vue` | «В разработке» |

Для `/:id`-маршрутов параметр не валидируется: `Number(route.params.id)` уходит в запрос как есть.

---

## 6. Поток данных

```
Компонент/страница
      │  вызов метода стора или чтение computed
      ▼
Pinia-стор (stores/*)  ──либо──  usePaginatedListData / useUserStore
      │  sendRequest(urlEntry, data, params, query)
      ▼
utils/requests.ts  ──►  urls/<домен>.ts (path + метод + флаги)
      │  fetch(API_URL + path + query)
      ▼
Ответ API
      │  RequestResponse<T> = success | error(RequestErrorObject)
      ▼
Стор обновляет ref'ы  ──►  компонент получает readonly get*-геттеры
                                 │
                                 ├─ ошибки формы → useFormErrors → :error-messages полей
                                 └─ ошибки детали → BaseResponseBlock (loading / 404 / error)
```

Особенности:

- все ответы списков ожидаются в формате `PaginatedResponse` (`results`, `count`);
- мутации всегда идут через `execute()` соответствующего стора, а не напрямую из компонента;
- минимальная длительность операции 500 мс — общий приём против «мигающих» индикаторов;
- параллельные запросы одного и того же стора блокируются флагом `loading`.

---

## 7. Авторизация

1. При старте `useUserStore` вызывает `initStore()`: `loadProfile()`; при наличии
   `refresh_token` в `localStorage` выполняется обновление access-токена.
2. Успех → `isAuthenticated = true`, `isInitialized = true`, запускается интервал обновления
   токена (10 минут).
3. `401` на профиле → попытка refresh; если refresh тоже `401` — токены удаляются, пользователь
   считается гостем.
4. `login()`/`register()` сохраняют пару токенов и сразу загружают профиль; `logout()` очищает
   интервал, отправляет `refresh` на сервер (best effort) и удаляет токены.
5. Редиректы при смене статуса — в `App.vue` (без route-guard'ов). Прямой заход на защищённый
   маршрут неавторизованным пользователем не блокируется — страница просто получит `401` от API.

---

## 8. Соглашения кода

- **SFC**: `<script setup lang="ts">` → `<template>` → `<style scoped>` (часто пустой `<style scoped>`;
  стили выносятся в `styles/index.scss`, если они общие).
- **Импорты** через алиас `@/...`, с явным расширением `.ts` у TypeScript-модулей и `.vue` у компонентов.
- **Имена**: геттеры сторов — `getX`, сеттеры — `setXValue`/`setX`, флаги — `isLoadingX`,
  типы запросов — `XxxRequestData`/`XxxResponseData`, доменные модели — `XxxListItem`/`XxxDetail`.
- **Readonly-состояние**: стор отдаёт `readonly(ref)`/`computed`, компонент читает через
  `storeToRefs(store)`.
- **Диалоги**: монтируются через `v-if`, эмитят `close(needReload: boolean)`, страница решает,
  перезагружать ли список.
- **Формы**: локальный `formData` → `validateFormData()` (заполняет `useFormErrors`) →
  `prepareRequestData()` → `store.execute()` → `setErrors(error)` в `catch` → `close(true)`.
- **UI**: Vuetify-компоненты + классы темы (`default-card`, `form-btn`, `form-input`, `card-title`,
  `text--href`); иконки — строками (`icon="edit"`, `icon="more_horiz"`).
- **Тексты интерфейса** — на русском, прямо в шаблонах (i18n отсутствует).

### Рецепт добавления новой сущности

1. Добавить эндпоинты в `src/urls/<домен>.ts` (path + method + флаги).
2. Описать типы `ListItem`/`Detail`/payload и создать сторы фабриками в `src/stores/<домен>/`.
3. Добавить маршруты в `router/routes.ts` и имена в `router/names.ts`.
4. Создать страницу-список на базе `ListPageTemplate` + сетку карточек (`ItemCard`) и диалоги
   (`FormDialog`/`ApplyDialog`).
5. Для детальной страницы — `createBaseResponseStore` + `BaseResponseBlock` + `WorldsTitle`-подобный
   заголовок.

---

## 9. Текущее состояние и известные пробелы

Разделы/модули, которые уже заведены, но ещё не доделаны или не подключены:

- **Заглушки**: `characters` и `parties` показывают `UnderConstruction`; все подстраницы
  мира, кроме `index` (authors/images/files/factions/locations/items), — пустые компоненты.
- **Изображения миров не используются**: `getItemImage()` в `Worlds.vue` и `WorldDetail.vue` всегда
  возвращает плейсхолдер, игнорируя `item.images`.
- **Неиспользуемые модули**: `utils/cookie.ts` + `types/cookie.ts`, `stores/worlds/factions.ts`,
  `stores/worlds/items.ts`, `stores/worlds/locations.ts` (сторы даже не экспортируются).
- **Дублирование `storeId`**: `useWorldsDemiurgeEditStore` создаётся с `storeId: 'worldsDelete'`,
  что конфликтует с `useWorldsDeleteStore` в одном Pinia-инстансе.
- **Рабочие пространства**: детальная страница, правка и управление участниками реализованы.
  Правка вызывается через `PATCH /workspace/admin/workspace/{id}/` (кнопка только при
  `my_role.value === 1`), но на локальном инстансе этот запрос для собственных пространств отвечает
  `404`: `get_queryset` в `workspace_admin/workspace.py` фильтрует `my_role=None`, то есть исключает
  пространства, где пользователь состоит; `/user/workspace/{id}/` принимает только `GET` (`405` на
  `PATCH`/`DELETE`). Участники работают: `GET /user/workspace/member/?workspace=<id>`,
  `PATCH`/`DELETE /workspace/admin/workspace/member/{id}/` (проверено — смена роли и удаление
  участника). Ограничения: пароль при правке можно задать/сменить, но не очистить (multipart не
  передаёт `null`); удаления пространства в UI нет; список участников грузится первыми 100 записями;
  после выхода владельца поле `owner` приходит `null`.
- **`CheckBoxField`** эмитит `change`, а формы подписываются на `@input` — ошибка чекбокса не
  сбрасывается при изменении.
- **Класс `no-auth-bg`** используется на экранах логина/регистрации/гостевой главной, но в
  `styles/index.scss` не определён (в отличие от `main-bg`).
- **Тестов нет**: `vitest` и `@vue/test-utils` настроены, но ни одного `*.spec.ts`/`*.test.ts`
  в проекте нет; e2e тоже отсутствует.
- **Нет `.env.example`** и валидации `VITE_API_URL`; локальный `.env` с `http://localhost:8000`
  создан, но в репозиторий не попадает (`.env` в `.gitignore`).
- **API не поддерживает поиск**: у `/user/workspace/` (и `/user/world/`) нет параметра `search`,
  поэтому поиск рабочих пространств фильтрует уже загруженные данные на клиенте: при активном запросе
  список грузится целиком (до 500 записей), пагинация скрывается. Когда на бэкенде появится `search`,
  фильтрацию нужно перевести на `setAdditionalQueryParam('search', ...)`, а клиентскую логику удалить.
  На странице миров поиск пока не включён (`searchable` не передаётся).
