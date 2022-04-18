<template>
  <q-layout view="hHh Lpr fFf" >
    <q-header style="background-color: white; padding: 10px 1em 10px">
      <q-toolbar>
        <q-btn
          flat
          dense
          unelevated
          no-ripple
          class="no-shadow no-ripple"
          to="/"
        >
          <q-icon name="img:carket-logo.svg" size="40px" />
        </q-btn>

        <q-input
          rounded
          outlined
          clearable
          dense
          type="Search"
          placeholder="搜索艺术品、用户"
          style="margin-left: 30px; width: 20%"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div
          class="GL__toolbar-link q-ml-sm q-gutter-xl text-heading text-weight-bold row items-center no-wrap"
        >
          <a href="javascript:void(0)" class="text-black"> 探索 </a>
          <a href="javascript:void(0)" class="text-black"> 排名 </a>
          <a href="javascript:void(0)" class="text-black"> 资源 </a>
          <a href="javascript:void(0)" class="text-black"> 铸造 </a>
        </div>

        <q-space />

        <div class="row">
          <div v-if="isAccountLogin === 'true'" class="q-gutter-lg">
            <q-btn
              unelevated
              rounded
              color="primary"
              label="铸造"
              padding="sm lg"
            >
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
                    @click="actions(menu.text)"
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
                <q-img class="placeholder" :src="me.avatarLink" ratio="1" />
              </q-avatar>
            </q-btn>

            <q-btn outline round size="md" color="grey-7" icon="wallet">
              <q-tooltip>钱包</q-tooltip>
            </q-btn>
          </div>
          <q-btn
            unelevated
            rounded
            color="primary"
            label="登录"
            padding="sm lg"
            v-else
            @click="toLoginPage()"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "MainLayout",
  components: {},
  data() {
    return {
      isAccountLogin: localStorage.getItem("isAccountLogin"),
      me: JSON.parse(localStorage.getItem("me")),
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
    actions(action) {
      if (action == "主页") this.toPersonPage();
      else if (action == "收藏") this.toFavorite();
      else if (action == "集合") this.toCollection();
      else if (action == "设置") this.toSettings();
      else if (action == "退出") this.logout();
    },
    toLoginPage() {
      setTimeout(() => {
        this.$router.push({
          path: "/login",
        });
      }, 400);
    },
    toPersonPage() {
      setTimeout(() => {
        this.$router.push({
          path: "/account",
        });
      }, 500);
    },
    toFavorite() {},
    toCollection() {
      console.log("collection");
    },
    toSettings() {
      console.log("setting");
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("isAccountLogin");
      this.$router.push({
        path: "/",
      });
      this.$router.go(0);
      this.$q.notify({
        type: "info",
        position: "top",
        message: "已退出当前账号",
        timeout: 1000,
      });
    },
    checkAndRefreshToken() {
      console.log("checkAndRefreshToken");
      if (localStorage.isAccountLogin === "true") {
        axios.put("/session").then(
          (response) => {
            var newToken = response.data.newToken;
            // console.log("newToken:  " + newToken);
            localStorage.token = newToken;
          },
          (error) => {
            console.log(error);
            let status = error.response.status;
            if (status === 401 || status === 400) logout();
          }
        );
      }
    },
  },
  mounted: function () {
    // console.log("MainLayout mounted");
    this.checkAndRefreshToken();
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

<style>
.placeholder {
  background-image: linear-gradient(135deg, #fff886 10%, #f072b6 100%);
}
</style>
