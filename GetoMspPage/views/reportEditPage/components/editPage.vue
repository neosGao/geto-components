<!--
 * @Author: 高文进 gwj@geto.com.cn
 * @Date: 2023-11-20 10:14:39
 * @LastEditors: 高文进 gwj@geto.com.cn
 * @LastEditTime: 2023-12-08 17:28:06
 * @FilePath: \sys-web\src\geto-components\GetoMspPage\views\reportEditPage\components\editPage.vue
 * @Description: 
 * 
 * Copyright (c) gwj, All Rights Reserved. 
-->
<template>
  <div class="flex-1 bg-white h-full p-[20px]" v-loading="v_loading">
    <div class="flex justify-between">
      <div class="font-bold text-2xl">报表管理</div>
      <div class="relative top-[-5px]">
        <el-button
          size="default"
          type="primary"
          @click="preview"
          v-auth="'OPERATE_STATEMENT_LIST_STATISTICS_VIEW'"
          >图表预览</el-button
        >
        <el-button size="default" type="primary" @click="submit"
          >保存</el-button
        >
        <el-button
          size="default"
          type="primary"
          v-if="props.type === 'new'"
          @click="resetForm"
          >重置</el-button
        >
      </div>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <template v-slot:title>
          <span class="font-bold text-xl">触发条件配置</span>
        </template>
        <GetoForm
          ref="getoForm"
          :formItemConfig="formItemConfigRef"
          :formInitial="formData"
          :formConfig="formConfig"
          :rules="formRules"
          @onFormChange="onFormChange"
        >
          <template v-slot:formItem="{ item }">
            <el-row v-if="item.prop === 'view_rule'">
              <el-col>
                <label>组织</label>
                <el-cascader
                  v-model="storeValue.view_org_id"
                  :props="{
                    multiple: true,
                    checkStrictly: true,
                    value: 'id',
                    label: 'name',
                    emitPath: false
                  }"
                  clearable
                  :options="storeConf.view_org_id"
                  collapse-tags
                  class="ml-2 w-[90%]"
                />
              </el-col>
              <el-col class="mt-2">
                <label>岗位</label>
                <el-select
                  class="ml-2 w-[90%]"
                  ref="selectRef"
                  v-model="storeValue.view_position_id"
                  placeholder="请选择"
                  clearable
                  multiple
                  @clear="resetCustom"
                  @visible-change="clearUserList"
                >
                  <template #empty>
                    <el-row class="min-h-100 max-h-400">
                      <el-col :span="12">
                        <el-scrollbar height="400px">
                          <GetoTree
                            :data="storeConf.view_org_id"
                            :config="{
                              showCheckbox: false,
                              treePropsLabel: 'name'
                            }"
                            @handleNodeClick="data => getoTreeClick(data)"
                            ref="getoTreeBox"
                          />
                        </el-scrollbar>
                      </el-col>
                      <el-col :span="12">
                        <div class="h-[100%] pt-4 pb-12 px-2">
                          <div
                            class="box-title text-sm font-bold pr-2 cursor-pointer mb-2"
                          >
                            已选择 {{ userTitle }}
                            <el-button
                              type="primary"
                              link
                              class="float-right"
                              @click="checkAll"
                            >
                              全选
                            </el-button>
                          </div>
                          <el-scrollbar class="relative" height="300px">
                            <div class="custom-list">
                              <!-- 多选部分 -->
                              <div
                                class="box-title text-sm cursor-pointer"
                                v-for="ul in userList"
                                :key="ul.id"
                              >
                                <el-checkbox
                                  v-model="ul.check"
                                  :label="ul.name"
                                />
                              </div>
                            </div>
                          </el-scrollbar>
                          <div class="absolute bottom-3 right-5">
                            <el-button
                              size="small"
                              type="primary"
                              @click="treeClick"
                              >确定</el-button
                            >
                            <el-button size="small" @click="cancelTree"
                              >取消</el-button
                            >
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-select>
              </el-col>
              <el-col class="mt-2">
                <label>人员</label>
                <el-select
                  filterable
                  remote
                  :remote-method="query => remoteMethod(query, 'view_user_id')"
                  multiple
                  collapse-tags
                  v-model="storeValue.view_user_id"
                  class="ml-2 w-[90%]"
                >
                  <el-option
                    :value="item.id"
                    :label="item.name"
                    :key="'view_user_id' + index"
                    v-for="(item, index) in storeConf.view_user_id"
                  />
                </el-select>
              </el-col>
            </el-row>
            <el-row v-if="item.prop === 'edit_rule'">
              <el-col>
                <label>人员</label>
                <el-select
                  filterable
                  remote
                  :remote-method="
                    query => remoteMethod(query, 'can_edit_user_id')
                  "
                  multiple
                  collapse-tags
                  v-model="storeValue.can_edit_user_id"
                  class="ml-2 w-[90%]"
                >
                  <el-option
                    :value="item.id"
                    :label="item.name"
                    :key="'can_edit_user_id' + index"
                    v-for="(item, index) in storeConf.can_edit_user_id"
                  />
                </el-select>
              </el-col>
            </el-row>
          </template>
        </GetoForm>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template v-slot:title>
          <span class="font-bold text-xl">查询条件</span>
        </template>
        <el-scrollbar max-height="120">
          <GetoSearch
            class="overflow-x-hidden"
            ref="getoSearch"
            viewName="条件"
            :config="searchConfig"
            @onSearch="() => {}"
            :diySearchConfig="{}"
            :justInput="true"
            :default_view="default_view"
            :key="searchIndex"
          />
        </el-scrollbar>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="图表预览" v-model="dialogVisible" width="70%">
      <lineChart class="mx-auto" ref="lineChartRef" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import GetoForm from "@/geto-components/GetoForm/index.vue";
