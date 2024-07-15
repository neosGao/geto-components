<template>
  <div class="geto-table">
    <div class="table-title">
      <p>{{ title }}</p>
    </div>
    <div class="table-btn">
      <el-row>
        <slot name="button-row" />
        <div
          style="
            border-left: 2px solid #ccc;
            margin-top: 5px;
            margin-bottom: 5px;
            margin-right: 10px;
            margin-left: 20px;
            padding-left: 15px;
          "
        >
          <IconifyIconOffline
            class="refreshIcon"
            :icon="refresh"
            @click="refreshSearch"
          />
        </div>
        <div
          style="margin-top: 5px; margin-bottom: 5px"
          v-if="initDataConfig.useExport ?? true"
        >
          <el-dropdown
            class="operate-dropdown"
            trigger="click"
            @command="handleMoreCommand"
          >
            <IconifyIconOffline class="menuIcon" :icon="Menu" />
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <slot name="dropdownSlotMenuItem" />
                <el-dropdown-item
                  command="exportExcel"
                  v-if="hasAuth(props.initDataConfig.export_permission)"
                  >导出全部</el-dropdown-item
                >
                <el-dropdown-item
                  command="exportSelectedExcel"
                  v-if="hasAuth(props.initDataConfig.export_permission)"
                  >导出选中</el-dropdown-item
                >
                <el-dropdown-item
                  command="exportRecord"
                  v-if="hasAuth(props.initDataConfig.export_permission)"
                  >导出记录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      highlight-current-row
      @selection-change="handleSelectionChange"
      style="height: calc(100% - 90px)"
      @cell-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      @expand-change="handleExpandChange"
      header-cell-class-name="table-header"
    >
      <el-table-column
        type="expand"
        fixed="left"
        v-if="props.initDataConfig.useExpand"
      >
        <template v-slot="scope">
          <slot name="rowExpand" :scope="scope" />
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="50"
        align="center"
        fixed="left"
        v-if="props.initDataConfig.useSelection"
      />
      <el-table-column
        width="50"
        label="#"
        align="center"
        v-if="props.initDataConfig.useIndex"
      >
        <template v-slot="scope">
          <span>{{
            (localPageConfig.currentPage - 1) * localPageConfig.pageSize +
            scope.$index +
            1
          }}</span>
        </template>
      </el-table-column>
      <template v-for="(item, index) in props.config" :key="index">
        <!-- 非多级表头 -->
        <el-table-column
          align="center"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed || null"
          v-show="item.display"
          show-overflow-tooltip
          v-if="!item.useHeaders && item.display"
        >
          <template v-slot="{ row }" v-if="item.use_slot">
            <!-- 打开插槽 -->
            <slot name="column" :row="row" :item="item" />
          </template>
          <template v-slot="{ row }" v-else>
            <!-- 是否为可点击链接 -->
            <el-link
              type="primary"
              v-if="item.link && hasAuth(props.initDataConfig.info_permission)"
              @click="onHighLightClick(row, item)"
              >{{ row[item.value] }}</el-link
            >
            <span v-else>{{ row[item.value] }}</span>
          </template>
        </el-table-column>
        <!-- 多级表头部分(内容部分插槽一致) -->
        <el-table-column
          align="center"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed || null"
          v-show="item.display"
          v-if="item.useHeaders && item.display"
        >
          <el-table-column
            align="center"
            v-for="(subHeader, subIndex) in item.subHeaders"
            :key="subIndex"
            :label="subHeader.label"
            :prop="subHeader.prop"
          >
            <template v-slot="{ row }" v-if="item.use_slot">
              <!-- 打开插槽 -->
              <slot name="column" :row="row" :item="item" />
            </template>
            <template v-slot="{ row }" v-else>
              <!-- 是否为可点击链接 -->
              <el-link
                type="primary"
                v-if="item.link"
                @click="onHighLightClick(row, item)"
                >{{ row[item.value] }}</el-link
              >
              <span v-else>{{ row[item.value] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </template>
      <!-- 业务操作栏 -->
      <slot name="operate_column" />
    </el-table>
    <el-pagination
      background
      style="
        float: right;
        margin-top: 5px;
        margin-right: 15px;
        margin-bottom: 5px;
      "
      :current-page="localPageConfig.currentPage"
      :page-size="localPageConfig.pageSize"
      :page-sizes="localPageConfig.pageSizesArr"
      layout="total, sizes, prev, pager, next, jumper"
      :total="localPageConfig.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <GetoExportDrawer
      ref="GetoExport"
      :title="drawerTitle"
      :view="drawerView"
      :task_class="props.initDataConfig.task_class"
      @onCancelClick="onCancelClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import refresh from "@iconify-icons/ep/refresh"; //ep:refresh
import Menu from "@iconify-icons/ep/menu"; //ep:menu
import { cloneDeep } from "@pureadmin/utils";
import { http } from "@/utils/http";
// import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { message } from "@/utils/message";
import GetoExportDrawer from "@/geto-components/GetoExportDrawer/index.vue";
import { listData } from "@/api/logApi";
import { hasAuth } from "@/router/utils";

defineOptions({
  name: "GetoTable"
});
const emits = defineEmits([
  "onHighLightClick",
  "selectionChange",
  "handleRowClick",
  "handleRowDblclick",
  "handleExpandChange"
]); // 定义发射给父组件的事件

const props = defineProps({
  config: {
    type: Array<any>,
    default: () => []
  },
  page: {
    type: Object,
    default: () => {}
  },
  initDataConfig: {
    type: Object,
    default: () => {}
  }
});

const title = ref(props.initDataConfig.title ?? "列表");
const loading = ref(false);
const tableData = ref([]);
const page_conf = cloneDeep(props.page);
const searchParams = ref({});
const localPageConfig = ref({
  currentPage: page_conf.currentPage ?? 1,
  pageSize: page_conf.pageSize ?? 10,
  pageSizesArr: page_conf.pageSizesArr ?? [10, 20, 30, 40, 50],
  total: page_conf.total ?? 0
});
const localInitData = ref(cloneDeep(props.initDataConfig));
const drawerTitle = ref("导出列表");
const drawerView = ref(false);
const GetoExport = ref(null);
const onCancelClick = () => {
  drawerView.value = false;
};

const getTableData = (method, url, data) => {
  return http.request(method, url, { data });
};

const getTableDataInit = async (method, url, data) => {
  loading.value = true;
  const res: any = await getTableData(method, url, data);
  // const res: any = listData;
  loading.value = false;
  if (res.code != "0") return;
  // 列表赋值
  tableData.value = res.data.data;
  localPageConfig.value.currentPage = res.data.current_page;
  localPageConfig.value.total = res.data.total;
};

const selectionRows = ref([]);

const handleSelectionChange = selection => {
  selectionRows.value = selection;
  emits("selectionChange", selection);
};
const onHighLightClick = (row, item) => {
  emits("onHighLightClick", row, item);
};
const handleRowClick = (row, column, event) => {
  emits("handleRowClick", row, column, event);
};
const handleRowDblclick = (row, column, event) => {
  emits("handleRowDblclick", row, column, event);
};
const handleExpandChange = (row, expanded) => {
  emits("handleExpandChange", row, expanded);
};
const handleSizeChange = (val: number) => {
  // 选择了pageSize
  localPageConfig.value.currentPage = 1;
  localPageConfig.value.pageSize = val;
  const params = {
    ...localPageConfig.value,
    ...searchParams.value
  };
  getTableDataInit(localInitData.value.method, localInitData.value.url, params);
};
const handleCurrentChange = (val: number) => {
  localPageConfig.value.currentPage = val;
  const params = {
    ...localPageConfig.value,
    ...searchParams.value
  };
  getTableDataInit(localInitData.value.method, localInitData.value.url, params);
};
// 点击查询的事件
const onClickSearch = data => {
  searchParams.value = cloneDeep(data.value);
  localPageConfig.value.currentPage = 1;
  const params = {
    ...localPageConfig.value,
    ...data?.value
  };
  getTableDataInit(localInitData.value.method, localInitData.value.url, params);
};
const refreshSearch = () => {
  const params = {
    ...localPageConfig.value,
    ...searchParams?.value
  };
  getTableDataInit(localInitData.value.method, localInitData.value.url, params);
};
const handleMoreCommand = command => {
  // 触发command对应事件
  if (command === "exportSelectedExcel" && selectionRows.value.length === 0) {
    message("请勾选需要导出的数据", { type: "warning" });
    return;
  }
  const parmas = {
    params: {
      rows: selectionRows.value,
      searchParams: searchParams.value
    },
    export_func: props.initDataConfig.export_func
  };
  GetoExport.value[command](parmas);
  // emitter.emit(command, parmas);
  drawerView.value = true;
};
onMounted(() => {
  if (!localInitData.value.url) {
    message("请传入列表请求的url", { type: "warning" });
    return;
  }
  const params = {
    ...localPageConfig.value,
    ...localInitData.value.data
  };
  getTableDataInit(localInitData.value.method, localInitData.value.url, params);
});
defineExpose({
  // 暴露出子组件方法
  onClickSearch
});
</script>

<style lang="scss" scoped>
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
    // margin-left: 10px;
    margin-top: 5px;
  }

  .table-btn {
    float: right;
    margin-bottom: 10px;
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
