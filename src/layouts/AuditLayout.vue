<template>
  <q-layout view="hHh Lpr fFf">
    <q-header class="header">
      <q-toolbar>
        <q-btn
          flat
          dense
          unelevated
          no-ripple
          class="no-shadow no-ripple"
          to="/audit"
        >
          <q-icon name="img:carket-logo.svg" size="40px" />
        </q-btn>

        <q-space />

        <div class="row" style="margin-right: 4px">
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
                  v-for="menu in adminMenu"
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
            <q-tooltip>管理员</q-tooltip>
            <q-avatar>
              <q-img class="placeholder" ratio="1" />
            </q-avatar>
          </q-btn>
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
  name: "AuditLayout",
  components: {},
  data() {
    return {
      isAdminLogin: localStorage.getItem("isAdminLogin"),
      adminMenu: [
        { icon: "settings", text: "设置" },
        { icon: "logout", text: "退出" },
      ],
    };
  },
  methods: {
    actions(action) {
      if (action == "设置") this.toSettings();
      else if (action == "退出") this.logout();
    },
    toSettings() {
      setTimeout(() => {
        this.$router.push({
          path: "/settings",
        });
      }, 500);
    },
    logout() {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("isAdminLogin");
      this.$router.push({
        path: "/login",
      });
      this.$q.notify({
        type: "info",
        position: "top",
        message: "已退出管理员账号",
        timeout: 1000,
      });
    },
    checkAndRefreshToken() {
      console.log("checkAndRefreshToken");
      if (localStorage.isAdminLogin === "true") {
        axios.put("/audit/session").then(
          (response) => {
            var newToken = response.data.newToken;
            // console.log("newAdminToken:  " + newToken);
            localStorage.adminToken = newToken;
          },
          (error) => {
            console.log(error);
            let status = error.response.status;
            if (status === 401 || status === 400) this.logout();
          }
        );
      }
    },
  },
  mounted: function () {
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
.header {
  background-color: rgba(255, 255, 255, 94%);
  padding: 10px 8px 10px;
}
</style>
