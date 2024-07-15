<template>
  <div class="table-selected-bar clearfix">
    <el-row>
      <el-col :span="16">
        <div class="selected-title">
          已选择
          <span class="selected-number">{{ selected }}</span>
          项 {{ describe }}
        </div>
        <span v-show="selected">
          <slot name="tableFunctionButton" />
          <el-button
            type="text"
            class="operate-button"
            @click="handelClear"
            v-show="selected > 0"
          >
            <span class="right-icon">
              <svg-icon icon-class="clear" />
            </span>
            清除
          </el-button>
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { dataPermission } from "@/geto-components/GetoMspPage/api/base/data-permission";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理

export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    describe: {
      type: String,
      default: ""
    },
    listId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selected: 0,
      dataPermission: [],
      loading: false
    };
  },
  mounted() {
    emitter.on("selectionChange", response => {
      this.selected = response.length;
    });
  },
  methods: {
    handelClear() {
      emitter.emit("clearSelectedStatus");
    },
    handleShow() {
      this.dataPermission = [];
      this.loading = true;
      // dataPermission({
      //   list_id: this.listId
      // })
      //   .then(response => {
      //     this.dataPermission = [];
      //     this.dataPermission = response.data;
      //   })
      //   .finally(() => {
      //     this.loading = false;
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-selected-bar {
  .title {
    display: block;
    margin-right: 20px;
    height: 46px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  line-height: 40px;
  border-radius: 4px;

  .selected-title {
    font-size: 14px;
    color: #929292;
  }

  .selected-number {
    color: rgb(24, 144, 255);
  }

  .selected-button {
    float: right;
    font-size: 14px;
    color: rgb(24, 144, 255);
  }

  .operate-button {
    font-size: 14px;
    color: #929292;
    margin-left: 10px;
  }

  .operate-button:hover {
    color: #409eff;
  }

  .right-icon {
    margin-right: 0px;
  }
}

.data-title {
  min-height: 60px;
  max-height: 300px;
  overflow-y: scroll;
}

.role {
  color: #409eff;
}
</style>
