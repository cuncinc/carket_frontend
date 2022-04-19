<template>
  <q-page align="center" class="page text-align">
    <q-card class="no-shadow" style="border-radius: 16px; margin-top: 144px">
      <q-img
        :src="me.coverLink"
        style="height: 280px"
        class="placeholder absolute-center"
      />
    </q-card>
    <q-avatar size="120px" style="margin-top: 68px">
      <q-img
        class="placeholder"
        :src="me.avatarLink"
        ratio="1"
        style="border: 4px solid #ffffff; border-radius: 100%"
      />
    </q-avatar>
    <!-- <q-btn rounded label="修改封面" class="no-shadow text-black"> </q-btn> -->
    <div class="username text-center">
      {{ me.username }}
    </div>
    <q-btn flat rounded dense class="address" :label="me.username" size="md">
      <q-tooltip size="xs">复制</q-tooltip>
    </q-btn>
    <div class="bio">
      {{ me.bio }}
    </div>
  </q-page>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "Account",
  data() {
    return {
      me: null,
    };
  },
  methods: {
    getUser() {
      axios.get("/user").then((response) => {
        console.log("user data");
        this.me = response.data;
        console.log(this.me);
      });
    },
  },
  mounted: function () {
    console.log("Account page mounted");
    var isAccountLogin = localStorage.isAccountLogin;
    if (isAccountLogin && isAccountLogin === "true") {
      console.log("account Login");
      this.me = JSON.parse(localStorage.me);
    } else {
      this.$router.push({
        path: "/login",
      });
      this.$q.notify({
        type: "negative",
        position: "top",
        message: "用户未登录，请先登录",
        timeout: 1500,
      });
    }
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
}
</style>
