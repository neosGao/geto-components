<template>
  <MspTable
    ref="tableInfoRef"
    v-model="data"
    :columns="columns"
    :config="{ align: 'center', width: '220' }"
    :show-summary="showSummary"
    :summary-method="getSummaries"
    @change="handleChange"
    @remote-method="remoteMethod"
    @blur="handleBlur"
    showIndex
  >
    <template #tableOperations>
      <slot name="tableOperations" />
    </template>
    <template #custom="{ row, key, index, prop }">
      <slot name="custom" :row="row" :index="index" :key="key" :prop="prop" />
    </template>
    <template #action="{ row, key, index }">
      <slot name="action" :row="row" :index="index" :key="key" />
    </template>

    <template #tableAction>
      <slot name="tableAction" />
    </template>
  </MspTable>
  <el-button
    class="add-table-role-btn"
    :icon="Plus"
    @click="addRow"
    v-if="config.tableAddRow ?? true"
  />
</template>

<script lang="ts" setup>
import { ref, watch, unref, PropType } from "vue";
import { useVModel } from "@vueuse/core";
import { FormItemOptions, FieldType, FieldTypeKey, submitFormatDefaultValue } from "./config";
import { bindRelation, getRemoteOptions } from "./display";
import MspTable from "./components/MspTable/index.vue";
import { Plus } from "@element-plus/icons-vue";
import { cloneDeep } from "@pureadmin/utils";

defineOptions({
  name: "TableInfo",
  inheritAttrs: false
});

interface Config {
  tableAddRow: Boolean;
  tableExtensionFields?: Record<string, any>;
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<any[]>,
    required: true
  },
  columns: {
    type: Array as PropType<FormItemOptions[]>,
    required: true
  },
  showSummary: {
    type: Boolean,
    default: false
  },
  sumFields: {
    type: Array,
    default: () => []
  },
  moduleId: {
    type: Number,
    default: 0
  },
  config: {
    type: Object as PropType<Config>,
    default: () => ({
      tableAddRow: true
    })
  },
  // 获取表头数据，用于选项显隐取值
  findOtherModuleValue: {
    type: Function,
    default: () => {
      return {};
    }
  }
});

const emit = defineEmits(["update:modelValue", "change", "remote-method", "blur"]);

const tableInfoRef = ref<InstanceType<typeof MspTable> | null>(null);

const data = useVModel(props, "modelValue", emit);

function handleChange(value, key, index) {
  const item = props.columns.find(item => item.key === key);
  if (
    [FieldType.select, FieldType.radio, FieldType.checkbox].includes(
      FieldType[item.type as FieldTypeKey]
    )
  ) {
    handleConditions(data.value[index]);
  }

  emit("change", value, key, index);
}
const handleBlur = (value, key, index) => {
  emit("blur", value, key, index);
};

async function remoteMethod(value = "", key, index) {
  if (value === "") return;
  const curData = props.columns.find(item => item.key === key);
  if (curData && curData.remote_data) {
    data.value[index][`${key}Options`] = await getRemoteOptions(value, curData.remote_data);
  }

  emit("remote-method", value, key, index);
}

/**
 * @description 合计行
 */
function getSummaries(param) {
  const totalFields = props.sumFields;
  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "合计";
      return;
    }
    if (!totalFields.includes(column.property)) {
      sums[index] = "";
      return;
    }
    const values = data.map(item => Number(item[column.property]));
    if (!values.every(value => Number.isNaN(value))) {
      sums[index] = `${values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0)}`;
    } else {
      sums[index] = "";
    }
  });

  return sums;
}

const originRow = ref({});

watch(
  () => props.columns,
  newColumns => {
    const row = {};
    newColumns.forEach(col => {
      row[col.key] = col.value;
      row[`${col.key}Options`] = col.options;
      row[`${col.key}Show`] = !!col.display_switch;
    });
    if (props.config && props.config.tableExtensionFields) {
      const tableExtensionFields = props.config.tableExtensionFields;
      Object.keys(tableExtensionFields).forEach(item => {
        row[item] = tableExtensionFields[item];
      });
    }
    originRow.value = row;

    data.value.forEach(item => {
      handleConditions(item);
    });
  },
  {
    immediate: true
  }
);

function refreshConditions() {
  data.value.forEach(item => {
    handleConditions(item);
  });
}

/**
 * 验证条件(校验条件类型是否是表单，是表单调用父组件方法)
 */
