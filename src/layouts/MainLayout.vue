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

        <div class="q-gutter-lg" hidden>
          <q-btn unelevated rounded color="accent" label="铸造" padding="sm lg">
            <q-tooltip>铸造</q-tooltip>
          </q-btn>

          <q-btn outline round size="md" color="grey-7" icon="notifications">
            <q-badge rounded color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>通知</q-tooltip>
          </q-btn>

          <q-btn round flat>
            <q-menu
              anchor="bottom start"
              self="bottom start"
              :offset="[60, -50]"
            >
              <q-list class="text-grey-8" style="min-width: 160px">
                <q-item
                  v-for="menu in accountMenu"
                  :key="menu.text"
                  clickable
                  v-close-popup
                  aria-hidden="true"
                >
                  <q-item-section avatar>
                    <q-icon :name="menu.icon" />
                  </q-item-section>
                  <q-item-section>{{ menu.text }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-tooltip>用户</q-tooltip>
            <q-avatar>
              <img src="~assets/carket-logo.png" />
            </q-avatar>
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
        <q-btn
          unelevated
          rounded
          color="accent"
          label="登录"
          padding="sm lg"
          @click="toLoginPage()"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
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

      accountMenu: [
        { icon: "person", text: "主页" },
        { icon: "favorite", text: "收藏" },
        { icon: "library_books", text: "集合" },
        { icon: "settings", text: "设置" },
        { icon: "logout", text: "退出" },
      ],
    };
  },
  methods: {
    toLoginPage() {
      setTimeout(() => {
        this.$router.push({
          path: "/login",
        });
      }, 400);
    },
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