import GetoSearch from "@/geto-components/GetoSearch/index.vue";
import GetoTree from "@/geto-components/GetoTree/index.vue";
import { formRules, formItemConfig } from "../config.js";
import {
  getSourceConfig,
  getSourceList,
  getStatementInfo,
  saveStatementNew,
  saveStatementEdit,
  chartsPreview,
  belong_user,
  orgFunction
} from "../statementListApi";
import lineChart from "./lineChart.vue";
import { message } from "@/utils/message";
import { cloneDeep } from "@pureadmin/utils";

defineOptions({
  name: "statement_edit_page"
});

const emits = defineEmits(["refashList"]); // 定义发射给父组件的事件
const props = defineProps({
  type: {
    type: String,
    default: () => ""
  },
  id: {
    type: Number,
    default: () => 0
  }
});
const v_loading = ref<boolean>(false);
const getoForm = ref(null);
const activeNames = ref<string[]>(["1", "2"]);
const formData = ref({});
const formConfig = ref({
  labelPosition: "top",
  disabled: false
});
const formItemConfigRef = ref(formItemConfig);
const sourceList = ref([]);
const default_view = ref();
const searchConfig = ref<any>({});
const searchIndex = ref(0);
const getoSearch = ref(null);
const lineChartRef = ref(null);
const getoTreeBox = ref(null);
const selectRef = ref(null);
const dialogVisible = ref(false);
const storeConf = ref({
  view_user_id: [],
  view_org_id: [],
  view_position_id: [],
  can_edit_user_id: []
});
const storeValue = ref({
  view_user_id: [],
  view_org_id: [],
  view_position_id: [],
  can_edit_user_id: []
});
const userList = ref([]);
const userTitle = ref("");

const handleChange = (val: string[]) => {
  console.log(val);
};
const onFormChange = async (item, form) => {
  if (item.prop === "data_source_sn") {
    const res: res = await getSourceConfig({
      data_source_sn: form.data_source_sn
    });
    if (res.code !== "0") return;
    formItemConfigRef.value.forEach((configItem: any) => {
      if (
        configItem.type === "select" &&
        configItem.prop !== "data_source_sn"
      ) {
        configItem.options =
          res.data[configItem.optionsKeys ?? configItem.prop];
      }
      if (configItem.type === "radio") {
        configItem.radioOption =
          res.data[configItem.optionsKeys ?? configItem.prop];
      }
    });
    searchConfig.value = res.data.search;
    searchIndex.value += 1;
    storeConf.value.view_org_id = res.data.org_tree;
  }
  if (item.prop === "chart_type") {
    formItemConfigRef.value.forEach((configItem: any) => {
      if (configItem.prop === "aggregate_type") {
        configItem.hidden = !(form["chart_type"] === "detail_list");
      }
    });
  }
};
const resetForm = () => {
  formData.value = {};
  storeConf.value = {
    view_user_id: [],
    view_org_id: [],
    view_position_id: [],
    can_edit_user_id: []
  };
  storeValue.value = {
    view_user_id: [],
    view_org_id: [],
    view_position_id: [],
    can_edit_user_id: []
  };
  getoForm.value.resetForm();
  searchConfig.value = {};
  default_view.value = null;
  searchIndex.value += 1;
};

watch(props, val => {
  if (val.type === "edit") {
    editInitData();
  } else if (val.type === "new") {
    resetForm();
  }
});

