<template>
  <q-page align="center" class="page body text-align">
    <div>{{ this.$route.params.aid }}</div>
  </q-page>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "AssetsDetail",
  data() {
    return {};
  },
  methods: {},
  beforeCreate: function () {
    console.log(this.$route.params);
    // var isAccountLogin = localStorage.isAccountLogin;
    // if (isAccountLogin && isAccountLogin === "true") {
    // } else {
    //   this.$router.push({
    //     path: "/login",
    //   });
    //   this.$q.notify({
    //     type: "negative",
    //     position: "top",
    //     message: "用户未登录，请先登录",
    //     timeout: 2000,
    //   });
    // }
    console.log("beforeCreate done");
  },

  computed: {},
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
</style>
