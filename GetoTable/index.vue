<template>
  <div class="table-desc">
    <slot name="table-desc" />
  </div>
  <div class="geto-table">
    <div class="table-title">
      <slot name="title">
        <p>{{ title }}</p>
      </slot>
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
          <IconifyIconOffline class="refreshIcon" :icon="refresh" @click="refreshSearch" />
        </div>
        <div style="margin-top: 5px; margin-bottom: 5px" v-if="initDataConfig.useExport ?? true">
          <el-dropdown class="operate-dropdown" trigger="click" @command="handleMoreCommand">
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
    <div class="table-ohter">
      <slot name="tableOhter" />
    </div>
    <el-table
      v-bind="mergedAttrs"
      ref="getoTable"
      :data="tableData"
      v-loading="loading"
      border
      highlight-current-row
      @selection-change="handleSelectionChange"
      style="height: calc(100% - 90px)"
      @current-change="tableCurrentChange"
      @cell-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      header-cell-class-name="table-header"
      :row-class-name="handleTableRowClassName"
      :span-method="getSpanMethod"
      @expand-change="handleExpandOpen"
      :summary-method="props.initDataConfig.summaryMethod"
      :show-summary="props.initDataConfig.showSummary"
    >
      <el-table-column type="expand" fixed="left" v-if="props.initDataConfig.useExpand">
        <template v-slot="scope">
          <slot name="rowExpand" :scope="scope" />
        </template>
      </el-table-column>

      <el-table-column
        type="selection"
        prop="selection"
        width="50"
        align="center"
        fixed="left"
        v-if="props.initDataConfig.useSelection"
        :selectable="tableSelectable"
      />
      <el-table-column width="36" align="center" fixed="left" v-if="props.initDataConfig.useRadio">
        <template v-slot="{ row }">
          <el-radio-group v-model="row.radioCheck">
            <el-radio :label="true" size="large">
              <template v-slot>
                <span />
              </template>
            </el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column
        :width="props.initDataConfig.indexWidth ?? props.initDataConfig.useDrag ? 80 : 50"
        :label="props.initDataConfig.indexLabel ?? '#'"
        align="center"
        v-if="props.initDataConfig.useIndex"
        fixed="left"
        prop="index"
      >
        <template v-slot="scope">
          <div class="flex items-center justify-center">
            <iconify-icon-online
              v-if="props.initDataConfig.useDrag"
              icon="icon-park-outline:drag"
              class="drag-btn cursor-grab"
              @mouseenter.prevent="rowDrop"
            />
            <span class="ml-2">{{
              (localPageConfig.currentPage - 1) * localPageConfig.pageSize + scope.$index + 1
            }}</span>
          </div>
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
          v-if="!item.use_sub_headers && item.display"
        >
          <!-- 自定义表头 是否自定义表头 -->
          <template #header v-if="item?.headerSlot">
            <slot name="header" :row="row" :item="item" />
          </template>
          <template v-slot="{ row }" v-if="initDataConfig.use_slot ?? false">
            <!-- 打开插槽 -->
            <slot name="column" :row="row" :item="item" />
          </template>
          <template v-slot="{ row }" v-else-if="item.use_slot">
            <!-- 打开插槽 -->
            <slot name="column" :row="row" :item="item" />
          </template>
          <template v-slot="{ row, $index }" v-else-if="item.use_switch">
            <el-switch
              v-model="row[item.value]"
              :size="item.size ? item.size : 'default'"
              :disabled="row[`${item.value}Disabled`] ? row[`${item.value}Disabled`] : false"
              :active-text="item.activeText ? item.activeText : ''"
              :active-value="item.activeValue"
              :inactive-text="item.inactiveText ? item.inactiveText : ''"
              :inactive-value="item.inactiveValue"
              @change="value => handleSwitchChange(row, $index, item.value, value)"
              :before-change="props?.tableFunction?.beforeChange || (() => {})"
            />
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
          v-if="item.use_sub_headers && item.display"
        >
          <el-table-column
            align="center"
            v-for="(subHeader, subIndex) in item.sub_headers"
            :key="subIndex"
            :label="subHeader.label"
            :prop="subHeader.value"
          >
            <template v-slot="{ row }" v-if="initDataConfig.use_slot ?? false">
              <!-- 由前端配置全部使用插槽(用于批量处理需要插槽的情况) -->
              <slot name="column" :row="row" :item="item" />
            </template>
            <template v-slot="{ row }" v-else-if="item.use_slot">
              <!-- 打开插槽 -->
              <slot name="column" :row="row" :item="subHeader" />
            </template>
            <template v-slot="{ row }" v-else>
              <!-- 是否为可点击链接 -->
              <el-link
                type="primary"
                v-if="subHeader.link"
                @click="onHighLightClick(row, subHeader)"
                >{{ row[subHeader.value] }}</el-link
              >
              <span v-else>{{ row[subHeader.value] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </template>
      <!-- 业务操作栏 -->
      <slot name="operate_column" />
    </el-table>
    <el-pagination
      v-if="pagination"
      background
      style="float: right; margin-top: 5px; margin-right: 15px; margin-bottom: 5px"
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
import { ref, onMounted, nextTick, useAttrs, computed } from "vue";
import refresh from "@iconify-icons/ep/refresh"; //ep:refresh
import Menu from "@iconify-icons/ep/menu"; //ep:menu
import { cloneDeep } from "@pureadmin/utils";
import { http } from "@/utils/http";
// import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { message } from "@/utils/message";
import GetoExportDrawer from "../GetoExportDrawer/index.vue";
import { hasAuth } from "@/router/utils";
import { spanRules } from "@/geto-components/GetoUtils/merge";
import Sortable from "sortablejs";

defineOptions({
  name: "GetoTable",
  inheritAttrs: false // 防止父组件的属性被默认继承
});
const emits = defineEmits([
  "onLoad",
  "onHighLightClick",
  "selectionChange",
  "handleRowClick",
  "tableCurrentChange",
  "handleRowDblclick",
  "handleSwitchChange",
  "handleExpandOpen",
  "dragChange"
]); // 定义发射给父组件的事件
const props = defineProps({
  tableSelectable: {
    type: Function,
    default: () => {
      return true;
    }
  },
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
  },
  tableFunction: {
    type: Object,
    default: () => {}
  },
  pagination: {
    type: Boolean,
    default: true
  }
});

const tableSelectable = (row, index) => {
  return props.tableSelectable(row, index);
};

// 计算属性，根据 rowKey 的值返回不同的绑定对象
const rowKeyBinding = computed(() => {
  const rowKeys = row => {
    return row[props.initDataConfig.rowKey];
  };
  return props.initDataConfig.rowKey
    ? { "row-key": rowKeys, "expand-row-keys": expandedRowKeys.value }
    : {};
});
// 使用 `useAttrs` 传递父组件的属性
const attrs = useAttrs();
const mergedAttrs = computed(() => {
  return { ...attrs, ...rowKeyBinding.value };
});

const title = ref(props.initDataConfig.title ?? "列表");
const loading = ref(false);
const tableData = ref([]);
const page_conf = cloneDeep(props.page);
const searchParams = ref({
  ...props.initDataConfig.searchParams
});
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
const expandedRowKeys = ref([]);
const onCancelClick = () => {
  drawerView.value = false;
};

const getTableData = (method, url, data) => {
  if (method == "GET"||method == "get") {
    return http.request(method, url, { params: data });
  } else {
    return http.request(method, url, { data });
  }
};

const getTableDataInit = async (method, url, data) => {
  loading.value = true;
  let handleData = data;
  if (props.initDataConfig.customSearchParam) {
    handleData = {
      ...data,
      ...props.initDataConfig.customSearchParam(data)
    };
  }
  const res: any = await getTableData(method, url, handleData);
  loading.value = false;
  if (res.code != "0") return;
  // 列表赋值
  tableData.value = res.data.data || res.data;
  if (props.initDataConfig.customHandleResult) {
    tableData.value = props.initDataConfig.customHandleResult(res.data.data);
  }
  localPageConfig.value.currentPage = res.data.current_page;
  localPageConfig.value.total = res.data.total;
  if (props.initDataConfig?.span_merge) {
    if (!res.data.span_arr) {
      spanArr.value = spanRules([props.initDataConfig?.span_merge?.key], tableData.value);
    } else {
      spanArr.value = res.data.span_arr;
      // console.log("spanArr", spanArr.value);
    }
  }
  emits("onLoad", {
    data: tableData.value,
    params: handleData,
    responseData: res.data
  });
};

// 合并行
const spanArr: any = ref([]);
//合并方法
const getSpanMethod = value => {
  if (props.initDataConfig?.span_merge) {
    if ("method" in props.initDataConfig.span_merge) {
      return props.initDataConfig.span_merge.method(value, spanArr.value);
    }
    return spanMethod(value);
  }

  return () => {};
};
const spanMethod = ({ column, rowIndex }) => {
  if (spanArr.value.length === 0) return;
  const arr = props.initDataConfig?.span_merge.merge_column;
  if (arr.includes(column.property)) {
    if (spanArr.value[rowIndex]) {
      return {
        rowspan: spanArr.value[rowIndex],
        colspan: 1
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
};

// 行class设置
const handleTableRowClassName = ({ row, rowIndex }) => {
  if (props?.tableFunction?.tableRowClassName) {
    return props.tableFunction.tableRowClassName({ row, rowIndex });
  }
  return "";
};

const selectionRows = ref([]);

const handleSelectionChange = selection => {
  selectionRows.value = selection;
  // console.log("searchParams", props.initDataConfig);
  emits("selectionChange", selection);
};
const onHighLightClick = (row, item) => {
  emits("onHighLightClick", row, item);
};
const handleRowClick = (row, column, event) => {
  if (props.initDataConfig?.useRadio) {
    tableData.value.forEach(item => {
      item.radioCheck = false;
    });
    row.radioCheck = true;
  }
  emits("handleRowClick", row, column, event);
};
const tableCurrentChange = val => {
  emits("tableCurrentChange", val);
};
const handleRowDblclick = (row, column, event) => {
  emits("handleRowDblclick", row, column, event);
};

const handleExpandOpen = (row: any, expand: any) => {
  let is_open = true;
  if (props.initDataConfig.rowKey) {
    const key = props.initDataConfig.rowKey;
    const index = expandedRowKeys.value.indexOf(row[key]);
    if (index != -1) {
      is_open = false;
      expandedRowKeys.value.splice(index, 1);
    } else {
      expandedRowKeys.value.push(row[key]);
    }
  }
  emits("handleExpandOpen", row, expand, is_open);
};

const handleSwitchChange = (row, index, key, value) => {
  emits("handleSwitchChange", row, index, key, value);
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
const onClickSearch = (data, otherObj = {}) => {
  searchParams.value = cloneDeep(data.value);
  localPageConfig.value.currentPage = 1;
  const params = {
    ...localPageConfig.value,
    ...data?.value,
    ...otherObj
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

const getoTable = ref(null);

const toggleRowExpansion = (row, expanded) => {
  getoTable.value.toggleRowExpansion(row, expanded);
};

const doLayout = () => {
  getoTable.value.doLayout();
};

const rowDrop = () => {
  nextTick(() => {
    const wrapper: HTMLElement = document.querySelector(".el-table__body-wrapper tbody");
    Sortable.create(wrapper, {
      animation: 300,
      handle: ".drag-btn",
      onEnd: ({ newIndex, oldIndex }) => {
        const currentRow = tableData.value.splice(oldIndex, 1)[0];
        tableData.value.splice(newIndex, 0, currentRow);

        emits("dragChange", newIndex, oldIndex, tableData.value);
      }
    });
  });
};

const setSearchParams = () => {
  searchParams.value = {
    ...searchParams.value,
    ...localPageConfig.value,
    ...props.initDataConfig.searchParams
  };
  console.log(888, searchParams.value);
};

onMounted(() => {
  if (!localInitData.value.url) {
    message("请传入列表请求的url", { type: "warning" });
    return;
  }
  const params = {
    ...localPageConfig.value,
    ...localInitData.value.data,
    ...localInitData.value.searchParams
  };

  if (!localInitData.value.disAutoSearch) {
    getTableDataInit(localInitData.value.method, localInitData.value.url, params);
  }
});
defineExpose({
  searchParams,
  // 暴露出子组件方法
  onClickSearch,
  toggleRowExpansion,
  doLayout,
  getoTable,
  tableData,
  refreshSearch,
  tableSelectable,
  setSearchParams
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
  .table-ohter {
    float: left;
    margin-top: 5px;
    margin-right: 10px;
    margin-left: 10px;
  }

  .table-desc {
    float: left;
    min-height: 100px;
    margin-top: 5px;
    margin-left: 200px;
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
