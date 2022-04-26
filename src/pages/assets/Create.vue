<template>
  <q-page align="center" class="page body text-align">
    <div class="middle">
      <div class="title">上传艺术品</div>
      <div class="item">
        <div class="label">艺术品</div>
        <q-img class="placeholder art-file" :src="path" />
        <q-file
          dense
          outlined
          clearable
          counter
          v-model="file"
          label="选择文件"
          accept="image/*,video/*,music/*"
          style="margin-top: 16px"
        >
          <template v-slot:hint></template>
        </q-file>
      </div>
      <div class="item">
        <div class="label">名称</div>
        <q-input
          outlined
          dense
          v-model="name"
          placeholder="给你的艺术品起个名"
          class="content"
        />
      </div>
      <div class="item">
        <div class="label">类型</div>
        <!-- 这里应该用图片来代替 -->
        <div class="q-gutter-lg">
          <q-radio v-model="type" label="图片" val="Picture" />
          <q-radio v-model="type" label="视频" val="Video" />
          <q-radio v-model="type" label="音乐" val="Music" />
          <q-radio v-model="type" label="文档" val="Document" />
        </div>
      </div>
      <div class="item">
        <div class="label">描述</div>
        <q-input
          outlined
          dense
          clearable
          type="textarea"
          v-model="desc"
          placeholder="描述你的艺术品"
          class="content"
        />
      </div>
      <q-btn
        rounded
        unelevated
        label="上传"
        color="primary"
        size="md lg"
        @click="create()"
      />
    </div>
  </q-page>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "Create",
  data() {
    return {
      //v-model
      name: null,
      type: "Picture",
      desc: null,
      file: null,
      label: null,
      //display
      path: null,
    };
  },
  methods: {
    create() {
      console.log(file);
    },
    updateCover() {
      let that = this;
      let form = new FormData();
      form.append("file", this.file);
      var config = {
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          //   that.coverPercentage = percentCompleted;
        },
      };
      this.coverLoading = true;
      axios.put("/user/avatar", form, config).then((response) => {
        // this.coverLoading = false;
        // this.coverPercentage = 0;
        // this.cover = null;
        if (response.status === 200) {
          this.$q.notify({
            type: "positive",
            position: "top",
            message: "头像修改成功",
            timeout: 2000,
          });
          axios.get("/user").then((response2) => {
            this.me = response2.data;
            localStorage.me = JSON.stringify(this.me);
          });
        } else {
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "失败",
            timeout: 2000,
          });
        }
      });
    },

    updateMe() {
      var obj = {};
      let m = JSON.parse(localStorage.me);
      if (this.me.username !== m.username) obj["username"] = this.me.username;
      if (this.me.email !== m.email) obj["email"] = this.me.email;
      if (this.me.bio !== m.bio) obj["bio"] = this.me.bio;
      axios.put("/user", obj).then(
        (response) => {
          console.log(response);
          if (response.status === 200) {
            localStorage.me = JSON.stringify(this.me);
            this.$q.notify({
              type: "positive",
              position: "top",
              message: "信息修改成功",
              timeout: 2000,
            });
          }
        },
        (error) => {
          let message = "信息修改失败";
          if (error.response.status === 403)
            message = "用户名被占用，请重新输入";
          this.$q.notify({
            type: "negative",
            position: "top",
            message: message,
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

  computed: {
    isCoverOK() {
      return this.cover ? false : true;
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
  border-radius: 10px;
  min-width: 80%;
  max-height: 300px;
  min-height: 200px;
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
  margin: 30px 0;
}

.label {
  font-weight: 600;
  font-size: 16px;
  color: rgb(4, 17, 29);
  margin-bottom: 10px;
}

.content {
  font-size: 14px;
}
</style>
