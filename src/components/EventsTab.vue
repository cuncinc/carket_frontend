<template>
  <q-card style="border-radius: 16px">
    <div v-if="list === null || list.length === 0">
      <q-img src="png/nothing.png" />
      <div>没有记录</div>
    </div>
    <q-table
      v-else
      :data="list"
      :columns="columns"
      row-key="eid"
      hide-bottom
      :pagination="initialPagination"
      :visible-columns="visibleColumns"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="type" :props="props" class="my-item my-type">
            <div>
              <q-icon :name="takeIcon(props.row.type)" size="24px" />
              {{ props.row.type }}
            </div>
          </q-td>
          <q-td key="asset" :props="props" class="my-item" style="width: 88px">
            <q-img
              v-if="props.row.assetType === 'Picture'"
              class="my-file"
              :src="props.row.ipfsLink"
              ratio="1"
            />
            <q-media-player
              v-else-if="props.row.assetType === 'Video'"
              type="video"
              :source="props.row.ipfsLink"
              no-controls
              muted
              radius="12px"
              style="height: 88px !important; width: 88px"
            />
            <q-media-player
              v-else-if="props.row.assetType === 'Music'"
              type="audio"
              :source="props.row.ipfsLink"
              no-controls
              radius="12px"
            />
          </q-td>
          <q-td key="amount" :props="props" class="my-item">
            <div>
              <q-icon
                v-if="props.row.amount !== null"
                name="img:svg/eth.svg"
                size="20px"
              />
              {{ props.row.amount }}
            </div>
          </q-td>
          <q-td key="from" :props="props" class="my-item my-user">
            <div v-if="props.row.fromName !== null">
              {{ props.row.fromName }}
              <q-tooltip v-if="props.row.from !== null">
                {{ props.row.from }}
              </q-tooltip>
            </div>
          </q-td>
          <q-td key="to" :props="props" class="my-item my-user">
            <div v-if="props.row.toName !== null">
              {{ props.row.toName }}
            </div>
            <q-tooltip v-if="props.row.to !== null">
              {{ props.row.to }}
            </q-tooltip>
          </q-td>
          <q-td key="time" :props="props" class="my-item">
            <q-btn flat to="/">
              {{ props.row.humanTime }}
              <q-icon
                class="my-time"
                v-if="props.row.txHash !== null"
                name="open_in_new"
                size="20px"
              />
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card>
</template>

<script>
export default {
  name: "EventsTab",
  props: {
    needAsset: String,
    list: Array,
  },
  data() {
    return {
      visibleColumns: ["type", "amount", "from", "to", "time"],
      initialPagination: {
        page: 1,
        rowsPerPage: 100,
      },
      columns: [
        {
          name: "type",
          required: true,
          label: "类型",
          align: "left",
          field: "type",
          sortable: true,
        },
        {
          name: "asset",
          label: "艺术品",
          field: "tokenId",
          sortable: true,
          align: "center",
        },
        {
          name: "amount",
          label: "价格",
          field: "amount",
          sortable: true,
          align: "right",
        },
        { name: "from", label: "From", field: "from", align: "right" },
        { name: "to", label: "To", field: "to", align: "right" },
        {
          name: "time",
          label: "时间",
          field: "timestamp",
          sortable: true,
          align: "right",
        },
      ],
    };
  },

  methods: {
    takeIcon(type) {
      if (type === "购买") return "shopping_cart";
      else if (type === "转让") return "swap_horiz";
      else if (type === "上架") return "store";
      else if (type === "下架") return "new_releases";
      else if (type === "手续费") return "attach_money";
      else if (type === "创作者费") return "payments";
      else if (type === "铸造") return "child_friendly";
      else if (type === "标价") return "price_change";
    },
  },

  created: function () {
    if (this.needAsset !== null && this.needAsset === "true") {
      this.visibleColumns.push("asset");
    }
  },
};
</script>

<style>
.my-item {
  font-size: 17px;
  font-weight: 600;
}

my-type {
  color: rgb(53, 56, 64);
}

.my-user {
  color: rgb(32, 129, 226);
  font-size: 18px !important;
}

.my-time {
  color: rgb(32, 129, 226);
}

.my-file {
  border-radius: 12px;
  width: 88px !important;
  height: 88px !important;
}
</style>
