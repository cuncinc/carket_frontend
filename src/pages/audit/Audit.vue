<template>
  <q-page-container class="sc-design">
    <q-list>
      <q-item v-for="audit in todoAudits" :key="audit.aid" clickable="false">
        <q-card style="padding: 8px; width: 50%">
          <q-item-section>
            <q-avatar>
              <q-img :src="audit.avatarLink" ratio="1" class="placeholder" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ audit.creatorName }} </q-item-label>
            <q-item-label
              ><strong>{{ audit.name }}</strong></q-item-label
            >
            <q-item-label>{{ audit.desc }}</q-item-label>
            <q-item-label>{{ audit.time }}</q-item-label>
            <!-- <q-chip dense color="secondary" text-color="white">
              {{ audit.label }}
            </q-chip> -->
          </q-item-section>
          <q-item-section style="height: 210px; width: 280px">
            <q-img v-if="audit.type === 'Picture'" :src="audit.link" />
            <q-media-player
              v-else-if="audit.type === 'Video'"
              type="video"
              background-color="black"
              hide-settings-btn
              hide-volume-btn
              :autoplay="false"
              :show-big-play-button="true"
              :source="audit.link"
            />
            <q-media-player
              class="placeholder"
              v-else-if="audit.type === 'Music'"
              type="audio"
              :autoplay="false"
              hide-settings-btn
              hide-volume-btn
              :show-big-play-button="true"
              :source="audit.link"
            />
          </q-item-section>
          <q-item-section>
            <div v-if="audit.state === '待审核'">
              <q-btn
                dense
                rounded
                unelevated
                color="teal"
                padding="sm lg"
                label="通过"
                @click="pass(audit.aid)"
              />
              <q-btn
                dense
                rounded
                unelevated
                padding="sm lg"
                color="negative"
                label="拒绝"
                @click="toReject(audit.aid)"
              />
            </div>
            <q-chip
              v-else-if="audit.state === '已通过'"
              color="positive"
              text-color="white"
              icon="check_circle"
            >
              已通过
            </q-chip>
            <q-chip
              v-else-if="audit.state === '未通过'"
              color="red"
              text-color="white"
              icon="cancel"
            >
              已拒绝
            </q-chip>
          </q-item-section>
        </q-card>
      </q-item>
    </q-list>
    <q-dialog v-model="rejecting">
      <q-card square style="width: 600px">
        <q-toolbar>
          <q-toolbar-title class="text-body1">拒绝原因</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <div class="q-px-md">
          <form @submit.prevent.stop="onSubmit">
            <div class="q-gutter-sm q-ma-sm">
              <q-item-label> 原因 </q-item-label>
              <q-input
                ref="ruleName"
                placeholder="请输入"
                outlined
                v-model="reason"
                dense
                square
                :rules="[(val) => (val && val.length > 0) || '请输入拒绝原因']"
                clearable
              >
              </q-input>
            </div>
            <div class="q-gutter-sm q-ma-sm q-mb-lg">
              <q-btn
                unelevated
                rounded
                type="submit"
                label="提交"
                color="primary"
              />
            </div>
          </form>
        </div>
      </q-card>
    </q-dialog>
  </q-page-container>
</template>

<script>
import axios from "src/utils/request.js";
import colorUtil from "src/utils/color.js";

const auditData = [
  {
    creator: "0x9a00017ef8dfb9ddfd707f717ac138fca50800a1",
    avatarLink:
      "http://175.178.118.201:8998/avatar/c580cf937733fe99cc65d655cad2a663.jpg",
    name: "证入周次题技亲交号相共三水。",
    link: "http://175.178.118.201:8998/assets/f99008393251531468e7e5dd26832488.png",
    creatorName: "chunson",
    time: "3月20日 18:13:33",
    label: "file",
    type: "Picture",
    aid: "12",
    state: "待审核",
    desc: "出个新和下者得并现知许验素建然。众小因系器研正养机那理织。认部严部前目较的军越们华用。太内家化满如养党证已参准。",
  },
  {
    creator: "0xe7c7b43bc48fddec0fa21e2c282cbe1265ca5cae",
    avatarLink:
      "http://175.178.118.201:8998/avatar/ef208890398816a505b8d0840b1e34c9.jpg",
    name: "温你约斯组加把保厂量流百家酸而采交会。",
    link: "http://175.178.118.201:8998/assets/cda1ee4d4082491c0ce5bf0da3ff0724.mp4",
    creatorName: "me",
    time: "3月20日 18:14:55",
    label: "file",
    type: "Video",
    aid: "15",
    state: "已通过",
    desc: "清将形论片可金文二之放经资长育命张。器特意社们时回情保各新响公。除文局高百问对根将按我级还法次分立平。属家习者数干土报划战边行米面报具安交。周专部快手史再和长世时政。公离属只当许路际花代些力农新口性出。发情识法叫党适厂重我应规史张。",
  },
];

export default {
  name: "Audit",
  data() {
    return {
      todoAudits: auditData,
      rejecting: false,
      rejectAid: null,
      reason: null,
    };
  },
  methods: {
    randomColor() {
      console.log(colorUtil.randomColor());
      return colorUtil.randomColor();
    },
    toReject(aid) {
      console.log("toReject");
      this.rejectAid = aid;
      this.rejecting = true;
    },
    pass(aid) {
      axios
        .post("/audits", [{ aid: aid, state: "已通过" }])
        .then((response) => {
          let asset = this.todoAudits.find((x) => x.aid === aid);
          console.log(asset);
          asset.state = "已通过";
        });
    },
    reject() {
      console.log("reject");
      let aid = this.rejectAid;
      this.rejectAid = null;
      axios
        .post("/audits", [{ aid: aid, state: "未通过", reason: this.reason }])
        .then((response) => {
          let asset = this.todoAudits.find((x) => x.aid === aid);
          console.log(asset);
          asset.state = "未通过";
        });
    },
    onSubmit() {
      console.log("onSubmit");
      this.reject();
      this.rejecting = false;
    },
  },
  created() {
    console.log("before mount");
    axios
      .get("/audits/todo", {
        params: {
          //   page: this.pagination.page,
          //   num: this.pagination.rowsPerPage,
          page: 1,
          num: 100,
        },
      })
      .then((response) => {
        console.log(response.data);
        this.todoAudits = response.data;
      });
  },
  computed: {},
};
</script>
