<template>
  <div class="dark:text-white">
    <!-- drawerSize参数整合到formConfig中 -->
    <el-drawer
      v-model="drawer"
      @close="onCancel"
      :size="props?.drawerSize || '30%'"
    >
      <template #header>
        <h4>{{ props.title }}</h4>
      </template>
      <template #default>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          header-cell-class-name="table-header"
          :loading="re_loading"
        >
          <el-table-column prop="id" align="center" label="序号" width="55">
            <template v-slot="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="finish_time" align="center" label="导出时间" />
          <el-table-column prop="status_name" align="center" label="状态" />
          <el-table-column align="center" label="操作">
            <template v-slot="scope">
              <el-button
                text
                :loading="loading"
                v-if="loading && scope.$index == 0"
                >{{ scope.row.status < 2 ? "导出中" : "" }}</el-button
              >
              <el-link
                :underline="false"
                type="primary"
                :href="scope.row.download_url"
                v-else-if="scope.row.can_download == 1"
              >
                下载</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="handleRefresh"> 刷新 </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { exportExcelList } from "./../GetoApi/taks";
defineOptions({
  name: "GetoExportDrawer"
});
const emits = defineEmits(["onCancelClick"]); // 定义发射给父组件的事件
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  drawerSize: {
    type: String,
    default: ""
  },
  view: {
    type: Boolean,
    default: false
  },
  task_class: {
    type: String,
    default: ""
  }
});
const drawer = ref(props.view);
const onCancel = () => {
  emits("onCancelClick");
  drawer.value = false;
};
// --------------------------------------------------------------导出列表部分开始-----------------------------------------------------------------
const re_loading = ref(false);
const tableData = ref([]);
const loading = ref(false);
const timeOut = ref(null);
const search = () => {
  loading.value = true;
  const opearteFunction = exportExcelList; //record为请求方法
  opearteFunction({
    class: props.task_class //暂时假定是从props传入
  })
    .then(response => {
      tableData.value = response.data;
      if (tableData.value.length < 1) {
        return false;
      }
      if (
        !tableData.value[0].can_download &&
        (tableData.value[0].status == 0 || tableData.value[0].status == 1)
      ) {
        timeOut.value = setTimeout(search, 1500);
      }
    })
    .finally(() => {
      if (tableData.value[0]?.can_download || tableData.value[0]?.status == 4) {
        loading.value = false;
      }
      re_loading.value = false;
    });
};
const handleDownload = (params, method = "select") => {
  // 导出请求方法
  const query = {
    ...params.params.searchParams
  };
  if (method === "select") {
    // 选中导出
    const ids = [];
    params.params.rows.forEach(item => {
      ids.push(item.id);
    });
    query["ids"] = ids;
  }

  const exportFunc = params.export_func;
  exportFunc(query).then(() => {
    // 调用导出列表查询方法
    search();
  });
};
const handleRefresh = async () => {
  re_loading.value = true;
  await search();
  ElMessage({ showClose: true, message: "已刷新", type: "success" });
};
const exportExcel = params => {
  // 导出全部
  handleDownload(params, "all");
};
const exportSelectedExcel = params => {
  // 导出选中
  handleDownload(params, "select");
};
const exportRecord = () => {
  // 打开导出列表
  search();
};
const show = () => {
  drawer.value = true;
  search();
};
// --------------------------------------------------------------导出列表部分结束-----------------------------------------------------------------
defineExpose({
  // 暴露出子组件方法
  exportExcel,
  exportSelectedExcel,
  exportRecord,
  show
});
watch(props, val => {
  drawer.value = val.view;
});
</script>
