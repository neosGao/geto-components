<template>
  <div class="table-operate-bar clearfix">
    <el-row>
      <el-col :span="6">
        <table-operate-selected-bar :title="title" :listId="listId">
          <template v-slot:tableFunctionButton>
            <slot name="tableFunctionButton" />
          </template>
        </table-operate-selected-bar>
        <slot name="tableTips" />
      </el-col>
      <el-col :span="18">
        <div class="operate-button-bar">
          <!-- 功能按钮 -->
          <slot name="functionButton" ref="functionButton" />
        </div>
      </el-col>
    </el-row>
    <!--    <export-record-drawer ref="exportRecordDrawer" :listId="listId"></export-record-drawer>-->
  </div>
</template>

<script>
import TableOperateSelectedBar from "./TableOperateSelectedBar.vue";

export default {
  name: "TableOperateBar",
  props: {
    title: {
      type: String,
      default: ""
    },
    defaultOperateButton: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ""
    },
    // operates: null,
    tableColumns: null,
    listId: {
      type: String,
      default: ""
    },
    exportPermissionKey: {
      type: String,
      default: ""
    },
    exportSelectedExcel: {
      type: Boolean,
      default: true
    }
  },
  inject: ["reload"],
  data() {
    return {
      downloadLoading: false,
      canExport: false,
      operates: []
    };
  },
  components: {
    TableOperateSelectedBar
  },
  methods: {
    handleCommand(command) {
      this.$store.dispatch("app/changeTableSize", { command });
    },
    handleMoreCommand(command) {
      switch (command) {
        case "handleDelete":
          this.$emit("handleDelete", {
            selected: false,
            fileName: "this.title"
          });
          break;
        case "exportRecord":
          this.$emit("exportRecord", {});
          break;
      }
    },
    refresh() {
      this.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.table-operate-bar {
  margin: 0 20px;
  line-height: 45px;

  .operate-title {
    font-size: 16px;
    color: #929292;
  }

  .operate-button-bar {
    float: right;
    height: 46px;
    overflow-y: auto;

    .operate-dropdown {
      margin-left: 10px;
      line-height: 1px;

      .operate-button {
        font-size: 18px;
        color: #929292;
      }
    }

    .operate-button {
      font-size: 16px;
      color: #929292;
    }
  }

  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 0px;
    height: 0px;
  }
}
</style>
