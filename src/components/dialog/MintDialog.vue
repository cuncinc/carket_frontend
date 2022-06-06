<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin my_card"
      style="border-radius: 16px; height: auto"
    >
      <div v-if="!waiting">
        <q-card-section>
          <div class="title">铸造上链</div>
        </q-card-section>
        <q-card-section>
          <q-item-label class="item"> 你的抽成 </q-item-label>
          <q-item-label>
            后续关于此资产的所有交易，你都能获取交易额的一部分金额，请选择百分比
          </q-item-label>
          <q-select dense v-model="rate" :options="rates" />
        </q-card-section>
        <q-card-actions>
          <div class="column q-gutter-sm" style="width: 100%">
            <q-btn
              :disable="rate === null"
              unelevated
              label="铸造"
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
      <div v-else class="flex flex-center">
        <q-card-section class="column">
          <q-circular-progress
            indeterminate
            size="138px"
            color="primary"
            class="q-ma-md"
          />
          <q-item-label class="wait" style="">铸造中...</q-item-label>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "TransferDialog",
  props: {
    aid: Number,
    refresh: Function,
  },
  data() {
    return {
      rate: null,
      rates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      waiting: false,
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
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit("hide");
    },

    onOKClick() {
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok");
      // 或带有有效负载：this.$emit('ok', { ... })
      this.waiting = true;
      axios
        .post("/assets/" + this.aid + "/blockchain", { rate: this.rate })
        .then(
          (response) => {
            this.refresh(this.aid);
            this.hide();
            this.waiting = false;
            this.$q.notify({
              type: "positive",
              position: "top",
              message: "铸造成功",
              timeout: 2000,
            });
          },
          (error) => {
            console.log(error);
            this.hide();
            this.waiting = false;
            this.$q.notify({
              type: "negative",
              position: "top",
              message: "铸造失败",
              timeout: 2000,
            });
          }
        );
    },

    onCancelClick() {
      // 我们只需要隐藏对话框
      this.hide();
    },
  },
};
</script>

<style>
.my_card {
  width: 420px;
  padding: 16px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  align-items: center;
  width: 100%;
}

.item {
  font-size: 16px;
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
