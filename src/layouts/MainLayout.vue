<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="background-color: white; padding: 10px 1em 10px">
      <q-toolbar>
        <q-img
          src="~assets/carket-logo.svg"
          style="width: 40px; height: 40px"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <!--用btn，不用img
        <q-btn
          flat
          round
          dense
          icon="message"
          size="lg"
          color="primary"
        /> -->

        <q-input
          rounded
          outlined
          clearable
          dense
          type="Search"
          style="margin-left: 30px; width: 20%"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div
          v-if="$q.screen.gt.sm"
          class="GL__toolbar-link q-ml-sm q-gutter-xl text-heading text-weight-bold row items-center no-wrap"
        >
          <a href="javascript:void(0)" class="text-black"> 探索 </a>
          <a href="javascript:void(0)" class="text-black"> 排名 </a>
          <a href="javascript:void(0)" class="text-black"> 资源 </a>
          <a href="javascript:void(0)" class="text-black"> 铸造 </a>
        </div>

        <q-space />
        <div class="q-gutter-lg">
          <q-btn outline round size="md" color="grey-7" icon="message">
            <q-tooltip>通知</q-tooltip>
          </q-btn>

          <q-btn unelevated rounded color="accent" label="铸造" padding="sm lg">
            <q-tooltip>铸造</q-tooltip>
          </q-btn>

          <q-btn round flat>
            <q-avatar>
              <img src="~assets/carket-logo.png" />
            </q-avatar>
            <q-tooltip>用户</q-tooltip>
          </q-btn>

          <q-btn
            outline
            round
            size="md"
            color="grey-7"
            icon="wallet"
            @click="leftDrawerOpen = !leftDrawerOpen"
          >
            <q-tooltip>钱包</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container style="padding: 0 1em 0; margin: 100px 0 100px">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksData = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

export default {
  name: "MainLayout",
  components: {
    EssentialLink,
  },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
    };
  },
};
</script>

<style lang="sass">
.GL
  &__toolbar-link
    a
      color: white
      text-decoration: none
      &:hover
        opacity: 0.7
</style>
