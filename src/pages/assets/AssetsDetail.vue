<template>
  <q-page align="center" class="page body text-align middle">
    <div class="row" style="align-items: center">
      <div class="name">{{ asset.name }}</div>
    </div>
    <div class="q-gutter-lg">
      <q-card flat class="card">
        <div id="art-file" class="art-file">
          <q-img
            v-if="asset.type === 'Picture'"
            class="art-file"
            :src="asset.ipfsLink"
          />
          <q-media-player
            v-else-if="asset.type === 'Video'"
            type="video"
            :source="asset.ipfsLink"
            :autoplay="true"
            loop
            hide-volume-btn
            hide-settings-btn
            radius="12px"
            dense
          />
          <q-media-player
            v-else-if="asset.type === 'Music'"
            type="audio"
            :source="asset.ipfsLink"
            :autoplay="false"
            hide-settings-btn
            hide-volume-btn
            style="height: 240px"
            radius="12px"
            dense
          />
        </div>
        <div class="row" style="align-items: center; margin-top: 16px">
          <q-btn round flat :to="'/users/' + creator.address">
            <q-avatar size="40px">
              <q-img class="placeholder" :src="creator.avatarLink" ratio="1" />
              <q-tooltip>创作者： {{ creator.username }}</q-tooltip>
            </q-avatar>
          </q-btn>
          <q-btn
            round
            flat
            v-if="owner !== null"
            :to="'/users/' + owner.address"
            style="margin-left: -10px"
          >
            <q-avatar size="40px">
              <q-img class="placeholder" :src="owner.avatarLink" ratio="1" />
              <q-tooltip>拥有者： {{ owner.username }}</q-tooltip>
            </q-avatar>
          </q-btn>
          <q-chip
            square
            outline
            color="primary"
            :icon="typeIcon"
            text-color="white"
            style="margin-end: 20px; margin-start: 28px"
          >
            <div v-if="asset.type === 'Picture'">图片</div>
            <div v-else-if="asset.type === 'Video'">视频</div>
            <div v-else-if="asset.type === 'Music'">音乐</div>
            <div v-else-if="asset.type === 'Document'">文档</div>
          </q-chip>
          <div class="row" style="align-items: center; color: rgb(235, 87, 87)">
            <q-btn
              flat
              round
              @click="like"
              :icon="likeByMe ? 'favorite' : 'favorite_border'"
            />
            <q-tooltip>{{ asset.favoriteCount }}</q-tooltip>
            <!-- <div>{{ asset.favoriteCount }}</div> -->
          </div>
          <q-space />
          <q-chip
            square
            outline
            color="positive"
            text-color="white"
            style="margin-end: 20px"
          >
            {{ asset.state }}
          </q-chip>
          <q-btn color="gray" round flat icon="more_horiz">
            <q-menu anchor="bottom right" self="top left">
              <q-list style="min-width: 100px">
                <q-item
                  v-if="!onBlockchain"
                  clickable
                  v-close-popup
                  @click="edit"
                >
                  <q-item-section avatar>
                    <q-icon name="edit" />
                  </q-item-section>
                  <q-item-section>编辑艺术品</q-item-section>
                </q-item>
                <q-item
                  v-if="!ownerIsMe && onBlockchain"
                  clickable
                  v-close-popup
                  @click="report"
                >
                  <q-item-section avatar>
                    <q-icon name="flag" />
                  </q-item-section>
                  <q-item-section>举报</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="openIpfsFile">
                  <q-item-section avatar>
                    <q-icon name="source" />
                  </q-item-section>
                  <q-item-section>打开IPFS源文件</q-item-section>
                </q-item>
                <q-item
                  v-if="onBlockchain"
                  clickable
                  v-close-popup
                  @click="openIpfsJson"
                >
                  <q-item-section avatar>
                    <q-icon name="api" />
                  </q-item-section>
                  <q-item-section>打开IPFS描述文件</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-card>
      <q-card flat class="card">
        <!-- <div v-if="asset.state === '在流通'"> -->
        <div v-if="onBlockchain">
          <div>当前价格</div>
          <div class="row price q-gutter-md">
            <q-icon
              name="img:https://openseauserdata.com/files/265128aa51521c90f7905e5a43dcb456_new.svg"
            />
            <!-- <q-icon
                name="img:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAGUGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA3LTE2VDEyOjExOjE2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wNy0yMFQxNjoxMiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNy0yMFQxNjoxMiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmMzhkMWJlNi04YjIwLTRiNjgtOTNlOC05MmVjNWEwZTAwZTIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ODFhNTJhOS1jYjUzLTZiNDUtOGFiMC03YzcyNzQ1Y2E0ZDgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmOTJhMGZlZS03NGM1LTQzY2EtODlmNS0wZTg5OWY0Y2E0MTUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY5MmEwZmVlLTc0YzUtNDNjYS04OWY1LTBlODk5ZjRjYTQxNSIgc3RFdnQ6d2hlbj0iMjAxOC0wNy0xNlQxMjoxMToxNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmYzOGQxYmU2LThiMjAtNGI2OC05M2U4LTkyZWM1YTBlMDBlMiIgc3RFdnQ6d2hlbj0iMjAxOC0wNy0yMFQxNjoxMiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnjiM6cAAAdDSURBVHja7VxbbFRVFJ1b2iKliakt0tJSCiKkJBpIMIVaGml4iAHjB1qs9UPohyYoaiTREJUPMdEv20iKMQb1gyh+SFsaqC3QxPjCRtE2tiCgpRWKj2Cw0pY+xr3TTTKWmTt373Pu3LkzZycrl8c9Z+2z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"
              /> -->
            <div v-if="asset.state === '在流通'">{{ asset.price }} VNT</div>
            <div v-else>--</div>
          </div>
        </div>
        <!-- 我的视角  👇 -->
        <div v-if="ownerIsMe" class="q-gutter-md">
          <div v-if="asset.state === '未流通'">
            <q-btn
              label="上架流通"
              @click="up"
              unelevated
              size="lg"
              class="btn-fullfil"
            />
          </div>
          <div v-else-if="asset.state === '在流通'">
            <q-btn
              label="下架"
              @click="down"
              unelevated
              size="lg"
              class="btn-fullfil"
            />
            <q-btn
              label="修改价格"
              @click="setPrice"
              unelevated
              size="lg"
              class="btn-outline"
              style="margin-top: 16px"
            />
          </div>
          <!-- <div v-else-if="asset.state === '已下架'">
            <q-btn
              label="再上架"
              @click="reup"
              unelevated
              size="lg"
              class="btn-fullfil"
            />
          </div> -->
          <div>
            <q-btn
              label="转让"
              @click="transfer"
              unelevated
              size="lg"
              class="btn-outline"
            />
          </div>
        </div>
        <!-- 我的视角：未上架  👇 -->
        <div v-else-if="!onBlockchain">
          <div v-if="asset.state === '已通过'">
            <q-btn
              label="铸造"
              @click="mint"
              unelevated
              size="lg"
              class="btn-fullfil"
            />
          </div>
          <div v-if="asset.state === '待审核'"></div>
          <div v-if="asset.state === '未通过'"></div>
        </div>
        <!-- 访客视角 👇 -->
        <div v-else>
          <q-btn
            :disable="asset.state !== '在流通'"
            label="购买"
            @click="buy"
            unelevated
            size="lg"
            class="btn-fullfil"
          />
        </div>
      </q-card>
      <q-card flat class="card">
        <div
          clickable
          class="row"
          style="align-items: center"
          @click="detailVisible = !detailVisible"
        >
          <div>上链细节</div>
          <q-space />
          <q-icon
            size="sm"
            :name="detailVisible ? 'expand_less' : 'expand_more'"
          />
        </div>
        <q-slide-transition class="slide">
          <q-card flat v-show="detailVisible" class="q-gutter-sm">
            <div class="row">
              <div class="info-key">tokenId</div>
              <q-space />
              <div class="info-value">{{ asset.tokenId }}</div>
            </div>
            <div class="row">
              <div class="info-key">创作者提成</div>
              <q-space />
              <div class="info-value">{{ asset.rate }}</div>
            </div>
            <div class="row">
              <div class="info-key">IPFS CID</div>
              <q-space />
              <a class="info-value" :href="asset.ipfsLink">{{
                asset.ipfsCid
              }}</a>
            </div>
            <div class="row">
              <div class="info-key">上传时间</div>
              <q-space />
              <div class="info-value">{{ asset.createTime }}</div>
            </div>
          </q-card>
        </q-slide-transition>
      </q-card>
    </div>
    <div style="margin-bottom: 64px" />
  </q-page>
