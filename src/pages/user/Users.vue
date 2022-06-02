<template>
  <q-page align="center" class="page text-align">
    <q-card class="no-shadow" style="border-radius: 16px; margin-top: 144px">
      <q-img
        :src="user.coverLink"
        style="height: 280px"
        class="placeholder absolute-center"
      />
    </q-card>
    <q-avatar size="120px" style="margin-top: 68px">
      <q-img
        class="placeholder"
        :src="user.avatarLink"
        ratio="1"
        style="border: 4px solid #ffffff; border-radius: 100%"
      />
    </q-avatar>
    <!-- <q-btn rounded label="修改封面" class="no-shadow text-black"> </q-btn> -->
    <div class="username text-center">
      {{ user.username }}
    </div>
    <q-btn
      flat
      rounded
      dense
      class="address"
      :label="user.address"
      size="md"
      @click="copy"
    >
      <q-tooltip size="xs">点击复制</q-tooltip>
    </q-btn>

    <div class="bio text-center">
      <q-item-label>{{ user.bio }}</q-item-label>
    </div>

    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-3 show-tabs"
        align="justify"
        narrow-indicator
      >
        <q-tab name="created" label="创建的" />
        <q-tab name="market" label="流通的" />
        <q-tab name="own" label="拥有的" />
        <q-tab v-if="isMe" name="not-chain" label="未上链" />
        <q-tab v-if="isMe" name="favorite" label="收藏的" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab">
        <q-tab-panel name="created">
          <asset-tab :list="createdAssets" />
        </q-tab-panel>

        <q-tab-panel name="market">
          <asset-tab :list="onSaleAssets" />
        </q-tab-panel>

        <q-tab-panel name="own">
          <asset-tab :list="ownedAssets" />
        </q-tab-panel>

        <q-tab-panel name="not-chain">
          <asset-tab :list="auditingAssets" />
        </q-tab-panel>

        <q-tab-panel name="favorite">
          <asset-tab :list="favoriteAssets" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import axios from "src/utils/request.js";
import AssetTab from "components/AssetTab.vue";
export default {
  name: "Users",
  components: {
    AssetTab,
  },
  data() {
    return {
      user: {
        coverLink: null,
        username: null,
        address: null,
        bio: null,
      },
      isMe: false,
      address: null,
      tab: "created",
      createdAssets: [], //1
      onSaleAssets: [], //2
      ownedAssets: [], //3
      auditingAssets: [], //4
      favoriteAssets: [], //5
    };
  },
  methods: {
    copy() {
      if (navigator.clipboard) navigator.clipboard.writeText(this.user.address);
      this.$q.notify({
        type: "positive",
        position: "bottom",
        message: "地址已复制",
        timeout: 1500,
      });
    },
    init() {
      axios.get("/users/" + this.address).then(
        (response) => {
          this.user = response.data;
          if (localStorage.getItem("isAccountLogin") === "true") {
            let me = JSON.parse(localStorage.me);
            if (me.address === this.user.address) this.isMe = true;
            else this.isMe = false;
          } else {
            this.isMe = false;
          }

          axios.get("/assets/" + this.address + "/created").then((response) => {
            this.createdAssets = response.data;
          });
          axios.get("/assets/" + this.address + "/on_sale").then((response) => {
            this.onSaleAssets = response.data;
          });
          axios.get("/assets/" + this.address + "/owned").then((response) => {
            this.ownedAssets = response.data;
          });
          if (this.isMe) {
            axios
              .get("/assets/" + this.address + "/auditing")
              .then((response) => {
                this.auditingAssets = response.data;
              });
            axios
              .get("/assets/" + this.address + "/favorite")
              .then((response) => {
                this.favoriteAssets = response.data;
              });
          } else {
            this.auditingAssets = null;
            this.favoriteAssets = null;
          }
        },
        (error) => {
          this.$q.notify({
            type: "negative",
            position: "center",
            message: "获取用户失败",
            timeout: 3000,
          });
          this.user = null;
          this.isMe = false;
        }
      );
    },
  },
  created: function () {
    this.address = this.$route.params.address;
    this.init();
  },
};
</script>

<style>
.username {
  font-size: 30px;
  font-weight: 600;
  min-height: 40px;
  margin-bottom: 0px;
}
.address {
  /* margin-left: 8px; */
  /* margin-top: 1px; */
  margin-bottom: 8px;
  padding: 0 12px;
  color: #6e6e6e;
  background-color: #f1f1f1;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.bio {
  color: #707a83;
  margin: 0px;
  font-weight: 400;
  font-size: 16px;
}

.show-tabs {
  margin-top: 40px;
}
</style>
