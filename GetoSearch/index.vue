<template>
  <div class="geto-search">
    <el-form :model="formInline" :label-width="localConfig.label_width || 100">
      <el-row :gutter="15">
        <el-col :span="20" style="position: relative">
          <el-row
            :style="moreIcon ? {} : { height: '100px', overflow: 'hidden' }"
            v-if="diySearchConfig.is_default"
          >
            <!-- 搜索框模板 -->
            <template v-for="(item, index) in conditions" :key="index">
              <el-col :span="item.span ?? defaultCondItemSpan" v-if="item.is_default">
                <el-form-item :label="item.label" style="text-align: right">
                  <slot name="searchItem" :slotItem="item" v-if="item.use_slot" />
                  <GetoInputItem
                    v-else
                    ref="inputItem"
                    :config="item"
                    :initData="item.query"
                    @changeData="(row, config) => onChangeData(row, config, conditions)"
                  />
                </el-form-item>
              </el-col>
            </template>
          </el-row>
          <el-row v-else>
            <el-col :span="6" style="margin-bottom: 10px" v-show="!props.justInput">
              <el-input
                v-model="solutionName"
                placeholder="方案名称"
                :disabled="diySearchConfig.is_global_view"
              />
            </el-col>
            <el-col
              :span="24"
              v-for="(item, index) in search_table_data"
              :key="index"
              style="margin-bottom: 10px"
            >
              <el-row justify="space-between">
                <el-col :span="2">
                  <el-select style="width: 100%" v-model="item.border_left" placeholder="左括号">
                    <el-option
                      v-for="k in border_left"
                      :key="k.value"
                      :label="k.label"
                      :value="k.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select
                    style="width: 100%"
                    v-model="item.column"
                    placeholder="字段"
                    @change="changeConditionColumn(item, index)"
                  >
                    <el-option
                      v-for="k in conditions"
                      :key="k.value"
                      :label="k.label"
                      :value="k.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="2">
                  <el-select style="width: 100%" v-model="item.operator" placeholder="比较">
                    <el-option
                      v-for="k in operator"
                      :key="k.value"
                      :label="k.label"
                      :value="k.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-input v-if="!item.type" v-model="item.value" placeholder="值" />
                  <GetoInputItem
                    v-else
                    ref="inputItemSearch"
                    :config="item"
                    :initData="item.value"
                    placeholder="值"
                  />
                </el-col>
                <el-col :span="2">
                  <el-select style="width: 100%" v-model="item.border_right" placeholder="右括号">
                    <el-option
                      v-for="k in border_right"
                      :key="k.value"
                      :label="k.label"
                      :value="k.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="2">
                  <el-select
                    style="width: 100%"
                    v-model="item.joint"
                    placeholder="链接"
                    @change="val => jointChange(val, item, index)"
                  >
                    <el-option
                      v-for="k in joint"
                      :key="k.value"
                      :label="k.label"
                      :value="k.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="6" style="line-height: 30px">
                  <el-button link type="primary" size="small" @click="copyItem(item)"
                    >复制</el-button
                  >
                  <el-button link type="danger" size="small" @click="deleteItem(index)"
                    >删除</el-button
                  >
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="24" style="margin-bottom: 10px">
              <el-button type="primary" link @click="addNewItem">新增查询条件</el-button>
              <el-button
                type="success"
                link
                @click="saveSolution"
                :disabled="diySearchConfig.is_global_view && !hasAuth('view_global_edit')"
                v-show="!props.justInput"
                >保存方案</el-button
              >
              <el-button
                type="danger"
                link
                @click="deleteSolution"
                :disabled="diySearchConfig.is_global_view && !hasAuth('view_global_edit')"
                v-show="!props.justInput"
                >删除方案</el-button
              >
            </el-col>
          </el-row>
          <div
            v-if="conditionSpan > 50"
            style="position: absolute; bottom: 30px; right: -50px; cursor: pointer; z-index: 10"
            @click="moreIcon = !moreIcon"
          >
            <IconifyIconOffline v-if="moreIcon" :icon="arrowUpBold" />
            <IconifyIconOffline v-else :icon="arrowDownBold" />
          </div>
        </el-col>
        <el-col :span="4" style="position: relative; top: -8px" v-show="!props.justInput">
          <el-form-item
            v-if="props.searchAuth ? hasAuth(props.searchAuth) : true"
            class="search-operate"
          >
            <el-row>
              <el-switch v-model="localConfig.accurate" inactive-text="精确搜索：" />
            </el-row>
          </el-form-item>
          <el-form-item
            v-if="props.searchAuth ? hasAuth(props.searchAuth) : true"
            class="search-operate"
          >
            <el-row justify="space-around">
              <el-col :span="12">
                <el-button type="primary" @click="onSubmit()">查询</el-button>
              </el-col>
              <el-col :span="10">
                <el-button @click="reset" v-if="!props.isCustomReset">重置</el-button>
                <el-button v-if="props.isCustomReset" @click="customReset">重置</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import arrowDownBold from "@iconify-icons/ep/arrow-down-bold";
