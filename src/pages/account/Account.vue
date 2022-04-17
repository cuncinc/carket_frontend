<template>
  <div align="center">
    <h1>hello, world!</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Account",
  data() {
    return {};
  },
  methods: {
    onSubmit() {
      axios
        .post("/session", {
          username: this.name,
          password: this.password,
        })
        .then(
          (response) => {
            const token = response.data;
            console.log(this.name + " 登录成功");
            setTimeout(() => {
              this.loginLogin = true;
              lacalStorage.set("token", token);
              lacalStorage.set("isAccountLogin", true);
              this.$router.push({
                path: "/",
              });
            }, 500);
          },
          (error) => {
            var status,
              messageText = "登录失败";
            console.log("my_error" + error);
            status = error.response.status;
            if (status == 401) messageText = "用户名或密码不正确";
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
};
</script>

<style lang="sass"></style>
