<template>
  <div class="dark:text-white geto-search-table">
    <div class="geto-tabs">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="query.title" placeholder="标题" clearable />
        </el-form-item>
        <el-form-item label="系统升级时间">
          <el-date-picker
            v-model="query.create_time"
            type="datetimerange"
            placeholder="系统升级时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="geto-table mt-2">
      <div class="table-title">
        <p>系统公告</p>
      </div>
      <el-table
        ref="table"
        :data="table_data"
        border
        header-cell-class-name="table-header"
        style="height: calc(100% - 90px)"
        highlight-current-row
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="#" width="70" align="center">
          <template v-slot="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template v-slot="scope">
            <el-link type="primary" @click="handleInfo(scope.row)">{{
              scope.row.title
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="是否已读" align="center" width="100">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.is_read">已读</el-tag>
            <el-tag type="danger" v-else>未读</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="系统升级时间"
          align="center"
        />
      </el-table>
      <el-pagination
        class="table-pagination"
        v-model:current-page="current_page"
        v-model:page-size="page_size"
        :page-sizes="[10, 20, 30, 40]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="公告详情"
      v-model="dialog"
      width="70%"
      @close="closeDialog"
    >
      <div v-html="content" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getAnnouncementList,
  announcementRead
} from "@/geto-components/GetoMspPage/api/workbench";

defineOptions({
  name: "my_task"
});

// ------------------------------------------------------- 常量 -------------------------------------------------------
const table = ref(null);
const loading = ref(false);
const table_data = ref([]);
const current_page = ref(1);
const page_size = ref(10);
const total = ref(0);
const query = ref({
  title: "",
  is_read: "",
  create_time: "",
  page: current_page.value,
  page_size: page_size.value
});
const dialog = ref(false);
const content = ref("");
// ------------------------------------------------------- 方法 -------------------------------------------------------
const onSearch = () => {
  loading.value = true;
  getAnnouncementList(query.value)
    .then((res: any) => {
      table_data.value = res.data.data;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleSizeChange = (val: any) => {
  query.value.page_size = val;
  onSearch();
};
const handleCurrentChange = (val: any) => {
  query.value.page = val;
  onSearch();
};
const handleInfo = (row: any) => {
  content.value = "";
  dialog.value = true;
  content.value = row.content;
  announcementRead({ id: row.id });
};
const closeDialog = () => {
  onSearch();
};
// ------------------------------------------------------- 事件 --------------------------------------------------------
// 挂载
onMounted(() => {
  onSearch();
});
</script>

<style scoped>
:deep(.el-tabs__content) {
  overflow: unset;
}
.geto-tabs {
  padding: 15px 10px 0px 10px;
  background-color: #fff;
  position: relative;
  .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
}
.geto-table {
  margin-top: 10px;
  background-color: #fff;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 4px;
  flex: 1;
  height: 500px;
  .table-title {
    float: left;
    margin-top: 5px;
  }

  .table-btn {
    float: right;
    margin-bottom: 10px;
  }

  .table-pagination {
    float: right;
    margin-top: 5px;
  }

  .refreshIcon {
    position: relative;
    font-size: 20px;
    cursor: pointer;
    color: #929292;
    transition: transform 0.5s;
    &:hover {
      transform: rotate(180deg);
      color: rgb(59 130 246);
    }
  }
  .menuIcon {
    position: relative;
    font-size: 20px;
    cursor: pointer;
    color: #929292;
    &:hover {
      color: rgb(59 130 246);
    }
  }
  .table-header {
    background-color: rgb(250, 250, 250) !important;
    color: #000000;
  }
}
</style>
