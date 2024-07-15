<template>
  <div>
    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%"
      :height="height"
      border
      highlight-current-row
      fit
      header-cell-class-name="table-header"
      @selection-change="handleSelectionChange"
      @expand-change="handleExpandChange"
    >
      <slot />
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        background
        class="pagination-wrapper"
      />
    </div>
  </div>
</template>

<script>
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
export default {
  data() {
    return {
      tableData: [],
      totalNum: 0,
      searchParams: {},
      selectedRow: [],
      type: "",
      page: 1,
      page_size: 10
    };
  },
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    searchFunc: {
      type: Function
    },
    height: {
      type: Number,
      default: 250
    }
  },
  created() {
    this.type = "assistedMaterialList";
    emitter.off(this.type + "-SimplicityTableSearch");
    emitter.on(this.type + "-SimplicityTableSearch", () => {
      this.page = 1;
      this.page_size = 10;
      this.search();
    });
    this.search();
  },
  mounted() {
    emitter.on("clearSelectedStatus", () => {
      this.$refs.table.clearSelection();
    });
  },
  computed: {
    selectedIds() {
      const ids = [];
      for (const index in this.selectedRow) {
        ids.push(this.selectedRow[index].id);
      }
      return ids;
    }
  },
  methods: {
    handleExpandChange(expandedRows) {
      emitter.emit("expandChange", expandedRows);
    },
    handleSelectionChange(row) {
      this.selectedRow = row;
      emitter.emit("selectionChange", row);
    },
    handleCurrentChange(page) {
      this.page = page;
      this.search();
    },
    handleSizeChange(val) {
      this.page_size = val;
      this.search();
    },
    search() {
      const params = this.params;
      params.page = this.page;
      params.page_size = this.page_size;
      this.searchFunc(params).then(response => {
        console.log(response.data.data);
        this.tableData = response.data.data;
        this.totalNum = response.data.total;
      });
    }
  }
};
</script>

<style>
.pagination-wrapper {
  float: right;
  margin: 5px 0px;
}
</style>
