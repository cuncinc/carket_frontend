<template>
  <q-card
    flat
    v-ripple
    class="show-card my-box cursor-pointer q-hoverable"
    @click="onCardClicked"
  >
    <span class="q-focus-helper"></span>
    <q-card-section>
      <div class="asset-file">
        <q-img
          v-if="asset.type === 'Picture'"
          class="asset-file"
          :src="asset.link"
        />
        <q-media-player
          v-else-if="asset.type === 'Video'"
          type="video"
          :source="asset.link"
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
          :source="asset.link"
          :autoplay="false"
          hide-settings-btn
          hide-volume-btn
          style="height: 160px"
          radius="12px"
          dense
        />
      </div>
      <q-item-label class="show-name">{{ asset.name }}</q-item-label>
      <div class="row" style="align-items: center; margin-top: 8px">
        <div class="row show-price q-gutter-sm">
          <q-icon name="img:svg/eth.svg" />
          <div v-if="asset.state === '在流通'">{{ asset.price }}</div>
          <div v-else>--</div>
        </div>
        <q-space />
        <q-chip color="positive" text-color="white" style="margin-end: 12px">
          {{ asset.state }}
        </q-chip>
        <q-btn color="gray" round flat icon="more_horiz">
          <q-menu anchor="bottom right" self="top left">
            <q-list style="min-width: 100px"> </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "AssetCard",
  props: { asset: Object },
  data() {
    return {};
  },

  methods: {
    onCardClicked() {
      this.$router.push({
        path: "/assets/" + this.asset.aid,
      });
    },
  },
};
</script>

<style>
.show-card {
  border-radius: 12px;
  border: 1.5px solid rgba(22, 22, 26, 0.08);
  background-color: #f9f9f9;
}

.asset-file {
  border-radius: 12px;
  width: 300px !important;
  min-height: 100px;
  max-height: 800px;
}

.show-name {
  font-size: 17px;
  line-height: 22px;
  font-weight: 700;
  letter-spacing: 1px;
  text-align: left;
  margin-top: 12px;
  max-width: 300px;
}

.show-price {
  font-size: 27px;
  font-weight: 600;
  align-items: center;
}
</style>