import arrowUpBold from "@iconify-icons/ep/arrow-up-bold";
import GetoInputItem from "../GetoInputItem/index.vue";
import { interfaceConfig } from "./types";
import type { PropType } from "vue";
import { viewEdit, viewDelete } from "./../GetoApi/user-view";
import { message } from "@/utils/message";
import { hasAuth } from "@/router/utils";
defineOptions({
  name: "GetoSearch"
});

// interface propsInterface {
//   config: interfaceConfig;
//   diySearchConfig: Record<string, any>; // diySearchConfig 是一个键值对对象，因此可以使用 Record<string, any>
// }

const emits = defineEmits(["onSearch", "onReset", "onCustomReset", "onChangeData"]); // 定义发射给父组件的事件

const props = defineProps({
  config: {
    type: Object as () => PropType<interfaceConfig>,
    default: () => {}
  },
  diySearchConfig: {
    type: Object,
    default: () => {}
  },
  viewName: {
    type: String,
    default: () => ""
  },
  default_view: {
    type: Object,
    default: () => {}
  },
  searchAuth: {
    type: String,
    default: () => ""
  },
  list_key: {
    type: String,
    default: () => ""
  },
  justInput: {
    type: Boolean,
    default: () => false
  },
  isCustomReset: {
    type: Boolean,
    default: () => false
  }
});

// 配置文件本地化
const localConfig = ref(cloneDeep(props.config || {}));
const conditions = ref([]);
conditions.value = localConfig.value.conditions;
const solutionName = ref(props.viewName);

const inputItem = ref(null);
const conditionSpan = ref(0);

const inputItemSearch = ref(null);

const formInline = ref({});

const moreIcon = ref(false);
const defaultCondItemSpan = 6;
const search_table_data = ref(cloneDeep(props.default_view?.conf?.search?.value ?? []));
const border_left = ref(localConfig.value.border_left ?? []);
const operator = ref(localConfig.value.operator ?? []);
const border_right = ref(localConfig.value.border_right ?? []);
const joint = ref(localConfig.value.joint ?? []);

