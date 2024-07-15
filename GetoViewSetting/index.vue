<template>
  <div class="geto-view-setting">
    <el-row @click="viewOnclick" style="cursor: pointer">
      <IconifyIconOffline :icon="setting" />
      <p style="position: relative; top: -5px" />
    </el-row>
    <el-dialog v-model="dialogVisible" title="自定义视图" width="80%">
      <template #default>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-link
              type="primary"
              @click="openViewEdit('new')"
              style="float: right"
              >新增视图</el-link
            >
            <el-table
              :data="viewTableData"
              style="width: 100%"
              :show-header="false"
              row-key="id"
              class="viewTable"
              :key="viewKeys"
            >
              <el-table-column width="30">
                <IconifyIconOffline :icon="expand" class="allowDrag" />
              </el-table-column>
              <el-table-column prop="viewName" width="170">
                <template v-slot="{ row }">
                  <span
                    style="cursor: pointer"
                    :style="row.light ? 'color: rgb(64, 158, 255);' : ''"
                    @click="onClickView(row)"
                    >{{ row.viewName }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column align="right">
                <template #default="scope">
                  <el-row style="float: right">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click="
                        openViewEdit('edit', scope.row.viewName, scope.$index)
                      "
                      v-if="!scope.row.is_default"
                      :disabled="
                        scope.row.is_global_view && !hasAuth('view_global_edit')
                      "
                      >编辑</el-button
                    >
                    <el-button
                      link
                      type="danger"
                      size="small"
                      @click="resetViewTab(scope.$index)"
                      v-if="scope.row.is_default && scope.row.id > 0"
                      >还原</el-button
                    >
                    <el-button
                      link
                      type="danger"
                      size="small"
                      @click="deleteViewTab(scope.$index)"
                      v-if="!scope.row.is_default"
                      :disabled="
                        scope.row.is_global_view && !hasAuth('view_global_edit')
                      "
                      >删除</el-button
                    >
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="18">
            <el-tabs v-model="viewTabs" type="card" class="demo-tabs">
              <el-tab-pane label="列表字段" name="列表字段">
                <el-table
                  :data="viewTableConfig"
                  border
                  class="viewTableConfig"
                  :key="tableKeys"
                  :height="screenHeight"
                >
                  <el-table-column width="40">
                    <IconifyIconOffline :icon="expand" class="viewTabsDarg" />
                  </el-table-column>
                  <el-table-column prop="label" label="字段名" />
                  <el-table-column
                    prop="width"
                    label="默认宽度"
                    align="center"
                    width="180"
                  >
                    <template #default="scope">
                      <el-input v-model="scope.row.width" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="display"
                    label="是否显示"
                    align="center"
                    width="100"
                  >
                    <template #default="scope">
                      <el-checkbox v-model="scope.row.display" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="fixed"
                    label="是否冻结"
                    align="center"
                    width="120"
                  >
                    <template #default="scope">
                      <el-select style="width: 100%" v-model="scope.row.fixed">
                        <el-option
                          v-for="k in fixedOption"
                          :key="k.value"
                          :label="k.label"
                          :value="k.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane
                label="查询条件"
                name="查询条件"
                v-if="!default_view?.is_default"
              >
                <el-table :data="search_table_data" style="width: 100%">
                  <el-table-column
                    prop="viewName"
                    label="左括号"
                    align="center"
                    width="100"
                  >
                    <template #default="scope">
                      <el-select
                        style="width: 100%"
                        v-model="scope.row.border_left"
                        placeholder=" "
                      >
                        <el-option
                          v-for="k in border_left"
                          :key="k.value"
                          :label="k.label"
                          :value="k.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="viewName"
                    align="center"
                    label="字段"
                    width="220"
                  >
                    <template #default="scope">
                      <el-select
                        style="width: 100%"
                        v-model="scope.row.column"
                        placeholder=" "
                        @change="changeConditionColumn(scope)"
                      >
                        <el-option
                          v-for="k in conditions"
                          :key="k.value"
                          :label="k.label"
                          :value="k.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="viewName"
                    align="center"
                    label="比较"
                    width="120"
                  >
                    <template #default="scope">
                      <el-select
                        style="width: 100%"
                        v-model="scope.row.operator"
                        placeholder=" "
                      >
                        <el-option
                          v-for="k in operator"
                          :key="k.value"
                          :label="k.label"
                          :value="k.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="viewName" align="center" label="值">
                    <template #default="scope">
                      <!-- <el-input
                        v-if="!scope.row.type"
                        v-model="scope.row.value"
                        placeholder=""
                      />
                      <GetoInputItem
                        v-else
                        ref="inputItem"
                        :config="scope.row"
                      /> -->
                      <GetoInputItem
                        ref="inputItem"
                        :config="scope.row"
                        :initData="scope.row.query"
                        @changeData="changeData"
                        :key="inputItemKeys"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="viewName"
                    align="center"
                    label="右括号"
                    width="100"
                  >
                    <template #default="scope">
                      <el-select
                        style="width: 100%"
                        v-model="scope.row.border_right"
                        placeholder=" "
                      >
                        <el-option
                          v-for="k in border_right"
                          :key="k.value"
                          :label="k.label"
                          :value="k.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="viewName"
                    align="center"
                    label="链接"
                    width="100"
                  >
                    <template #default="scope">
                      <el-select
                        style="width: 100%"
                        v-model="scope.row.joint"
                        placeholder=" "
                      >
                        <el-option
                          v-for="k in joint"
                          :key="k.value"
                          :label="k.label"
                          :value="k.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="150">
                    <template v-slot:default="{ row, $index }">
                      <el-button
                        link
                        type="primary"
                        size="small"
                        @click="copyItem(row)"
                        >复制</el-button
                      >
                      <el-button
                        link
                        type="primary"
                        size="small"
                        @click="deleteItem($index)"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <el-button class="mt-4" style="width: 100%" @click="onAddItem"
                  >新增查询条件</el-button
                >
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-dialog
          v-model="innerVisible"
          width="30%"
          top="10%"
          :title="viewSetting.title"
          append-to-body
        >
          <el-form
            :model="viewSetting"
            label-width="120px"
            style="padding-right: 100px"
          >
            <el-form-item label="视图名称：">
              <el-input v-model="viewSetting.name" />
            </el-form-item>
            <el-form-item label="是否全局视图：" v-auth="'admin'">
              <el-switch v-model="viewSetting.is_global_view" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="innerVisible = false">取消</el-button>
              <el-button type="primary" @click="onSaveNew"> 保存 </el-button>
            </span>
          </template>
        </el-dialog>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSave"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import setting from "@iconify-icons/ep/setting";
import expand from "@iconify-icons/ep/expand";
import { ref, nextTick } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { initSortTable } from "@/utils/sortableTable";
import { message } from "@/utils/message";
import GetoInputItem from "../GetoInputItem/index.vue";
import { viewSave, viewReset } from "./../GetoApi/user-view";
import { hasAuth } from "@/router/utils";
defineOptions({
  name: "GetoViewSetting"
});

const props = defineProps(["config", "tabsName"]);
// 配置文件本地化
const localConfig = ref(cloneDeep(props.config));
const default_view = ref(localConfig.value[0]);
const default_view_list_key = ref(default_view.value.list_key);
const viewTabs = ref("列表字段");
const tableKeys = ref(0);
const viewKeys = ref(0);
const dialogVisible = ref(false);
const inputItem = ref(null);
const viewTableData = ref([]);
const innerVisible = ref(false);
const viewSetting: any = ref({});

const border_left = ref(default_view.value.conf.search.border_left);
const border_right = ref(default_view.value.conf.search.border_right);
const joint = ref(default_view.value.conf.search.joint);
const operator = ref([]);
const conditions = ref(default_view.value.conf.search.conditions);
const search_item = {
  border_left: "",
  column: "",
  operator: "",
  query: "",
  border_right: "",
  joint: "",
  type: ""
};
const search_table_data = ref([search_item]);
const viewTableConfig = ref(default_view.value.conf.list_columns);
const fixedOption = ref([
  { label: "不冻结", value: "" },
  { label: "左冻结", value: "left" },
  { label: "右冻结", value: "right" }
]);
const page_key = ref("");
localConfig.value.forEach(item => {
  if (item.is_default) {
    page_key.value = item.page_key;
  }
});
cloneDeep(props.tabsName).forEach((item, index) => {
  viewTableData.value.push({
    viewName: item,
    light: index === 0,
    is_default: localConfig.value[index].is_default,
    is_global_view: localConfig.value[index].is_global_view,
    id: localConfig.value[index].id
  });
});
// ------------------------------------------------------- 视图列表（开始） -------------------------------------------------------
// 打开视图dialog
const screenHeight = ref(400);
const viewOnclick = () => {
  dialogVisible.value = true;
  // 获取屏幕高度
  screenHeight.value = document.documentElement.clientHeight * 0.4;
  dragCallBack();
  dragViewCallBack();
};
// 点击视图列表
const onClickView = row => {
  viewTableData.value.forEach(item => {
    item.light = false;
  });
  // 设置高亮
  row.light = true;
  localConfig.value.forEach(item => {
    if (row.viewName === item.name) {
      viewTableConfig.value = item.conf.list_columns;
      default_view.value = item;
      // viewTabs.value = default_view.value.is_default ? "列表字段" : "查询条件";
      item.conf.search.value = item.conf.search.value ?? [search_item];
      search_table_data.value = item.conf.search.value; //无值初始化
      search_table_data?.value?.forEach((j, k) => {
        changeConditionColumn({ row: j, $index: k }, false);
      });
      // dragCallBack();
    }
  });
  viewTabs.value = "列表字段";
};
// 视图新增/编辑弹窗
const openViewEdit = (type, rowName = "", index = "") => {
  // 打开编辑弹窗
  if (type === "edit") {
    viewSetting.value.title = "编辑视图";
    viewSetting.value.type = type;
    viewSetting.value.name = rowName;
    viewSetting.value.index = index;
  } else if (type === "new") {
    viewSetting.value.title = "新增视图";
    viewSetting.value.type = type;
  }
  innerVisible.value = true;
};
// 保存视图
const onSaveNew = () => {
  // 保存视图配置的方法
  if (viewSetting.value.type === "edit") {
    viewTableData.value[viewSetting.value.index].viewName =
      viewSetting.value.name;
    viewTableData.value[viewSetting.value.index].is_global_view =
      viewSetting.value.is_global_view;
    localConfig.value[viewSetting.value.index].name = viewSetting.value.name;
    localConfig.value[viewSetting.value.index].is_global_view =
      viewSetting.value.is_global_view;
  } else if (viewSetting.value.type === "new") {
    const cloneList = cloneDeep(default_view.value);
    cloneList.is_default = false;
    cloneList.conf.search.value = [];
    cloneList.name = viewSetting.value.name;
    cloneList.is_global_view = viewSetting.value.is_global_view;
    cloneList.id = undefined;
    localConfig.value.push(cloneList);
    viewTableData.value.push({
      viewName: viewSetting.value.name,
      is_global_view: viewSetting.value.is_global_view
    });
    onClickView(viewTableData.value[viewTableData.value.length - 1]);
  }
  viewSetting.value = {};
  innerVisible.value = false;
};
// 删除视图
const deleteViewTab = index => {
  if (
    viewTableData.value[index].is_default &&
    viewTableData.value[index].id == 0
  ) {
    message("删除失败，默认视图不可删除！", { type: "error" });
    return;
  }
  viewTableData.value.splice(index, 1);
  localConfig.value.splice(index, 1);
  // 返回默认
  onClickView(viewTableData.value[0]);
};
// 还原默认
const resetViewTab = index => {
  if (!viewTableData.value[index].is_default) {
    message("非默认视图不能还原！", { type: "error" });
    return;
  }
  if (viewTableData.value[index].id == 0) {
    message("没保存的默认视图不能还原！", { type: "error" });
    return;
  }
  viewReset({
    id: viewTableData.value[index].id
  }).then(res => {
    message(res.data["msg"], { type: "success" });
    // 刷新页面
    window.location.reload();
  });
};
// ------------------------------------------------------- 视图列表（结束） -------------------------------------------------------

// ------------------------------------------------------- 列表字段（开始） -------------------------------------------------------
const dragCallBack = () => {
  // tableKeys+1 触发组件视图更新
  tableKeys.value += 1;
  nextTick(() => {
    // 重新绑定拖拽事件
    initSortTable(
      "viewTableConfig",
      viewTableConfig.value,
      "viewTabsDarg",
      dragCallBack
    );
  });
};
const dragViewCallBack = () => {
  // viewKeys+1 触发组件视图更新
  viewKeys.value += 1;
  nextTick(() => {
    // 重新绑定拖拽事件
    initSortTable(
      "viewTable",
      viewTableData.value,
      "allowDrag",
      dragViewCallBack
    );
  });
};
// ------------------------------------------------------- 列表字段（结束） -------------------------------------------------------

// ------------------------------------------------------- 查询条件（开始） -------------------------------------------------------

// 切换条件列
const inputItemKeys = ref(0);
const changeConditionColumn = (scope, reset = true) => {
  conditions.value.forEach(item => {
    if (item.value === scope.row.column) {
      scope.row.type = item.query_type;
      scope.row.query = scope.row.query ? scope.row.query : item.query;
      operator.value = item.operator;
      scope.row.options = item.options;
      if (!reset) return;
      scope.row.query = "";
    }
  });
};
// 增加搜索条件
const onAddItem = () => {
  search_table_data.value.push({
    border_left: "",
    column: "",
    operator: "",
    query: "",
    border_right: "",
    joint: "",
    type: ""
  });
};
// 复制搜索条件
const copyItem = row => {
  search_table_data.value.push(cloneDeep(row));
};
// 删除搜索条件
const deleteItem = index => {
  search_table_data.value.splice(index, 1);
};
const changeData = (row, config) => {
  // 保存回传数据
  config.query = row;
};
// 保存视图
const onSave = () => {
  localConfig.value.forEach(item => {
    item.list_key = default_view_list_key.value;
    item.page_key = page_key.value;
    item.is_global_view = !!item.is_global_view;
  });
  viewSave({
    page_id: page_key.value,
    views: localConfig.value
  }).then((res: any) => {
    if (res.code != "0") return;
    message(res.data.msg, { type: "success" });
    dialogVisible.value = false;
    emitter.emit("showPageListSave", default_view.value.name);
  });
};
// ------------------------------------------------------- 查询条件（结束） -------------------------------------------------------
</script>
