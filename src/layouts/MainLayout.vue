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
          style="margin-left: 20px; width: 50%"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div
          class="GL__toolbar-link q-ml-sm q-gutter-xl text-heading text-weight-bold row items-center no-wrap"
        >
          <a href="javascript:void(0)" class="text-black"> 排名 </a>
          <a href="javascript:void(0)" class="text-black"> 溯源 </a>
        </div>

        <q-space />

        <div class="row" style="margin-right: 4px">
          <div v-if="isAccountLogin === 'true'" class="q-gutter-lg">
            <q-btn
              unelevated
              rounded
              color="primary"
              label="上传"
              padding="sm lg"
              to="/assets/create"
            >
              <q-tooltip>上传艺术品</q-tooltip>
            </q-btn>

            <!-- <q-btn outline round size="md" color="grey-7" icon="notifications">
              <q-badge rounded color="red" text-color="white" floating>
                2
              </q-badge>
              <q-tooltip>通知</q-tooltip>
            </q-btn> -->

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

            <q-btn
              outline
              round
              size="md"
              color="grey-7"
              icon="account_balance_wallet"
              @click="walletDrawer = !walletDrawer"
            >
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
            to="/login"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-drawer
        v-if="isAccountLogin === 'true'"
        side="right"
        v-model="walletDrawer"
        :width="340"
        overlay
        bordered
      >
        <div class="wallet-drawer">
          <q-btn flat round icon="close" @click="walletDrawer = false" />
          <div class="column">
            <div class="row items-center" style="margin-bottom: 20px">
              <div
                style="border-radius: 50%; border: 2px solid rgb(229, 232, 235)"
              >
                <q-avatar size="32px">
                  <q-img class="placeholder" :src="me.avatarLink" ratio="1" />
                </q-avatar>
              </div>
              <q-item-label class="wallet-name">{{ me.username }}</q-item-label>
              <q-space />
              <q-btn
                flat
                rounded
                dense
                class="wallet-address"
                size="md"
                @click="copy"
                :label="
                  me.address.substring(0, 6) +
                  '...' +
                  me.address.substring(38, 42)
                "
              >
                <q-tooltip size="xs">点击复制</q-tooltip>
              </q-btn>
            </div>
            <q-item-label class="wallet-item">钱包余额</q-item-label>
            <q-item-label class="balance">{{ balance }} VNT</q-item-label>
          </div>
          <q-btn flat label="充值" @click="charge" class="charge-btn" />
        </div>
      </q-drawer>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "src/utils/request.js";
import BalanceDialog from "components/dialog/BalanceDialog";
export default {
  name: "MainLayout",
  components: {},
  data() {
    return {
      isAccountLogin: localStorage.getItem("isAccountLogin"),
      me: JSON.parse(localStorage.getItem("me")),
      walletDrawer: false,
      balance: null,
      accountMenu: [
        { icon: "person", text: "主页" },
        // { icon: "favorite", text: "收藏" },
        // { icon: "library_books", text: "集合" },
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
    toPersonPage() {
      setTimeout(() => {
        this.$router.push({
          path: "/users/" + this.me.address,
        });
      }, 500);
    },
    toFavorite() {},
    toCollection() {
      console.log("collection");
    },
    toSettings() {
      setTimeout(() => {
        this.$router.push({
          path: "/settings",
        });
      }, 500);
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("isAccountLogin");
      localStorage.removeItem("me");
      this.$router.push({
        path: "/",
      });
      this.$router.go(0);
      // this.$q.notify({
      //   type: "info",
      //   position: "top",
      //   message: "已退出当前账号",
      //   timeout: 1000,
      // });
    },
    checkAndRefreshToken() {
      console.log("####checkAndRefreshToken####");
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
            if (status === 401 || status === 400) this.logout();
          }
        );
      }
    },
    copy() {
      if (navigator.clipboard) navigator.clipboard.writeText(this.me.address);
      this.$q.notify({
        type: "positive",
        position: "bottom-right",
        message: "地址已复制",
        timeout: 1500,
      });
    },
    charge() {
      let that = this;
      this.$q.dialog({
        component: BalanceDialog,
        parent: this,
        address: that.me.address,
        refresh: this.initBalance,
      });
    },
    initBalance() {
      axios.get("/accounts/me/balance").then(
        (response) => {
          // console.log(response);
          this.balance = response.data.balance;
        },
        (error) => {
          console.log(error);
          this.balance = 0;
        }
      );
    },
  },
  mounted: function () {
    // console.log("MainLayout mounted");
    this.checkAndRefreshToken();
  },
  created: function () {
    this.initBalance();
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

.wallet-drawer {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.wallet-name {
  margin-left: 8px;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 1px;
  color: rgb(4, 17, 29);
}

.wallet-address {
  padding: 0 12px;
  color: #6e6e6e;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.wallet-item {
  font-weight: 500;
  font-size: 14px;
  color: rgb(112, 122, 131);
  text-align: center;
}

.balance {
  font-weight: 600;
  font-size: 20px;
  color: rgb(4, 17, 29);
  line-height: 110%;
  text-align: center;
  margin-top: 8px;
}

.charge-btn {
  width: 100%;
  border-radius: 10px;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  background-color: rgb(32, 129, 226);
  color: rgb(255, 255, 255);
  margin-top: 16px;
}
</style>
