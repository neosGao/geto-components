<template>
  <div class="geto-input-item">
    <span v-if="props.config.type === 'read' || !props.config.type">{{ itemData }}</span>
    <el-input
      v-if="props.config.type === 'input'"
      style="width: 100%"
      :maxlength="props.config.maxlength"
      :rows="props.config.rows"
      :show-word-limit="props.config.showWordLimit ?? props.config.maxlength"
      :type="props.config.textType"
      v-model="itemData"
      :disabled="props.disabled || props.config.disabled"
      :placeholder="props.config.label || props.placeholder"
      :autosize="props.config.autosize"
      :readonly="props.readonlyInp || props.config.readonlyInp"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
    >
      <template v-if="config.append ?? false" v-slot:append>
        {{ config.append }}
      </template>
      <template v-else-if="props.config.appendSearch ?? false" #append>
        <el-button :icon="Search" @click="onSearchInput(props)" />
      </template>
    </el-input>
    <el-select
      v-if="props.config.type === 'select'"
      style="width: 100%"
      v-model="itemData"
      filterable
      :remote="props.config?.remote ?? false"
      :remote-method="query => remoteMethod(query, props.config)"
      :disabled="
        props.disabled ||
        props.config.disabled ||
        (initRows && initRows[`${props.config.value}Disabled`])
      "
      :placeholder="props.config.label || props.placeholder"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
      :clearable="props.config.clearable != undefined ? props.config.clearable : true"
    >
      <el-option
        v-for="k in props.config.custom_options
          ? initRows[`${props.config.value}Options`]
          : props.config.options"
        :key="k.value"
        :label="k.label"
        :value="k.value"
        :disabled="k.disabled"
      />
    </el-select>
    <el-select
      v-if="props.config.type === 'multiple'"
      style="width: 100%"
      v-model="itemData"
      :multiple="true"
      filterable
      remote
      clearable
      reserve-keyword
      :collapse-tags="props.config.collapseTags ?? false"
      :placeholder="props.config.label || props.placeholder"
      :remote-method="query => remoteMethod(query, props.config)"
      :loading="props.config.remoteLoading"
      :disabled="props.disabled || props.config.disabled"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
    >
      <el-option
        v-for="k in props.config.custom_options
          ? initRows[`${props.config.value}Options`]
          : props.config.options"
        :key="k.value"
        :label="k.label"
        :value="k.value"
      />
    </el-select>
    <el-select
      v-if="props.config.type === 'remote'"
      style="width: 100%"
      v-model="itemData"
      :multiple="props.config.multiple"
      :collapseTags="props.config.multiple"
      filterable
      remote
      clearable
      reserve-keyword
      :placeholder="props.config.label || props.placeholder"
      :remote-method="query => remoteMethod(query, props.config)"
      :loading="props.config.remoteLoading"
      :disabled="props.disabled || props.config.disabled"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
    >
      <el-option
        v-for="k in props.config.customRemote
          ? initRows[`${props.config.value}Options`]
          : props.config.options"
        :key="k.value"
        :label="k.label"
        :value="k.value"
      />
    </el-select>
    <!-- 虚拟选择器远程搜索，用于大量数据 -->
    <el-select-v2
      v-if="props.config.type === 'remote-v2'"
      style="width: 100%"
      v-model="itemData"
      :multiple="props.config.multiple"
      :collapseTags="props.config.multiple"
      :collapse-tags-tooltip="props.config.multiple"
      filterable
      remote
      clearable
      reserve-keyword
      :placeholder="props.config.label || props.placeholder"
      :remote-method="query => remoteMethod(query, props.config)"
      :loading="v2RemoteLoading"
      :disabled="props.disabled || props.config.disabled"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
      :options="
        props.config.customRemote
          ? initRows[`${props.config.value}Options`] ?? []
          : props.config.options ?? []
      "
    />
    <!-- input输入框/remotey远程搜索 混合类型 -->
    <template v-if="props.config.type === 'inputOrRemote'">
      <el-input
        v-if="initRows[props.config.associationProp] === 2"
        style="width: 100%"
        :maxlength="props.config.maxlength"
        :rows="props.config.rows"
        :show-word-limit="props.config.maxlength"
        :type="props.config.textType"
        v-model="initRows[props.config.key2]"
        :disabled="props.disabled || props.config.disabled"
        :placeholder="props.config.label || props.placeholder"
        :autosize="props.config.autosize"
        :readonly="props.readonlyInp || props.config.readonlyInp"
        @change="inputItemChange(itemData, props.config)"
        @blur="inputItemBlur(itemData, props.config)"
      >
        <template v-if="config.append ?? false" v-slot:append>
          {{ config.append }}
        </template>
        <template v-else-if="props.config.appendSearch ?? false" #append>
          <el-button :icon="Search" @click="onSearchInput(props)" />
        </template>
      </el-input>
      <el-select
        v-if="initRows[props.config.associationProp] === 1"
        style="width: 100%"
        v-model="initRows[props.config.key1]"
        :multiple="props.config.multiple"
        :collapseTags="props.config.multiple"
        filterable
        remote
        clearable
        reserve-keyword
        :placeholder="props.config.label || props.placeholder"
        :remote-method="query => remoteMethod(query, props.config)"
        :loading="props.config.remoteLoading"
        :disabled="props.disabled || props.config.disabled"
        @change="inputItemChange(itemData, props.config)"
        @blur="inputItemBlur(itemData, props.config)"
      >
        <el-option
          v-for="k in props.config.customRemote
            ? initRows[`${props.config.value}Options`]
            : props.config.options"
          :key="k.value"
          :label="k.label"
          :value="k.value"
        />
      </el-select>
    </template>
    <template />
    <el-date-picker
      v-if="
        props.config.type === 'datetimerange' ||
        props.config.type === 'datetimerange2' ||
        props.config.type === 'daterange' ||
        props.config.type === 'date' ||
        props.config.type === 'datetime' ||
        props.config.type === 'week' ||
        props.config.type === 'month' ||
        props.config.type === 'year'
      "
      style="width: 100%"
      v-model="itemData"
      :type="
        props.config.type === 'datetimerange2'
          ? 'datetimerange'
          : props.config.type === 'datetimerange'
          ? 'daterange'
          : props.config.type
      "
      :placeholder="props.config.label || props.placeholder"
      :default-time="props.config.defaultTime"
      :value-format="props.config.valueFormat || props.config.value_format || 'YYYY-MM-DD'"
      :format="props.config.format || 'YYYY-MM-DD'"
      :disabled="
        props.disabled ||
        props.config.disabled ||
        (initRows && initRows[`${props.config.value}Disabled`])
      "
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
      :disabled-date="props.config.disabledDate"
    />
    <el-checkbox-group
      style="width: 100%"
      :disabled="props.disabled || props.config.disabled"
      v-model="itemData"
      v-if="props.config.type === 'checkbox'"
    >
      <el-checkbox
        v-for="(j, k) in props.config.checkboxOption"
        :key="k"
        :label="j.label"
        :name="j.name"
        :disabled="j.disabled"
        @change="inputItemChange(itemData, props.config)"
        @blur="inputItemBlur(itemData, props.config)"
      />
    </el-checkbox-group>
    <el-radio-group
      style="width: 100%"
      :disabled="props.disabled || props.config.disabled"
      v-model="itemData"
      v-if="props.config.type === 'radio'"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
    >
      <el-radio
        v-for="(j, k) in props.config.radioOption"
        :key="k"
        :label="j.label"
        :disabled="j.disabled"
      />
    </el-radio-group>
    <el-switch
      style="width: 100%"
      :disabled="props.disabled || props.config.disabled"
      v-if="props.config.type === 'switch'"
      v-model="itemData"
      :active-value="props.config.activeValue ?? true"
      :inactive-value="props.config.inactiveValue ?? false"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
    />
    <el-input-number
      v-if="props.config.type === 'inputNumber'"
      :disabled="props.disabled || props.config.disabled"
      controls-position="right"
      v-model="itemData"
      :min="props.config.min"
      :max="props.config.max"
      :step="props.config.step"
      :controls="props.config.controls"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
      style="width: 100%"
      :precision="props.config.precision"
    />
    <el-cascader
      :disabled="props.disabled || props.config.disabled"
      style="width: 100%"
      v-if="props.config.type === 'cascader'"
      v-model="itemData"
      filterable
      :options="
        props.config.custom_options
          ? initRows[`${props.config.value}CascaderOption`]
          : props.config.cascaderOption
      "
      :props="props.config.cascaderProps ? props.config.cascaderProps : { checkStrictly: true }"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
      :clearable="props.config.clearable != undefined ? props.config.clearable : true"
    />
    <el-tree-select
      class="w-[100%]"
      v-if="props.config.type === 'tree_select'"
      v-model="itemData"
      :data="props.config.options"
      :render-after-expand="false"
      :multiple="props.config.multiple"
      :props="props.config.treeProps"
      :value-key="props.config?.treeProps?.valueKey ?? 'value'"
      :placeholder="props.config.label || props.placeholder"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
    />
    <el-select
      v-if="props.config.type === 'geto-staff'"
      :disabled="props.disabled || props.config.disabled"
      class="w-[100%] geto-staff"
      ref="selectRef"
      v-model="itemData"
      placeholder="请选择"
      clearable
      multiple
      @clear="resetCustom(props.config)"
      @visible-change="clearUserList"
      @change="inputItemChange(itemData, props.config)"
      @blur="inputItemBlur(itemData, props.config)"
    >
      <template #empty>
        <el-row class="min-h-100 max-h-400">
          <el-col :span="12">
            <el-scrollbar height="400px">
              <GetoTree
                :data="props.config.staffTree"
                :config="treeConfig"
                @handleNodeClick="dataNode => getoTreeClick(dataNode, props.config)"
                ref="getoTreeBox"
              />
            </el-scrollbar>
          </el-col>
          <el-col :span="12">
            <div class="h-[100%] pt-4 pb-12 px-2">
              <div class="box-title text-sm font-bold pr-2 cursor-pointer mb-2">
                已选择 {{ userTitle }}
              </div>
              <el-scrollbar class="relative" height="300px">
                <div class="custom-list">
                  <!-- 单选部分 -->
                  <el-radio-group v-model="radioUserId" class="!block" v-if="props.config.radio">
                    <div
                      class="box-title text-sm cursor-pointer"
                      v-for="ul in userList"
                      :key="ul.id"
                    >
                      <el-radio :label="ul.user_id">{{ ul.name }}</el-radio>
                    </div>
                  </el-radio-group>
                  <!-- 多选部分 -->
                  <div
                    v-else
                    class="box-title text-sm cursor-pointer"
                    v-for="ul in userList"
                    :key="ul.id"
                  >
                    <el-checkbox v-model="ul.check" :label="ul.name" />
                  </div>
                </div>
              </el-scrollbar>
              <div class="absolute bottom-3 right-5">
                <el-button size="small" type="primary" @click="treeClick">确定</el-button>
                <el-button size="small" @click="cancelTree">取消</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
    </el-select>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { searchRemoteMethod } from "./../GetoApi/search";
