<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card
      class="my_card q-dialog-plugin"
      style="border-radius: 16px; height: auto"
    >
      <div v-if="!waiting">
        <q-card-section>
          <q-item-label class="title">上架流通</q-item-label>
        </q-card-section>
        <q-card-section>
          <q-item-label class="item"> 资产价格 </q-item-label>
          <q-input dense v-model.number="price" type="number">
            <template v-slot:prepend>
              <q-icon name="img:svg/eth.svg" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions>
          <div class="column q-gutter-sm" style="width: 100%">
            <q-btn
              :disable="price === null || price === ''"
              unelevated
              label="上架"
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
          <q-item-label class="wait" style="">上架中...</q-item-label>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "UpDialog",
  props: {
    aid: Number,
    refresh: Function,
  },
  data() {
    return {
      price: null,
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
      console.log(this.tokenId);
      console.log(this.address);
      this.waiting = true;
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok");
      // 或带有有效负载：this.$emit('ok', { ... })
      axios.post("/assets/" + this.aid + "/market", { price: this.price }).then(
        (response) => {
          // console.log(response);
          this.refresh(this.aid);
          this.hide();
          this.$q.notify({
            type: "positive",
            position: "top",
            message: "上架成功",
            timeout: 2000,
          });
          this.waiting = false;
        },
        (error) => {
          console.log(error);
          this.hide();
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "上架失败",
            timeout: 2000,
          });
          this.waiting = false;
        }
      );
    },

    onCancelClick() {
      this.hide();
    },
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

.wait {
  font-size: 20px;
  font-weight: 600;
  align-content: center;
  text-align: center;
  margin-top: 28px;
}
</style>
