<template>
  <q-page align="center" class="page body text-align">
    <div class="middle">
      <div class="title">上传艺术品</div>
      <div class="item">
        <div class="label">艺术品</div>
        <q-card flat id="art-file" class="art-file placeholder">
          <q-img v-if="type === 'Picture'" :src="fileUrl" />
          <q-media-player
            v-else-if="type === 'Video'"
            type="video"
            :source="fileUrl"
            :autoplay="true"
            loop
            hide-volume-btn
            hide-settings-btn
            radius="12px"
            dense
          />
          <q-media-player
            v-else-if="type === 'Music'"
            type="audio"
            :source="fileUrl"
            :autoplay="false"
            hide-settings-btn
            hide-volume-btn
            style="height: 280px"
            radius="12px"
            dense
          />
        </q-card>
        <q-file
          dense
          outlined
          clearable
          use-chips
          counter
          v-model="file"
          @rejected="fileRejected"
          @input="fileLoaded"
          label="艺术品文件"
          max-file-size="104857600"
          accept="image/*,video/*,audio/*"
          :counter-label="counterLabelFn"
          style="margin-top: 16px"
        >
          <template v-slot:file="{ file }">
            <q-chip class="q-my-xs" square>
              <q-avatar>
                <q-icon :name="fileIcon" />
              </q-avatar>

              <div class="ellipsis relative-position">
                {{ file.name }}
              </div>

              <q-tooltip>
                {{ file.name }}
              </q-tooltip>
            </q-chip>
          </template>
          <template v-slot:hint></template>
        </q-file>
      </div>
      <div class="item">
        <div class="label">类型</div>
        <!-- 这里应该用图片来代替 -->
        <div class="q-gutter-lg">
          <q-radio v-model="type" label="图片" val="Picture" />
          <q-radio v-model="type" label="视频" val="Video" />
          <q-radio v-model="type" label="音乐" val="Music" />
          <q-radio v-model="type" label="文档" val="Document" />
        </div>
      </div>
      <div class="item">
        <div class="label">名称</div>
        <q-input
          outlined
          dense
          v-model="name"
          placeholder="给你的艺术品起个名"
          class="content"
        />
      </div>
      <div class="item">
        <div class="label">描述</div>
        <q-input
          outlined
          dense
          clearable
          type="textarea"
          v-model="desc"
          placeholder="描述你的艺术品"
          class="content"
        />
      </div>
      <q-btn
        rounded
        unelevated
        :disabled="!canCreate"
        label="上传艺术品"
        color="primary"
        class="upload-btn"
        @click="create()"
      />
    </div>
    <div style="margin-top: 64px" />
  </q-page>
  <!-- <template>
      <q-dialog ref="dialog" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
          <q-card-section>

          </q-card-section>


          <q-card-actions align="right">
            <q-btn hidden color="primary" label="去查看" @click="onDetailClick" />
            <q-btn color="primary" label="取消上传" @click="onCancelClick" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template> -->
</template>

<script>
import axios from "src/utils/request.js";
export default {
  name: "Create",
  data() {
    return {
      name: null,
      type: "Picture",
      desc: null,
      file: null,
      label: null,
      fileIcon: null,
      fileUrl: null,
      uploadPercentage: null,
    };
  },
  methods: {
    fileLoaded(file) {
      var card = document.getElementById("art-file");
      card.style.height = null;
      if (file === null) {
        this.fileUrl = null;
        this.type = "Picture";
        card.style.height = "200px";
        return;
      }
      this.type =
        file.type.indexOf("video/") === 0
          ? "Video"
          : file.type.indexOf("image/") === 0
          ? "Picture"
          : file.type.indexOf("audio/") === 0
          ? "Music"
          : "Document";
      this.fileIcon =
        this.type === "Video"
          ? "movie"
          : this.type === "Picture"
          ? "photo"
          : this.type === "Music"
          ? "audiotrack"
          : "insert_drive_file";

      const reader = new FileReader();
      let that = this;
      reader.onload = function fileReadCompleted() {
        that.fileUrl = reader.result;
        // console.log(that.fileUrl);
      };
      reader.readAsDataURL(file);
    },
    fileRejected() {
      this.$q.notify({
        type: "negative",
        position: "top",
        message: "不支持上传此类型的文件，请重新选择",
        timeout: 2000,
      });
    },
    create() {
      let that = this;
      let form = new FormData();
      form.append("file", this.file);
      form.append("type", this.type);
      form.append("name", this.name);
      form.append("desc", this.desc);
      var config = {
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          that.uploadPercentage = percentCompleted;
        },
      };

      const dialog = this.$q.dialog({
        title: "上传艺术品",
        message: "上传中... 0%",
        progress: true,
        persistent: true, // we want the user to not be able to close it
        ok: false, // we want the user to not be able to close it
      });

      const interval = setInterval(() => {
        if (that.uploadPercentage >= 100) {
          dialog.update({
            message: `文件正存储入IPFS...`,
          });
        } else {
          dialog.update({
            message: `上传中... ${that.uploadPercentage}%`,
          });
        }
      }, 100);
      axios.post("/assets", form, config).then(
        (response) => {
          this.uploadPercentage = 0;
          this.file = null;
          this.fileUrl = null;
          this.name = null;
          this.desc = null;
          clearInterval(interval);

          if (response.status === 201) {
            dialog.update({
              title: "上传成功",
              message: `艺术品上传成功`,
              progress: false,
              ok: true,
            });
            //todo: OK后弹出这个框，点击OK应该去艺术品详情页
          }
        },
        (err) => {
          this.uploadPercentage = 0;
          clearInterval(interval);
          setTimeout(() => {
            dialog.hide();
          }, 350);
          this.$q.notify({
            type: "negative",
            position: "top",
            message: "上传失败",
            timeout: 2000,
          });
        }
      );
    },
    counterLabelFn({ totalSize }) {
      return `${totalSize}`;
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

  computed: {
    canCreate() {
      if (this.name === null || this.name === "") return false;
      else if (this.desc === null || this.desc === "") return false;
      else if (this.file === null) return false;
      else return true;
    },
  },
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

.upload-btn {
  line-height: 48px;
  padding: 0 40px;
  font-weight: 900;
}
</style>
