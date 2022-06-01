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
    <div class="bio">
      {{ user.bio }}
    </div>

    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-3"
        align="justify"
        narrow-indicator
      >
        <q-tab name="created" label="创建的" />
        <q-tab name="market" label="流通的" />
        <q-tab name="own" label="拥有的" />
        <q-tab v-if="isMe" name="not-chain" label="未上链" />
        <q-tab name="favorite" label="收藏的" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="created">
          <div class="text-h6">创建的</div>
          1111111111111111111
        </q-tab-panel>

        <q-tab-panel name="market">
          <div class="text-h6">流通的</div>
          2222222222222222222
        </q-tab-panel>

        <q-tab-panel name="own">
          <div class="text-h6">拥有的</div>
          3333333333333333333
        </q-tab-panel>
        <q-tab-panel name="not-chain">
          <div class="text-h6">未上链的</div>
          4444444444444444444
        </q-tab-panel>
        <q-tab-panel name="favorite">
          <div class="text-h6">收藏的</div>
          5555555555555555555
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- <q-card flat>
      <div id="art-file" class="art-file">
        <q-img
          v-if="asset.type === 'Picture'"
          class="art-file"
          :src="asset.ipfsLink"
        />
        <q-media-player
          v-else-if="asset.type === 'Video'"
          type="video"
          :source="asset.ipfsLink"
          :autoplay="true"
          loop
          hide-volume-btn
          hide-settings-btn
          radius="12px"
          dense
        />
        <q-media-player
          v-else-if="asset.type === 'Music'"
          type="audio"
          :source="asset.ipfsLink"
          :autoplay="false"
          hide-settings-btn
          hide-volume-btn
          style="height: 240px"
          radius="12px"
          dense
        />
      </div>
    </q-card> -->
  </q-page>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "Users",
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
          console.log(this.user);
          let me = JSON.parse(localStorage.me);
          if (me.address === this.user.address) this.isMe = true;
          else this.isMe = false;
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
  text-align: center;
  max-width: 200px;
}
</style>