</template>

<script>
import axios from "src/utils/request.js";
import MintDialog from "components/dialog/MintDialog";
import PriceDialog from "components/dialog/PriceDialog";
import TransferDialog from "components/dialog/TransferDialog";
import UpDialog from "components/dialog/UpDialog";
export default {
  name: "AssetsDetail",
  data() {
    return {
      ownerIsMe: false,
      onBlockchain: false,
      likeByMe: false,
      asset: {
        name: null,
        state: null,
      },
      creator: { username: null },
      owner: { username: null },
      requestType: "aid",
      typeIcon: null,
      detailVisible: false,
      activityVisible: false,
      priceVisible: false,
      moreVisible: false,
    };
  },
  methods: {
    buy() {},
    edit() {
      this.$router.push({
        path: "/assets/" + this.asset.aid + "/edit",
      });
    },
    mint() {
      let that = this;
      this.$q.dialog({
        component: MintDialog,
        parent: this,
        aid: ~~that.asset.aid,
        refresh: this.init,
      });
    },
    transfer() {
      let that = this;
      this.$q.dialog({
        component: TransferDialog,
        parent: this,
        aid: ~~that.asset.aid,
        refresh: this.init,
      });
    },
    setPrice() {
      let that = this;
      this.$q.dialog({
        component: PriceDialog,
        parent: this,
        aid: ~~that.asset.aid,
        refresh: this.init,
      });
    },
    up() {
      let that = this;
      this.$q.dialog({
        component: UpDialog,
        parent: this,
        aid: ~~that.asset.aid,
        refresh: this.init,
      });
    },
    down() {
      let me = JSON.parse(localStorage.getItem("me"));
      if (me.address === this.asset.owner) {
        axios.delete("/assets/" + this.asset.aid + "/market").then(
          (response) => {
            this.$q.notify({
              type: "positive",
              position: "top",
              message: "艺术品已被下架",
              timeout: 2000,
            });
            this.init(this.asset.aid);
          },
          (error) => {
            this.$q.notify({
              type: "negative",
              position: "top",
              message: "下架失败",
              timeout: 2000,
            });
            console.log(error);
          }
        );
      } else {
        this.$q.notify({
          type: "negative",
          position: "top",
          message: "您不是此艺术品的所有者，不能下架",
          timeout: 2000,
        });
      }
    },
    report() {
      //todo 举报原因
      let data = { tokenId: this.asset.tokenId, why: "test" };
      axios.post("/reports", data).then(
        (response) => {
          this.$q.notify({
            type: "positive",
            position: "top",
            message: "举报成功",
            timeout: 2000,
          });
        },
        (error) => {
          let message = "举报失败";
          if (error.response.status === 401) message = "举报失败，请先登录";
          this.$q.notify({
            type: "negative",
            position: "top",
            message: message,
            timeout: 2000,
          });
        }
      );
    },
    like() {
      let me = JSON.parse(localStorage.getItem("me"));
      if (me === null) {
        this.$q.notify({
          type: "negative",
          position: "top",
          message: "你还没有登录，无法收藏艺术品",
          timeout: 2000,
        });
        return;
      }
      if (this.likeByMe) {
        //取消收藏
        axios.delete("/favorites/" + this.asset.aid).then(
          (response) => {
            this.likeByMe = false;
            this.asset.favoriteCount = response.data.count;
          },
          (error) => {
            console.log(error);
            this.$q.notify({
              type: "negative",
              position: "top",
              message: "取消收藏失败",
              timeout: 2000,
            });
          }
        );
      } else {
        axios.post("/favorites/" + this.asset.aid).then(
          (response) => {
            this.likeByMe = true;
            // this.asset.favoriteCount += 1;
            this.asset.favoriteCount = response.data.count;
          },
          (error) => {
            console.log(error);
            this.$q.notify({
              type: "negative",
              position: "top",
              message: "收藏失败",
              timeout: 2000,
            });
          }
        );
      }
    },
    openIpfsFile() {
      window.open(this.asset.ipfsLink, "_blank");
    },
    openIpfsJson() {
      window.open(this.asset.jsonLink, "_blank");
    },
    init(id) {
      console.log("======init data " + id);
      let me = JSON.parse(localStorage.getItem("me"));
      axios
        .get("/assets/" + id, {
          params: {
            type: this.requestType,
          },
        })
        .then(
          (response) => {
            this.asset = response.data;
            // 是否在链上
            if (this.asset.tokenId !== null) this.onBlockchain = true;
            else this.onBlockchain = false;

            // 获取创作者
            axios.get("/users/" + this.asset.creator).then((response) => {
              this.creator = response.data;
            });
            // 获取拥有者
            let ownerAddress = this.asset.owner;
            if (ownerAddress !== null && ownerAddress !== "") {
              axios.get("/users/" + ownerAddress).then((response) => {
                this.owner = response.data;
                if (me !== null && me.address === this.owner.address)
                  this.ownerIsMe = true;
                else this.ownerIsMe = false;
              });
            } else {
              this.owner = null;
              this.ownerIsMe = false;
            }
            // 获取我是否喜欢此艺术品
            if (me !== null) {
              axios.get("/favorites/" + id + "/" + me.address).then(
                (response) => {
                  this.likeByMe = response.data.favorite;
                  // this.likeByMe = true;
                  this.asset.favoriteCount = response.data.count;
                },
                (error) => {
                  this.likeByMe = false;
                }
              );
            }
            // 类型图标
            this.typeIcon =
              this.asset.type === "Video"
                ? "movie"
                : this.asset.type === "Picture"
                ? "photo"
                : this.asset.type === "Music"
                ? "audiotrack"
                : "insert_drive_file";
          },
          (error) => {
            let message = "访问艺术品失败";
            if (error.response.status === 404) {
              message = "没有找到这个艺术品";
            } else if (error.response.status === 401) {
              message = "无权访问此艺术品";
            } else if (error.response.status === 504) {
              message = "找不到服务器";
            }
            this.$q.notify({
              type: "negative",
              position: "center",
              message: message,
              timeout: 3000,
            });
            this.asset = null;
            this.creator = null;
            this.owner = null;
            this.ownerIsMe = false;
            this.onBlockchain = false;
            console.log(error);
          }
        );
    },
  },
  watch: {
    $route(to, from) {
      this.init(to.params.aid);
    },
  },
  created: function () {
    // console.log("Assets Detail: Created");
    let aid = this.$route.params.aid;
    this.init(aid);
  },
  computed: {},
};
</script>