import GetoTree from "@/geto-components/GetoTree/index.vue";
import { Search } from "@element-plus/icons-vue";
defineOptions({
  name: "GetoInputItem"
});

const emits = defineEmits(["changeData", "setData", "blurData", "onSearchInput", "remoteMethod"]); // 定义发射给父组件的事件

const props = defineProps({
  config: {
    type: Object,
    default: () => {}
  },
  placeholder: {
    type: String,
    default: () => "请输入"
  },
  initData: {
    type: [String, Number, Array, Object],
    default: () => ""
  },
  initIndex: {
    type: Number,
    default: () => 0
  },
  initRows: {
    type: Object,
    default: () => {}
  },
  disabled: {
    type: Boolean,
    default: () => false
  }
});
const v2RemoteLoading = ref(false);

const radioUserId = ref(0);

const itemData = ref(props.initData);

// 远程搜索
const remoteMethod = (query, item) => {
  // 判断远程方法是自定义还是调用统一的方法
  console.log("item", item);
  if (item.customRemote) {
    emits("remoteMethod", query, item);
  } else {
    if (query) {
      item.remoteLoading = true;
      v2RemoteLoading.value = true;
      const column = item.value || item.column;
      // 这里写请求方法，可取item的url
      searchRemoteMethod({
        list_key: item.list_key,
        column: column,
        query: query
      })
        .then(res => {
          item.options = res.data;
        })
        .finally(() => {
          item.remoteLoading = false;
          v2RemoteLoading.value = false;
        });

      return;
    }
  }
};

