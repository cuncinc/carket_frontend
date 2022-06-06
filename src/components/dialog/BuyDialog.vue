<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card
      class="my_card q-dialog-plugin"
      style="border-radius: 16px; height: auto"
    >
      <div v-if="steps === 0">
        <q-card-section>
          <q-item-label class="title">购买资产</q-item-label>
        </q-card-section>
        <q-card-section>
          <!-- <q-item-label class="item"> 购买须知 </q-item-label> -->
          <q-item-label> {{ tip }} </q-item-label>
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <div class="row q-gutter-sm items-center my-price">
            <q-item-label style="margin-right: 8px">平台方</q-item-label>
            <q-avatar size="30px">
              <q-img src="carket-logo.svg" ratio="1" />
            </q-avatar>
            <q-space />
            <q-icon name="img:svg/eth.svg" size="20px" />
            <q-item-label>{{ platformAmount }} VNT</q-item-label>
          </div>
          <div
            v-if="asset.owner !== asset.creator"
            class="row q-gutter-sm items-center my-price"
          >
            <q-item-label style="margin-right: 8px">创作者</q-item-label>
            <q-avatar class="placeholder" size="30px">
              <q-img :src="creator.avatarLink" ratio="1" />
              <q-tooltip>{{ creator.username }}</q-tooltip>
            </q-avatar>
            <q-space />
            <q-icon name="img:svg/eth.svg" size="20px" />
            <q-item-label>{{ creatorAmount }} VNT</q-item-label>
          </div>
          <div class="row q-gutter-sm items-center my-price">
            <q-item-label style="margin-right: 8px">拥有者</q-item-label>
            <q-avatar class="placeholder" size="30px">
              <q-img :src="owner.avatarLink" ratio="1" />
              <q-tooltip>{{ owner.username }}</q-tooltip>
            </q-avatar>
            <q-space />
            <q-icon name="img:svg/eth.svg" size="20px" />
            <q-item-label>{{ ownerAmount }} VNT</q-item-label>
          </div>
        </q-card-section>

        <q-card-actions>
          <div class="column q-gutter-sm" style="width: 100%">
            <q-btn
              unelevated
              label="继续"
              @click="onGoOnClick"
              style="
                border-radius: 10px;
                color: white;
                background-color: rgb(32, 129, 226);
              "
            />
            <q-btn
              flat
              unelevated
              label="取消"
              @click="onCancelClick"
              style="
                border-radius: 10px;
                border: 1px solid rgb(32, 129, 226);
                color: rgb(32, 129, 226);
              "
            />
          </div>
        </q-card-actions>
      </div>
      <div v-else-if="steps === 1">
        <q-card-section>
          <q-item-label class="title">购买资产</q-item-label>
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-item-label class="item">总共需要支付</q-item-label>
          <div class="row q-gutter-sm items-center my-price-2">
            <q-space />
            <q-icon name="img:svg/eth.svg" size="30px" />
            <q-item-label>{{ asset.price }} VNT</q-item-label>
            <q-space />
          </div>
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-item-label class="item">请输入登录密码</q-item-label>
          <q-input dense v-model="password" type="password" outlined />
        </q-card-section>
        <q-card-actions>
          <div class="column q-gutter-sm" style="width: 100%">
            <q-btn
              :disable="password === null || password === ''"
              unelevated
              label="购买"
              @click="onOKClick"
              style="
                border-radius: 10px;
                color: white;
                background-color: rgb(32, 129, 226);
              "
            />
            <q-btn
              flat
              unelevated
              label="取消"
              @click="onCancelClick"
              style="
                border-radius: 10px;
                border: 1px solid rgb(32, 129, 226);
                color: rgb(32, 129, 226);
              "
            />
          </div>
        </q-card-actions>
      </div>
      <div v-else-if="steps === 2" class="flex flex-center">
        <q-card-section class="column">
          <q-circular-progress
            indeterminate
            size="138px"
            color="primary"
            class="q-ma-md"
          />
          <q-item-label class="wait" style="">正在购买...</q-item-label>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "BuyDialog",
  props: {
    aid: Number,
    asset: Object,
    creator: Object,
    owner: Object,
    refresh: Function,
  },
  data() {
    return {
      price: null,
      steps: 0,
      rate: null,
      platformAmount: null,
      creatorAmount: null,
      ownerAmount: null,
      tip: null,
      password: null,
    };
  },

  methods: {
    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide() {
      console.log("hide");
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit("hide");
    },
    onGoOnClick() {
      this.steps = 1;
    },

    onOKClick() {
      this.steps = 2;
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok");
      // 或带有有效负载：this.$emit('ok', { ... })
      axios
        .post("/market/assets/" + this.aid + "/buy", {
          password: this.password,
        })
        .then(
          (response) => {
            this.refresh(this.aid);
            this.hide();
            this.$q.notify({
              type: "positive",
              position: "top",
              message: "购买成功",
              timeout: 2000,
            });
            this.steps = 0;
          },
          (error) => {
            console.log(error);
            this.hide();
            let message = "购买失败";
            let m = error.response.data.message;
            if (m !== null || m !== undefined) {
              message += "，" + m;
            }
            this.$q.notify({
              type: "negative",
              position: "top",
              message: message,
              timeout: 2000,
            });
            this.steps = 0;
          }
        );
    },

    onCancelClick() {
      this.hide();
      this.steps = 0;
    },
  },
  created: function () {
    console.log(this.asset);
    this.tip = "平台方收取2.5%手续费";
    let price = this.asset.price;
    let rate = this.asset.rate;
    this.rate = rate;
    // price *= 1e6;
    this.platformAmount = (price * 25) / 1000;
    if (this.asset.owner === this.asset.creator) {
      //创作者是拥有者
      this.creatorAmount = 0;
      this.tip += "，拥有者是创作者，不须额外付款";
    } else {
      //创作者不是拥有者
      this.creatorAmount = ((price - this.platformAmount) * rate) / 100;
      this.tip += "，拥有者不是创作者，需向创作者支付" + rate + "%费率";
    }
    this.ownerAmount = price - this.platformAmount - this.creatorAmount;

    // price /= 1e6;
    // this.platformAmount /= 1e6;
    // this.creatorAmount /= 1e6;
    // this.ownerAmount /= 1e6;

    // console.log(price);
    // console.log(this.platformAmount);
    // console.log(this.creatorAmount);
    // console.log(this.ownerAmount);
  },
};
</script>

<style>
.my_card {
  width: 420px;
  height: 300px;
  padding: 16px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  align-content: center;
  width: 100%;
}

.item {
  font-size: 16px;
  font-weight: 600;
}

.my-price {
  font-size: 19px;
  font-weight: 600;
}

.my-price-2 {
  font-size: 30px;
  font-weight: 600;
}

.wait {
  font-size: 20px;
  font-weight: 600;
  align-content: center;
  text-align: center;
  margin-top: 28px;
}
</style>
