<template>
  <q-page align="center" class="page body text-align">
    <div>
      <q-tab-panel name="profile">
        <div class="title">编辑个人信息</div>
        <div>
          <div class="left">
            <div class="item">
              <div class="label">用户名</div>
              <q-input
                outlined
                dense
                v-model="me.username"
                class="content"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '用户名不能为空']"
              />
            </div>
            <div class="item">
              <div class="label">个性签名</div>
              <q-input
                outlined
                dense
                clearable
                type="textarea"
                v-model="me.bio"
                placeholder="编辑个性签名"
                class="content"
              />
            </div>
            <div class="item">
              <div class="label">电子邮箱</div>
              <q-input
                outlined
                dense
                clearable
                placeholder="编辑电子邮箱"
                type="email"
                v-model="me.email"
                class="content"
              />
            </div>
            <q-btn
              rounded
              unelevated
              label="保存修改"
              color="primary"
              class="save-btn"
              :disable="isInfoOK"
              @click="updateMe"
            />
          </div>
          <div class="right">
            <div class="item">
              <div class="label">头像</div>
              <div
                class="placeholder"
                style="width: 100px; border-radius: 50px"
              >
                <q-avatar size="100px">
                  <q-img :src="avatarLink" ratio="1" />
                </q-avatar>
              </div>
              <q-file
                dense
                outlined
                clearable
                counter
                v-model="avatar"
                label="选择头像"
                accept="image/*"
                @input="avatarLoaded"
                :counter-label="counterLabelFn"
                style="margin-top: 16px"
              >
                <template v-slot:hint></template>
                <template v-slot:after>
                  <q-btn
                    rounded
                    dense
                    unelevated
                    padding="xs md"
                    :loading="avatarLoading"
                    :percentage="avatarPercentage"
                    color="primary"
                    label="上传头像"
                    :disable="isAvatarOK"
                    @click="updateAvatar()"
                  />
                </template>
              </q-file>
            </div>
            <div class="item">
              <div class="label">封面</div>
              <div
                class="placeholder"
                style="border-radius: 10px; width: 100%; min-height: 160px"
              >
                <q-img
                  :src="coverLink"
                  style="border-radius: 10px; min-height: 160px"
                />
              </div>
              <q-file
                dense
                outlined
                clearable
                counter
                v-model="cover"
                label="选择封面"
                :counter-label="counterLabelFn"
                @input="coverLoaded"
                accept="image/*"
                style="margin-top: 16px"
              >
                <template v-slot:hint></template>
                <template v-slot:after>
                  <q-btn
                    rounded
                    dense
                    unelevated
                    :loading="coverLoading"
                    :percentage="coverPercentage"
                    padding="xs md"
                    color="primary"
                    label="上传封面"
                    :disable="isCoverOK"
                    @click="updateCover()"
                  />
                </template>
              </q-file>
            </div>
          </div>
        </div>
      </q-tab-panel>
    </div>
  </q-page>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "Settings",
  data() {
    return {
      //profile
      me: JSON.parse(localStorage.me),
      tab: "profile",
      splitterModel: 14,
      // components data
      avatar: null,
      avatarLoading: false,
      avatarPercentage: 0,
      cover: null,
      coverLoading: false,
      coverPercentage: 0,
      coverLink: null,
      avatarLink: null,
    };
  },
  methods: {
    updateAvatar() {
      let that = this;
      let form = new FormData();
      form.append("file", this.avatar);
      var config = {
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          that.avatarPercentage = percentCompleted;
          //   console.info(that.avatarPercentage);
        },
      };
      this.avatarLoading = true;
      axios.put("/users/me/avatar", form, config).then((response) => {
        this.avatarLoading = false;
        this.avatarPercentage = 0;
        this.avatar = null;
        if (response.status === 200) {
          this.$q.notify({
            type: "positive",
            position: "top",
            message: "头像修改成功",
            timeout: 2000,
          });
          axios.get("/users/me").then((response2) => {
            this.me = response2.data;
            localStorage.me = JSON.stringify(this.me);
          });
        } else {
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "头像修改失败",
            timeout: 2000,
          });
        }
      });
    },
    updateCover() {
      let that = this;
      let form = new FormData();
      form.append("file", this.cover);
      var config = {
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          that.coverPercentage = percentCompleted;
          //   console.info(that.coverPercentage);
        },
      };
      this.coverLoading = true;
      axios.put("/users/me/cover", form, config).then((response) => {
        this.coverLoading = false;
        this.coverPercentage = 0;
        this.cover = null;
        if (response.status === 200) {
          this.$q.notify({
            type: "positive",
            position: "top",
            message: "封面修改成功",
            timeout: 2000,
          });
          axios.get("/users/me").then((response2) => {
            this.me = response2.data;
            localStorage.me = JSON.stringify(this.me);
          });
        } else {
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "封面修改失败",
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
      axios.put("/users/me", obj).then(
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
    counterLabelFn({ totalSize }) {
      return `${totalSize}`;
    },
    coverLoaded() {
      console.log(this.cover);
      if (this.cover !== null) {
        const reader = new FileReader();
        let that = this;
        reader.onload = function fileReadCompleted() {
          that.coverLink = reader.result;
          console.log(reader.result);
        };
        reader.readAsDataURL(this.cover);
      } else this.coverLink = this.me.coverLink;
    },
    avatarLoaded() {
      console.log(this.avatar);
      if (this.avatar !== null) {
        const reader = new FileReader();
        let that = this;
        reader.onload = function fileReadCompleted() {
          that.avatarLink = reader.result;
          console.log(reader.result);
        };
        reader.readAsDataURL(this.avatar);
      } else this.avatarLink = this.me.avatarLink;
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
    this.avatarLink = this.me.avatarLink;
    this.coverLink = this.me.coverLink;
  },

  computed: {
    isAvatarOK() {
      return this.avatar ? false : true;
    },
    isCoverOK() {
      return this.cover ? false : true;
    },
    isInfoOK() {
      console.log(this.me.username);
      let m = JSON.parse(localStorage.me);
      if (
        m.username === this.me.username &&
        m.bio === this.me.bio &&
        m.email === this.me.email
      ) {
        return true;
      } else if (this.me.username === "") return true;
      return false;
    },
  },
};
</script>

<style>
.body {
  /* font-family: "Circular Std", Helvetica, Arial, sans-serif; */
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

.left {
  float: left;
  width: 60%;
  margin-right: 4px;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
}
.right {
  margin-left: 66%;
  width: 30%;
  align-items: flex-start;
  justify-content: flex-start;
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

.save-btn {
  line-height: 48px;
  padding: 0 40px;
  font-weight: 900;
}
</style>