<style>
.body {
  font-weight: 400;
  line-height: 1.4;
  max-width: 100%;
  /* font-family: Poppins, sans-serif; */
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
  width: 600px;
  min-height: 200px;
  max-height: 1000px;
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
}

.name {
  font-weight: 600;
  font-size: 30px;
  color: rgb(53, 56, 64);
  margin-bottom: 20px;
  margin-top: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
}

.card {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgb(229, 232, 235);
  width: 632px;
  background-color: rgb(251, 253, 255);
}

.content {
  font-size: 14px;
}

.price {
  font-size: 30px;
  font-weight: 600;
  align-items: center;
  margin-bottom: 24px;
}

.btn-fullfil {
  width: 100%;
  background-color: rgb(32, 129, 226);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 3px;
}

.btn-outline {
  width: 100%;
  background-color: white;
  color: rgb(32, 129, 226);
  border-radius: 10px;
  border: 2px solid rgb(32, 129, 226);
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 3px;
}

.slide {
  margin-top: 16px;
  border-top: 1px solid rgb(229, 232, 235);
}

.info-key {
  text-align: left;
  font-weight: 500;
  font-size: 15px;
}

.info-value {
  text-align: right;
  font-weight: 500;
  font-size: 15px;
  color: rgb(112, 122, 131);
  margin-right: 8px;
}
</style>
