<template>
  <q-page class="flex flex-center">
    <div v-for="asset in list" :key="asset.aid">
      <asset-card :asset="asset"></asset-card>
    </div>
  </q-page>
</template>

<script>
import axios from "src/utils/request.js";
import AssetCard from "components/AssetCard.vue";
export default {
  name: "PageIndex",
  components: {
    AssetCard,
  },
  data() {
    return {
      list: [],
    };
  },

  methods: {
    refresh() {
      axios
        .get("/market/assets", { params: { page: 1, num: 10 } })
        .then((response) => {
          this.list = response.data;
        });
    },
  },

  mounted: function () {
    this.refresh();
  },
};
</script>
