<template>
  <div class="dark:text-white geto-search-table">
    <div class="geto-tabs">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="所在系统">
          <el-select
            v-model="query.system"
            multiple
            clearable
            placeholder="所在系统"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in systems"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单据名称">
          <el-input
            v-model="query.form_name"
            placeholder="单据名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select
            v-model="query.task_status"
            multiple
            placeholder="任务状态"
            clearable
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in task_status"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否已读">
          <el-select v-model="query.is_read" clearable placeholder="是否已读">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in is_read"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="geto-table mt-2">
      <div class="table-title">
        <p>我的任务</p>
      </div>
      <div class="table-btn">
        <el-button @click="handleIgnore">忽略</el-button>
        <el-button @click="handleGoToDo">去办理</el-button>
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
        <el-table-column prop="system" label="所在系统" align="center" />
        <el-table-column prop="form_name" label="单据名称" align="center" />
        <el-table-column
          prop="form_status_name"
          label="单据状态"
          align="center"
        />
        <el-table-column prop="task_status" label="任务状态" align="center" />
        <el-table-column prop="is_read" label="是否已读" align="center" />
        <el-table-column prop="create_time" label="创建时间" align="center" />
        <el-table-column prop="done_time" label="已办时间" align="center" />
        <el-table-column prop="done_user" label="办理人" align="center" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getListPageConf,
  getList,
  ignore,
  goToDo
} from "@/geto-components/GetoMspPage/api/my-task";
import { message } from "@/utils/message";

defineOptions({
  name: "my_task"
});

// ------------------------------------------------------- 常量 -------------------------------------------------------
const table = ref(null);
const systems = ref([]);
const task_status = ref([]);
const is_read = ref([]);
const loading = ref(false);
const table_data = ref([]);
const current_page = ref(1);
const page_size = ref(10);
const total = ref(0);
const query = ref({
  system: "",
  form_name: "",
  task_status: "",
  is_read: "",
  page: current_page.value,
  page_size: page_size.value
});
// ------------------------------------------------------- 方法 -------------------------------------------------------
const onSearch = () => {
  loading.value = true;
  getList(query.value)
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
const handleIgnore = () => {
  const selections = table.value.getSelectionRows();
  if (selections.length != 1) {
    message("请选择一条数据进行操作", {
      type: "warning"
    });
    return;
  }
  ignore({
    main_code: selections[0].main_code
  }).then((res: any) => {
    message(res.data.msg, {
      type: "success"
    });
    onSearch();
  });
};
const handleGoToDo = () => {
  const selections = table.value.getSelectionRows();
  if (selections.length != 1) {
    message("请选择一条数据进行操作", {
      type: "warning"
    });
    return;
  }

  goToDo({
    main_code: selections[0].main_code
  }).then((res: any) => {
    onSearch();
    window.open(res.data.href, "_blank");
  });
};
// ------------------------------------------------------- 事件 --------------------------------------------------------
// 挂载
onMounted(() => {
  getListPageConf().then((res: any) => {
    task_status.value = res.data.task_status;
    is_read.value = res.data.is_read;
    systems.value = res.data.systems;
  });
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
