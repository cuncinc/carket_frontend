<template>
  <div class="row q-col-gutter-lg q-px-lg show-tab">
    <div v-if="list.length === 0">
      <q-img src="png/nothing.png" />
      <div>没有任何东西</div>
    </div>
    <div v-else v-for="asset in list" :key="asset.aid">
      <asset-card :asset="asset"></asset-card>
    </div>
  </div>
</template>

<script>
import AssetCard from "components/AssetCard.vue";
export default {
  name: "AssetTab",
  components: {
    AssetCard,
  },
  props: {
    list: Array,
  },
  data() {
    return {};
  },

  methods: {},

  mounted: function () {
    console.log(this.$props.list);
  },
};
</script>

<style>
.show-tab {
  width: 100%;
  margin-top: 4px;
  margin-bottom: 20px;
  margin-left: 4px;
  margin-right: 4px;
}
</style>