// 返回编辑值
const onEditInput = (single = false) => {
  if (single) {
    return itemData.value;
  }
  const params = {};
  if (props.config.value) {
    params[props.config.value] = itemData.value;
  } else {
    params.value = itemData.value;
  }
  return params;
};
// 重置
const resetEditInput = () => {
  itemData.value = "";
};
// 获取当前表单项配置
const getFormItemConfig = () => {
  return props.config;
};
const inputItemChange = (row, config) => {
  emits("changeData", row, config);
};
const inputItemBlur = (row, config) => {
  emits("blurData", row, config);
};

// -----------------------------------------------------------人员选择器部分开始
const treeConfig = {
  showCheckbox: false,
  treePropsLabel: "name"
};
const userList = ref([]);
const userTitle = ref("");
const getoTreeBox = ref(null); // tree由于是循环生成的，所以ref会是个数组
const selectRef = ref(null);
const getoTreeClick = async (data, item) => {
  userList.value = [];
  userTitle.value = data.name;
  const res = await item.orgFunction({ org_id: data.id });
  if (res.code != "0") return;
  userList.value = res.data;
};
const treeClick = () => {
  if (props.config.radio) {
    const arr = userList.value
      .map(mitem => {
        const obj = {
          organization_id: mitem.organization_id,
          user_id: mitem.user_id,
          label: mitem.name
        };
        if (mitem.user_id === radioUserId.value) return obj;
      })
      .filter(fitem => !!fitem);
    itemData.value = arr;
    cancelTree();
  } else {
    const arr = userList.value
      .filter(item => item.check)
      .map(item => {
        const obj = {
          organization_id: item.organization_id,
          user_id: item.user_id,
          label: item.name
        };
        return obj;
      });
    if (itemData.value.length) {
      itemData.value = itemData.value || [];
      arr.forEach(newItem => {
        const exists = itemData.value.some(
          existingItem => existingItem.user_id === newItem.user_id
        );
        if (!exists) {
          itemData.value.push(newItem);
        }
      });
    } else {
      itemData.value = arr;
    }
  }
  // 自定义去重逻辑，基于 user_id 进行去重
  // 异步等待watch执行完毕
  // selectRef.value[item.treeId ?? 0].blur();
};
const resetCustom = formItem => {
  // 重置列表
  userList.value = [];
  getoTreeBox.value[formItem.treeId ?? 0].resetTree();
};
const cancelTree = () => {
  if (Array.isArray(selectRef.value)) {
    selectRef.value.forEach(item => {
      item.blur();
    });
  } else {
    selectRef.value.blur();
  }
};
const clearUserList = () => {
  userTitle.value = "";
  userList.value = [];
};
// -----------------------------------------------------------人员选择器部分结束
// 表单点击查询按钮时的方法
const onSearchInput = props => {
  emits("onSearchInput", props);
};
watch(itemData, val => {
  emits("setData", props.config.value, props.initIndex, val);
});

watch(props, val => {
  itemData.value = val.initData;
});

defineExpose({
  // 暴露出子组件方法
  onEditInput,
  resetEditInput,
  getFormItemConfig
});
</script>

<style lang="scss" scoped>
.geto-input-item {
  width: 100%;
}
</style>
