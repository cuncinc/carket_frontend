<template>
  <q-page align="center" class="page body text-align">
    <div class="middle">
      <div class="title">编辑艺术品</div>
      <div class="item">
        <div class="label">艺术品</div>
        <q-card flat id="art-file" class="art-file placeholder">
          <q-img v-if="asset.type === 'Picture'" :src="asset.ipfsLink" />
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
            style="height: 280px"
            radius="12px"
            dense
          />
        </q-card>
      </div>
      <div class="item">
        <div class="label">类型</div>
        <div class="q-gutter-lg">
          <q-radio disable v-model="asset.type" label="图片" val="Picture" />
          <q-radio disable v-model="asset.type" label="视频" val="Video" />
          <q-radio disable v-model="asset.type" label="音乐" val="Music" />
          <q-radio disable v-model="asset.type" label="文档" val="Document" />
        </div>
      </div>
      <div class="item">
        <div class="label">名称</div>
        <q-input outlined dense v-model="name" class="content" />
      </div>
      <div class="item">
        <div class="label">描述</div>
        <q-input
          outlined
          dense
          clearable
          type="textarea"
          v-model="desc"
          class="content"
        />
      </div>
      <q-btn
        rounded
        unelevated
        :disabled="!canUpdate"
        label="修改艺术品"
        color="primary"
        class="upload-btn"
        @click="update"
      />
    </div>
    <div style="margin-top: 64px" />
  </q-page>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "EditAsset",
  data() {
    return {
      name: null,
      desc: null,
      label: null,
      asset: {
        aid: null,
        name: null,
        type: null,
        desc: null,
        label: null,
        ipfsLink: null,
        state: null,
        owner: null,
      },
    };
  },
  methods: {
    update() {
      let name = null;
      let desc = null;
      if (this.name !== this.asset.name) name = this.name;
      if (this.desc !== this.asset.desc) desc = this.desc;

      let data = { name: name, desc: desc };

      axios.put("/assets/" + this.asset.aid, data).then(
        (response) => {
          if (response.status === 200) {
            this.$q.notify({
              type: "positive",
              position: "top",
              message: "艺术品修改成功",
              timeout: 2000,
            });
          }
          let push = setTimeout(() => {
            this.$router.push({
              path: "/assets/" + this.asset.aid,
            });
            clearTimeout(push);
          }, 2100);
        },
        (err) => {
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "艺术品修改失败",
            timeout: 2000,
          });
        }
      );
    },
  },
  beforeCreate: function () {
    console.log("beforeCreate");
    var isAccountLogin = localStorage.isAccountLogin;
    if (isAccountLogin && isAccountLogin === "true") {
    } else {
      this.$router.push({
        path: "/login",
      });
      this.$q.notify({
        type: "negative",
        position: "top",
        message: "用户未登录，请先登录",
        timeout: 2000,
      });
    }
    console.log("beforeCreate done");
  },
  created: function () {
    let aid = this.$route.params.aid;
    axios
      .get("/assets/" + aid, {
        params: {
          type: "aid",
        },
      })
      .then(
        (response) => {
          if (response.tokenId !== null) {
            this.asset = response.data;
            this.name = this.asset.name;
            this.desc = this.asset.desc;
            this.label = this.asset.label;
          } else
            this.$q.notify({
              type: "negative",
              position: "top",
              message: "艺术品已经上链，不允许修改",
              timeout: 2000,
            });
        },
        (error) => {
          let message = "获取艺术品失败";
          if (error.response.status === 401) message += "，没有访问权限";
          else if (error.response.status === 404) message += "，没有找到";
          this.$q.notify({
            type: "negative",
            position: "top",
            message: message,
            timeout: 2000,
          });
        }
      );
  },
  computed: {
    canUpdate() {
      if (this.name === this.asset.name && this.desc === this.asset.desc)
        return false;
      else if (this.name === null || this.name === "") return false;
      else if (this.desc === null || this.desc === "") return false;
      else return true;
    },
  },
};
</script>

<style>
.body {
  font-weight: 400;
  line-height: 1.4;
  max-width: 100%;
}
.title {
  font-size: 36px;
  font-weight: 700;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
}
.art-file {
  border-radius: 12px;
  min-width: 80%;
  min-height: 280px;
}

.middle {
  float: center;
  padding: 0 20%;
  margin: 0 auto;
  min-width: 880px;
  max-width: 1100px;
  text-align: left;
}

.item {
  display: flex;
  flex-direction: column;
  margin: 36px 0;
}

.label {
  font-weight: 700;
  font-size: 18px;
  color: rgb(4, 17, 29);
  margin-bottom: 10px;
}

.content {
  font-size: 14px;
}

.upload-btn {
  line-height: 48px;
  padding: 0 40px;
  font-weight: 900;
}
</style>