const editInitData = async () => {
  v_loading.value = true;
  const resInfo: res = await getStatementInfo({ id: props.id });
  if (resInfo.code !== "0") return;
  formData.value = resInfo.data;
  getoForm.value.setForm(resInfo.data);
  // 触发值变更
  onFormChange({ prop: "data_source_sn" }, formData.value);
  onFormChange({ prop: "chart_type" }, formData.value);
  storeValue.value.view_org_id = resInfo.data.view_org_id;
  if (!Array.isArray(resInfo.data.view_positions)) {
    message("没有view_positions数组", { type: "error" });
    v_loading.value = false;
    return;
  }
  storeValue.value.view_position_id = resInfo?.data?.view_positions.map(
    item => {
      return {
        id: item.value,
        label: item.label
      };
    }
  );
  storeValue.value.view_user_id = resInfo.data.view_users;
  storeValue.value.can_edit_user_id = resInfo.data.can_edit_users;
  default_view.value = {
    conf: { search: { value: resInfo.data.condition } }
  };
  v_loading.value = false;
};
// 提交数据
const submit = async () => {
  const form = await getoForm.value.submitForm();
  const store = cloneDeep(storeValue.value);
  const isObject = value => {
    return typeof value === "object" && value !== null;
  };
  store.can_edit_user_id = store.can_edit_user_id.map(item => {
    if (isObject(item)) {
      return item.value;
    } else {
      return item;
    }
  });
  store.view_user_id = store.view_user_id.map(item => {
    if (isObject(item)) {
      return item.value;
    } else {
      return item;
    }
  });
  const submitFuc =
    props.type === "new"
      ? saveStatementNew
      : props.type === "edit"
      ? saveStatementEdit
      : () => {};
  const params = {
    ...formData.value,
    ...form.value,
    ...store
  };
  params.view_position_id = store.view_position_id.map(item => item.id);
  params.condition = getoSearch.value.exportSearchData();
  const res: any = await submitFuc(params);
  if (res.code !== "0") return;
  emits("refashList");
  message(res.message, { type: "success" });
};
// 预览图表
const preview = async () => {
  const form = await getoForm.value.submitForm();
  const params = {
    ...formData.value,
    ...form.value,
    is_preview: 0
  };
  params.condition = getoSearch.value.exportSearchData();
  const res: res = await chartsPreview(params);
  if (res.code !== "0") return;
  if (res.data.chart_data?.length === 0) {
    message("暂无数据!", { type: "error" });
    return;
  }
  dialogVisible.value = true;
  nextTick(() => {
    lineChartRef.value.useChart(res.data);
  });
};

const remoteMethod = (query, list) => {
  if (query != "") {
    belong_user({ keyword: query }).then(res => {
      let oldData = [];
      if (storeValue.value[list]?.length > 0)
        oldData = storeConf.value[list].filter(i =>
          storeValue.value[list].includes(i.value)
        );
      const result = res.data;
      const handleResult = [];
      const arr = [...oldData, ...result];
      arr.forEach(item => {
        if (!handleResult.map(i => i.value).includes(item.value)) {
          handleResult.push(item);
        }
      });
      storeConf.value[list] = handleResult;
    });
  }
};
const resetCustom = () => {
  // 重置列表
  userList.value = [];
  getoTreeBox.value.resetTree();
};

const getoTreeClick = async data => {
  userList.value = [];
  userTitle.value = data.name;
  const res: res = await orgFunction({
    pid: data.id,
    is_display_lower_level: 0
  });
  if (res.code != "0") return;
  userList.value = res.data;
};
const treeClick = () => {
  const arr = userList.value
    .filter(fitem => fitem.check)
    .map(mitem => {
      const obj = {
        id: mitem.id,
        label: mitem.name
      };
      return obj;
    });
  // 自定义去重逻辑，基于 user_id 进行去重
  storeValue.value.view_position_id = storeValue.value.view_position_id || [];
  arr.forEach(newItem => {
    const exists = storeValue.value.view_position_id.some(
      existingItem => existingItem.id === newItem.id
    );
    if (!exists) {
      storeValue.value.view_position_id.push(newItem);
    }
  });
  userList.value.forEach(item => {
    item.check = false;
  });
};
const clearUserList = () => {
  userTitle.value = "";
  userList.value = [];
};
const cancelTree = () => {
  selectRef.value.blur();
};
const checkAll = () => {
  userList.value.forEach(item => {
    item.check = true;
  });
};

onMounted(async () => {
  const res: res = await getSourceList();
  if (res.code !== "0") return;
  sourceList.value = res.data;
  formItemConfigRef.value.forEach(item => {
    if (item.prop === "data_source_sn") {
      item.options = res.data;
    }
  });
  if (props.type === "edit") {
    editInitData();
  }
});
</script>

<style scoped lang="scss">
:deep(.el-form-item__content) {
  display: block;
}
</style>
