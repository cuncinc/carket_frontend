<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center page">
        <q-card class="q-pa-md" style="width: 350px">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            ref="loginForm"
            class="q-gutter-md"
          >
            <q-tabs
              v-model="tab"
              active-color="primary"
              indicator-color="primary"
              align="center"
              :breakpoint="0"
              narrow-indicator
              class="text-black"
            >
              <q-tab name="userLogin" no-caps label="用户登录" />
              <q-tab name="adminLogin" no-caps label="管理员登录" />
            </q-tabs>
            <div class="q-gutter-y-sm">
              <q-tab-panels v-model="tab" class="text-center">
                <q-tab-panel name="userLogin" class="q-col-gutter-y-sm">
                  <div class="row">
                    <div class="col">
                      <q-input
                        outlined
                        clearable
                        clear-icon="cancel"
                        v-model="name"
                        debounce="500"
                        :label="userNameLabel"
                        lazy-rules
                        rounded
                        :rules="[
                          (val) => (val && val.length > 0) || '请输入用户名',
                          (val) =>
                            (val && val.length < 16) ||
                            '用户名长度大于16个字符',
                        ]"
                      >
                        <template v-slot:prepend>
                          <q-icon name="person" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-input
                        autocomplete="on"
                        outlined
                        clearable
                        clear-icon="cancel"
                        :type="isPwd ? 'password' : 'text'"
                        v-model="password"
                        debounce="500"
                        :label="passwordLabel"
                        lazy-rules
                        rounded
                        :rules="[
                          (val) => (val && val.length > 0) || '请输入密码',
                          (val) =>
                            (val && val.length < 16) || '密码长度大于16个字符',
                        ]"
                      >
                        <template v-slot:prepend>
                          <q-icon name="lock" />
                        </template>
                        <template v-slot:append>
                          <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                          />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="adminLogin" class="q-col-gutter-y-sm">
                  <div class="row">
                    <div class="col">
                      <q-input
                        outlined
                        clearable
                        clear-icon="cancel"
                        v-model="name"
                        debounce="500"
                        label="管理员账号"
                        lazy-rules
                        rounded
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || '请输入管理员账号',
                        ]"
                      >
                        <template v-slot:prepend>
                          <q-icon name="admin_panel_settings" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-input
                        outlined
                        :type="isPwd ? 'password' : 'text'"
                        v-model="password"
                        debounce="500"
                        label="密码"
                        lazy-rules
                        rounded
                        :rules="[
                          (val) => (val && val.length > 0) || '请输入密码',
                        ]"
                      >
                        <template v-slot:prepend>
                          <q-icon name="lock" />
                        </template>
                        <template v-slot:append>
                          <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                          />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
              <div class="q-mx-md">
                <div class="row">
                  <div class="col text-left">
                    <q-checkbox v-model="autoLogin" label="自动登录" />
                  </div>
                  <div class="col text-right">
                    <q-btn no-caps color="gray7" flat label="忘记密码" />
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <q-btn
                      rounded
                      unelevated
                      label="登 录"
                      size="17px"
                      color="primary q-mt-sm"
                      class="full-width"
                      type="submit"
                      :loading="logining"
                    >
                      <template v-slot:loading>
                        <q-spinner-ios class="on-left" />
                        登录中 ...
                      </template>
                    </q-btn>
                  </div>
                </div>
                <div class="row q-pt-md">
                  <div class="col text-right">
                    <q-btn
                      to="/user/register"
                      color="primary"
                      flat
                      no-caps
                      label="用户注册"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-form>

          <q-dialog
            v-model="currentLogin.login"
            persistent
            transition-show="scale"
            transition-hide="scale"
          >
            <q-card class="bg-teal text-white" style="width: 300px">
              <q-card-section>
                <div class="text-h6">Persistent</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                {{ currentLogin.obj }}
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="OK" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "Login",
  data() {
    return {
      userNameLabel: "用户名",
      passwordLabel: "密码",
      tab: "userLogin",
      name: null,
      password: null,
      accept: false,
      isPwd: true,
      autoLogin: true,
      card: false,
      logining: false,
      currentLogin: {
        login: false,
        obj: {},
      },
    };
  },
  methods: {
    onSubmit() {
      if (this.tab === "userLogin") {
        this.toUserLogin();
      } else {
        this.toAdminLogin();
      }
    },
    onReset() {
      this.name = null;
      this.age = null;
      this.accept = false;
    },
    activeForLoginType(iconKey, targetColor) {
      this.iconObject[iconKey].class.color = targetColor;
    },
    toUserLogin() {
      axios
        .post("/session", {
          username: this.name,
          password: this.password,
        })
        .then(
          (response) => {
            let token = response.data.token;
            localStorage.token = token;
            localStorage.isAccountLogin = true;
            console.log(this.name + " 登录成功" + token);
            axios.get("/user").then((response2) => {
              console.log("user data");
              let me = response2.data;
              localStorage.me = JSON.stringify(me);
            });
            setTimeout(() => {
              this.logining = true;
              this.$router.push({
                path: "/",
              });
            }, 500);
          },
          (error) => {
            let messageText = "登录失败";
            console.log("my_error" + error);
            let status = error.response.status;
            if (status == 401) messageText = "用户名或密码不正确";
            else if (status == 500) messageText = "服务器发生错误";
            else if (status == 404 || status == 504)
              messageText = "网络连接失败";

            this.$q.notify({
              // color: "negative",
              // textColor: "white",
              // icon: "cancel",
              type: "negative",
              position: "top",
              // caption: "登录失败",
              message: messageText,
              timeout: 1500,
            });
          }
        );
    },
    toAdminLogin() {
      axios
        .post("/audit/session", {
          adminName: this.name,
          password: this.password,
        })
        .then(
          (response) => {
            let adminToken = response.data.adminToken;
            localStorage.adminToken = adminToken;
            localStorage.isAdminLogin = true;
            console.log(this.name + " 登录成功" + adminToken);
            setTimeout(() => {
              this.logining = true;
              this.$router.push({
                path: "/audit",
              });
            }, 500);
          },
          (error) => {
            let messageText = "管理员登录失败";
            console.log("my_error" + error);
            let status = error.response.status;
            if (status == 401) messageText = "管理员账号或密码不正确";
            else if (status == 500) messageText = "服务器发生错误";
            else if (status == 404 || status == 504)
              messageText = "网络连接失败";

            this.$q.notify({
              type: "negative",
              position: "top",
              message: messageText,
              timeout: 1500,
            });
          }
        );
    },
  },
  computed: {
    loginIcon: function () {
      return this.iconObject;
    },
  },
};
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #fff886 10%, #f072b6 100%);
  /* background-image: linear-gradient( 135deg, #FCCF31 10%, #F55555 100%); */
  /* background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%); */
  /* background-image: linear-gradient( 135deg, #FDEB71 10%, #F8D800 100%); */
  /* background-image: linear-gradient(to right, rgb(255, 0, 184) 0%, rgb(100, 161, 255) 50%, rgb(0, 102, 255) 100%); */
}
</style>
