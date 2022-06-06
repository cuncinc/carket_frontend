<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card
      class="my_card q-dialog-plugin"
      style="border-radius: 16px; height: auto"
    >
      <div>
        <q-card-section>
          <q-item-label class="title">转让资产</q-item-label>
        </q-card-section>
        <q-card-section>
          <q-item-label class="item"> 受让人钱包地址 </q-item-label>
          <q-input
            dense
            clearable
            debounce="500"
            v-model="address"
            placeholder="0x123456..."
            :rules="[(val) => val.length === 42 || '请输入42位十六进制地址']"
          />
        </q-card-section>
        <q-card-actions>
          <div class="column q-gutter-sm" style="width: 100%">
            <q-btn
              :disable="address !== null && address.length !== 42"
              unelevated
              label="转让"
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
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
export default {
  name: "TransferDialog",
  props: {
    aid: Number,
    refresh: Function,
  },
  data() {
    return {
      address: null,
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
      console.log(this.aid);
      console.log(this.address);
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok");
      axios.put("/assets/" + this.aid + "/owner", { to: this.address }).then(
        (response) => {
          this.refresh(this.aid);
          this.hide();
          this.$q.notify({
            type: "positive",
            position: "top",
            message: "转让成功",
            timeout: 2000,
          });
        },
        (error) => {
          console.log(error);
          this.hide();
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "转让失败",
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
  height: 600px;
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
</style>
