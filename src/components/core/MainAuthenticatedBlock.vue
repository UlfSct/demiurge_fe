<script setup lang="ts">
import routerNames from '@/router/names.ts'
import MainRouterCard, { type IMainRouterCard } from '@/components/core/MainRouterCard.vue'
import worlds from '@/assets/main/worlds.png'
import characters from '@/assets/main/characters.png'
import workspaces from '@/assets/main/workspaces.png'
import parties from '@/assets/main/parties.png'

const cards: IMainRouterCard[] = [
  {
    title: 'Миры',
    text: 'Погружайтесь в создание собственных вселенных. Здесь вы можете хранить и систематизировать справочники, географические карты, историю народов, пантеоны богов и ключевых NPC. Всё, что делает ваш мир уникальным, найдёт своё место здесь.',
    routeName: String(routerNames.WORlDS.LIST),
    image: worlds,
  },
  {
    title: 'Персонажи',
    text: 'Оживите своих героев! Создавайте персонажей с нуля или используйте готовые шаблоны. Настраивайте расы, классы, распределяйте характеристики, выбирайте заклинания и навыки. Ведите подробный журнал приключений и прокачки вашего героя.',
    routeName: String(routerNames.CHARACTERS.LIST),
    image: characters,
  },
  {
    title: 'Рабочие пространства',
    text: 'Ваш личный кабинет мастера. Создавайте рабочие пространства для разных кампаний, используйте готовые заготовки сценариев, планируйте сюжетные повороты и управляйте всей игровой механикой. Идеально для организации долгих и сложных кампаний.',
    routeName: String(routerNames.WORKSPACES.LIST),
    image: workspaces,
  },
  {
    title: 'Сессии',
    text: 'Собирайте команду и отправляйтесь в приключения! Проводите полноценные игровые сессии с автоматическими бросками кубиков, отслеживанием состояния персонажей и динамическими сценами. Наслаждайтесь живым D&D процессом вместе с друзьями.',
    routeName: String(routerNames.PARTIES.LIST),
    image: parties,
  },
]
</script>

<template>
  <v-row no-gutters class="py-5 px-3 justify-center align-items-stretch">
    <v-col
      v-for="(item, i) in cards"
      :key="`main-card-${i}`"
      cols="12"
      sm="6"
      xl="3"
      class="pb-4 px-2"
    >
      <main-router-card :item="item" />
    </v-col>
  </v-row>
</template>

<style scoped></style>