function verificationConditions(relations, item) {
  const func = (rela, data) => {
    if (rela.type === "form_fields") {
      return props.findOtherModuleValue
        ? props.findOtherModuleValue(rela, data, props.moduleId)
        : {};
    }
    return item;
  };

  return bindRelation(relations, item, func);
}
function handleConditions(curData) {
  for (const col of props.columns) {
    const { field_show_relations, field_option_relations, display_switch } = col;

    // 如果列隐藏行逻辑就跳过执行
    if (!col.show) continue;

    // 字段显隐
    if (field_show_relations && field_show_relations.length) {
      const isShow = verificationConditions(field_show_relations, curData);
      // 取反
      curData[`${col.key}Show`] = display_switch ? !isShow : isShow;
    }

    // 字段显示才处理选项显隐
    if (curData[`${col.key}Show`] && field_option_relations && field_option_relations.length) {
      field_option_relations.forEach(option => {
        if (option.relations.length && curData[`${col.key}Options`]) {
          const curOption = curData[`${col.key}Options`].find(
            (item: any) => item.label === option.select_option
          );
          if (curOption) {
            const isShow = verificationConditions(option.relations, curData);
            curOption.show = isShow ? !option.is_show : !!option.is_show;
          }
        }
      });
    }
  }
}

async function getValue() {
  try {
    await tableInfoRef.value?.validate();
    const result = [];
    data.value.forEach(item => {
      const obj = [];
      props.columns.forEach(col => {
        let mode;
        if (col.type === "select" && col.attrs?.multiple) {
          mode = 2;
        }

        obj.push({
          field_id: col.id,
          value: submitFormatDefaultValue(unref(item[col.key]), FieldType[col.type], mode)
        });
      });
      result.push(obj);
    });
    return result;
  } catch (error) {
    throw new Error("表单校验失败");
  }
}

function setRowValue(index, value, key?: string) {
  let row = data.value[index];
  if (row) {
    if (key) {
      row[key] = value;
    } else {
      row = value;
    }
  }
}

/**
 * @description 设置下拉框选项
 * @param index 行索引
 * @param key   字段名
 * @param options 选项
 * @param value 值
 */
function setOptions(index, key, options, value?: any) {
  data.value[index][`${key}Options`] = options;
  if (value !== undefined) {
    data.value[index][key] = value;
  }
}

function getData() {
  return data.value;
}

const addRow = (row: {}, is_copy = false) => {
  if (is_copy) {
    data.value.push(cloneDeep(row));
    return;
  }
  data.value.push({
    ...row,
    ...cloneDeep(originRow.value)
  });

  handleConditions(data.value[data.value.length - 1]);
};

const deleteRow = index => {
  data.value.splice(index, 1);
};
const copyRow = index => {
  const row = cloneDeep(data.value[index]);

  const newData = {};
  props.columns.forEach(col => {
    newData[col.key] = row[col.key];
  });

  addRow(newData, true);
};

function setValue(value: any[]) {
  data.value = value;
  refreshConditions();
}

// 添加表格行（含自定义字段）
const addTableRow = (value?: any) => {
  const row = {};
  const columnKey = Object.keys(value);
  // 模板赋值
  props.columns.forEach(col => {
    if (columnKey && columnKey.length > 0) {
      // 针对自定义赋值（待优化）
      columnKey.forEach(item => {
        if (col.prop === item) {
          row[col.prop] = value[col.prop] ?? col.default_value;
        } else {
          row[item] = value[item];
        }
      });
    } else {
      row[col.prop] = value[col.prop] ?? col.default_value;
      row[`${col.prop}Options`] = col.options;
      row[`${col.prop}Show`] = col.show;
    }
  });
  data.value.push(row);
};

function getDefaultValue() {
  const result = [];
  data.value.forEach(item => {
    const obj = {};
    const columnKey = Object.keys(item);
    props.columns.forEach(col => {
      // obj[col.id] = unref(item[col.label]); // 原来的
      // obj[col.id] = unref(item[col.prop]);
      obj[col.prop] = unref(item[col.prop]);
      obj[`${col.prop}Options`] = col.options;
      obj[`${col.prop}Show`] = col.show;
      // 兼容自定义字段（待优化）
      columnKey.forEach(citem => {
        if (col.prop === citem) {
          obj[col.prop] = unref(item[col.prop]);
        } else {
          obj[citem] = unref(item[citem]);
        }
      });
    });
    // 扩展字段 添加 有问题：需要后续优化，目前时全部添加的
    if (props.config && props.config.tableExtensionFields) {
      Object.keys(props.config.tableExtensionFields).forEach(titem => {
        obj[titem] = unref(item[titem]) ?? "";
      });
    }
    result.push(obj);
  });
  return result;
}

/**
 * 设置行禁用
 * @param index 行索引
 * @param disabled 是否禁用
 */
const setRowDisabled = (index: number, disabled = true) => {
  const row = data.value[index];
  for (const col of props.columns) {
    row[`${col.key}Disabled`] = disabled;
  }
};

defineExpose({
  handleConditions,
  getValue,
  getData,
  getDefaultValue,
  setRowValue,
  setOptions,
  setValue,
  setRowDisabled,
  addRow,
  addTableRow,
  copyRow,
  deleteRow
});
</script>
<style scoped>
.add-table-role-btn {
  width: 100%;
  margin-top: -1px;
  border-radius: 0px;
  border-color: #ebeef5;
}
</style>