// 切换条件列
const changeConditionColumn = (row, index) => {
  conditions.value.forEach(item => {
    if (item.value === row.column) {
      row.type = item.query_type;
      row.value = row.query;
      row.options = item.options;
      row.query = item.query;
      operator.value = item.operator;
      if (inputItemSearch?.value?.length > 0) {
        inputItemSearch?.value?.[index]?.resetEditInput();
      } else {
        inputItemSearch?.value?.resetEditInput();
      }
    }
  });
};
// 初始化调用
search_table_data.value.forEach((item, index) => {
  changeConditionColumn(item, index);
});
// 新增查询列
const addNewItem = () => {
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
// 复制查询列
const copyItem = item => {
  search_table_data.value.push(cloneDeep(item));
};
// 删除查询列
const deleteItem = index => {
  search_table_data.value.splice(index, 1);
  search_table_data.value.forEach(row => {
    conditions.value.forEach(item => {
      if (item.value === row.column) {
        // 删除时不清空值
        // if (inputItemSearch?.value?.length > 0) {
        //   inputItemSearch?.value?.[index]?.resetEditInput();
        // } else {
        //   inputItemSearch?.value?.resetEditInput();
        // }
        // row.value = row.query;
        // row.query = item.query;
        row.type = item.query_type;
        row.options = item.options;
        operator.value = item.operator;
      }
    });
  });
};
// 保存方案
const saveSolution = () => {
  const arr = cloneDeep(search_table_data.value);
  arr.forEach((item, index) => {
    item.query = inputItemSearch?.value?.[index]?.onEditInput()["value"];
  });
  const form = {
    id: props.diySearchConfig.id,
    name: solutionName.value,
    is_only_edit_query: true,
    search_conf: {
      conditions: arr,
      list_id: props.list_key
    }
  };
  viewEdit(form).then(res => {
    message(res.data["msg"], { type: "success" });
  });
};
// 删除方案
const deleteSolution = () => {
  viewDelete({
    id: props.diySearchConfig.id
  }).then(res => {
    message(res.data["msg"], { type: "success" });
    // 刷新页面
    window.location.reload();
  });
};

interface searchQuery {
  query?: Object;
}
const onSubmit = (flag = true) => {
  const params: searchQuery = {};
  if (props.diySearchConfig.is_default) {
    const defaultParams: searchQuery = {};
    inputItem.value?.forEach(item => {
      const obj = item?.onEditInput();
      Object.assign(defaultParams, obj);
    });
    formInline.value = defaultParams;
    const arr = [];
    Object.keys(formInline.value).forEach(item => {
      if (
        formInline.value[item] ||
        formInline.value[item] === 0 ||
        formInline.value[item] === "0"
      ) {
        const default_config = conditions.value.filter(a => a.value === item)[0];
        let default_type = "";
        if (default_config.type === "input") {
          default_type = localConfig.value.accurate ? "=" : "like";
        } else {
          default_type = default_config.default_operator;
        }
        // 过滤数组空值的条件
        if (Array.isArray(formInline.value[item]) && formInline.value[item].length < 1) {
          return;
        }
        arr.push({
          border_left: "",
          border_right: "",
          column: item,
          operator: default_type,
          query: formInline.value[item],
          joint: "and"
        });
      }
    });
    params.query = arr;
    // 渲染时获取默认参数后查询一次，没有参数并且为初次渲染时不执行
    if (arr.length === 0 && !flag) return;
  } else {
    const arr = cloneDeep(search_table_data.value);
    arr.forEach((item, index) => {
      item.query = inputItemSearch?.value?.[index]?.onEditInput(true);
    });
    params.query = arr;
  }
  emits("onSearch", params);
};
const reset = () => {
  formInline.value = {};
  inputItem.value &&
    inputItem.value.forEach(item => {
      item.resetEditInput();
    });
  if (inputItemSearch?.value?.length > 0) {
    inputItemSearch.value.forEach(item => {
      item.resetEditInput();
    });
  } else {
    inputItemSearch?.value?.resetEditInput();
  }
  emits("onReset");
};

// 输出重置方法
const customReset = () => {
  formInline.value = {};
  emits("onCustomReset", inputItem, inputItemSearch);
};

const exportSearchData = () => {
  const arr = cloneDeep(search_table_data.value);
  arr.forEach((item, index) => {
    item.query = inputItemSearch?.value?.[index]?.onEditInput(true);
  });
  return arr;
};

const jointChange = (val, item, index) => {
  // 切换时值不改变
  item.value = inputItemSearch?.value?.[index]?.onEditInput(true);
};
const onChangeData = (row, config, conditions) => {
  emits("onChangeData", row, config, conditions);
};

watch(
  () => props.config,
  val => {
    localConfig.value = val;
    conditions.value = localConfig.value.conditions;
    border_left.value = localConfig.value.border_left ?? [];
    operator.value = localConfig.value.operator ?? [];
    border_right.value = localConfig.value.border_right ?? [];
    joint.value = localConfig.value.joint ?? [];
  }
);
onMounted(() => {
  // 渲染时获取默认参数后查询一次，没有参数并且为初次渲染时不执行
  onSubmit(false);

  conditionSpan.value = 0;
  conditions?.value?.forEach(condition => {
    if (condition.is_default) {
      const span = condition.span ?? defaultCondItemSpan;
      conditionSpan.value += span;
    }
  });
});

defineExpose({
  // 暴露出子组件方法
  exportSearchData,
  reset,
  customReset
});
</script>

<style lang="scss" scoped>
.geto-search {
  background-color: #fff;
  padding: 0px;
  padding-bottom: 0;
  border-radius: 4px;
}

:deep(.el-form-item) {
  label {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .el-form-item__label {
    font-weight: 700;
    cursor: pointer;
    min-width: 100px;
    width: auto !important;
  }
}
:deep(.search-operate) {
  justify-content: right;
}
:deep(.search-operate .el-form-item__content) {
  margin-left: 0 !important;
  flex: none !important;
  margin-right: 20px;
}
</style>
