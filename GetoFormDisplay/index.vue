<template>
  <div>
    <slot name="operateBar" />
    <template v-for="(item, dIndex) in displayData" :key="item.moduleId">
      <div v-show="item.showModule">
        <slot name="moduleName" :moduleId="item.moduleId" :moduleName="item.moduleName">
          <p
            class="font-bold leading-10 border-b-2 border-dashed border-gray-300 mb-4"
            v-if="config.showModuleName ?? false"
          >
            {{ item.moduleName }}
          </p>
        </slot>
        <slot
          name="form"
          :options="item.form?.options"
          :moduleId="item.moduleId"
          :moduleName="item.moduleName"
        >
          <template v-if="item.form">
            <slot v-if="item?.customSlotForm" name="customSlotForm" :itemConfig="item" />
            <FormInfo
              v-else
              :ref="el => (formInfoRef[dIndex] = el)"
              v-model="item.form.data"
              :options="item.form.options"
              :label-wdith="config.labelWidth ?? '140px'"
              :disabled="disabled"
              @change="(v, k) => handleChange(v, k, item.moduleId, item.moduleName)"
              @blur="(v, k) => handleBlur(v, k, item.moduleId, item.moduleName)"
              @remote-method="
                (v, k, c) => handleRemoteMethod(v, k, c, item.moduleId, item.moduleName)
              "
            >
              <template #customForm="{ formItem, disabled }">
                <slot
                  name="customForm"
                  :formItem="formItem"
                  :disabled="disabled"
                  :moduleItem="item"
                />
              </template>
            </FormInfo>
          </template>
        </slot>

        <slot
          name="table"
          :columns="item.table?.columns"
          :moduleId="item.moduleId"
          :moduleName="item.moduleName"
          :show-summary="!!item.is_sum"
          :summary-fields="item.sum_fields"
        >
          <template v-if="item.table">
            <slot v-if="item?.customSlotTable" name="customSlotTable" :itemConfig="item" />
            <TableInfo
              v-else
              :ref="el => (tableInfoRef[dIndex] = el)"
              v-model="item.table.data"
              :columns="item.table.columns"
              :show-summary="!!item.is_sum"
              :summary-fields="item.sum_fields"
              :disabled="disabled"
              :findOtherModuleValue="findOtherModuleValue"
              @change="(v, k, i) => handleTableChange(v, k, i, item.moduleId, item.moduleName)"
              @blur="(v, k, i) => handleTableBlur(v, k, i, item.moduleId, item.moduleName)"
              :config="{
                ...item.table.config,
                tableAddRow: config.tableAddRow ?? true
              }"
            >
              <template #tableOperations>
                <slot name="tableOperations" :columns="item.table.columns" :tableItem="item" />
              </template>
              <template #custom="{ row, key, index, prop }">
                <slot
                  name="custom"
                  :row="row"
                  :index="index"
                  :key="key"
                  :prop="prop"
                  :tableItem="item"
                />
              </template>
              <template #action="{ row, key, index }">
                <slot name="action" :row="row" :index="index" :key="key" :tableItem="item" />
              </template>

              <template #tableAction>
                <slot
                  name="tableAction"
                  :moduleId="item.moduleId"
                  :moduleName="item.moduleName"
                  :moduleIndex="dIndex"
                />
              </template>
            </TableInfo>
          </template>
        </slot>
        <slot name="afterTable" v-if="item?.after" />

        <slot name="custom" :moduleId="item.moduleId" :moduleName="item.moduleName" />
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, PropType, provide } from "vue";
import { DisplayConfig, FormItemOptions, resultDisplayData } from "./config";
import { bindRelation } from "./display";
import { ElMessage } from "element-plus";
import FormInfo from "./form.vue";
import TableInfo from "./table.vue";

defineOptions({
  name: "GetoFormDisplay"
});

type NumberOrString = number | string;

interface Config {
  labelWidth?: number | string;
  showModuleName?: Boolean;
  tableAddRow?: Boolean;
}

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    required: true
  },
  config: {
    type: Object as PropType<Config>,
    default: () => ({
      labelWidth: "140px",
      showModuleName: false,
      tableAddRow: true
    })
  },
  action: Boolean,
  tableExtensionFields: {
    type: Object as PropType<any>,
    default: () => {}
  },
  disabled: Boolean
});

const emit = defineEmits([
  "form-change",
  "table-change",
  "form-blur",
  "table-blur",
  "form-remote-method"
]);

const displayData = ref<DisplayConfig[]>([]);
const formInfoRef = ref<InstanceType<typeof FormInfo> | []>([]);
const tableInfoRef = ref<InstanceType<typeof TableInfo> | []>([]);

watch(
  () => props.data,
  newValue => {
    displayData.value = resultDisplayData(newValue, {
      action: props.action,
      tableExtensionFields: props.tableExtensionFields
    });
    // 默认执行一遍
    setFieldShow();
  },
  {
    immediate: true,
    deep: true
  }
);

/**
 * @description 表单数据变化
 * @param value 值
 * @param key   选项key
 * @param moduleId 模块id
 */
const handleChange = (value, key, moduleId, moduleName) => {
  emit("form-change", value, key, moduleId, moduleName);
};

/**
 * @description 表格数据变化
 * @param value 值
 * @param key   选项key
 * @param index 行索引
 * @param moduleId 模块id
 */
function handleTableChange(value, key, index, moduleId, moduleName) {
  emit("table-change", value, key, index, moduleId, moduleName);
}

/**
 * @description 表格数据变化
 * @param value 值
 * @param key   选项key
 * @param index 行索引
 * @param moduleId 模块id
 */
function handleTableBlur(value, key, index, moduleId, moduleName) {
  emit("table-blur", value, key, index, moduleId, moduleName);
}

/**
 * @description 表单失去焦点的回调
 * @param value 值
 * @param key   选项key
 * @param moduleId 模块id
 */
const handleBlur = (value, key, moduleId, moduleName) => {
  emit("form-blur", value, key, moduleId, moduleName);
};

/**
 * @description 表单失去焦点的回调
 * @param value 值
 * @param key   选项key
 * @param curData   当前表单配置
 * @param moduleId 模块id
 * @param moduleName 模块名称
 */
const handleRemoteMethod = (value, key, curData, moduleId, moduleName) => {
  emit("form-remote-method", value, key, curData, moduleId, moduleName);
};

provide("FormChange", setFieldShow);
/**
 * 表头值改变时，设置表头显示
 */
function setFieldShow() {
  displayData.value.forEach((item, index) => {
    const { form, table, moduleId } = item;
    if (form) {
      // 表头信息
      form.options.forEach((field: FormItemOptions) => {
        setFieldShowRelations(field, form.data, moduleId);
        setFieldOptionRelations(field, form.data, moduleId);
      });
    }
    if (table) {
      const formData = form ? form.data : {};

      for (const col of table.columns) {
        const { key, display_switch, field_show_relations } = col;

        // 跳过不需要显示的列或者没有相关条件的列
        if (key === "action" || display_switch === 0) {
          continue;
        }

        const formConditions = filterRelationsByType(field_show_relations, "form_fields");
        // const tableConditions = filterRelationsByType(field_show_relations, "table_fields");

        if (formConditions.length) {
          const isFormShow = bindRelation(formConditions, formData, (rela, data) =>
            findOtherModuleValue(rela, data, moduleId)
          );
          col.show = !display_switch ? isFormShow : !isFormShow;
        }

        // // 处理列的选项关联
        // setFieldOptionRelations(col, formData, moduleId);

        // // 遍历表格数据设置每行数据的显示和选项
        // table.data.forEach(row => {
        //   row[`${col.key}Show`] = col.show ? bindRelation(tableConditions, row) : row[col.key];

        //   if (isSelectableType(col.type)) {
        //     row[`${col.key}Options`] = col.options;
        //   }
        // });
      }

      table.data.forEach(row => {
        tableInfoRef.value[index].handleConditions(row);
      });
    }
  });
}

function filterRelationsByType(relations, type) {
  return relations.filter(rela => rela.type === type);
}

function isSelectableType(type) {
  return ["select", "radio", "checkbox"].includes(type);
}

function setFieldShowRelations(field: FormItemOptions, formData: any, moduleId: number) {
  if (!field.field_show_relations.length) {
    return;
  }
  const isShow = bindRelation(field.field_show_relations, formData, (rela, data) =>
    findOtherModuleValue(rela, data, moduleId)
  );
  field.show = isShow ? !field.display_switch : !!field.display_switch;
}

function setFieldOptionRelations(field: FormItemOptions, formData: any, moduleId: number) {
  if (!field.field_option_relations || !field.field_option_relations.length) {
    return;
  }

  for (const option of field.field_option_relations) {
    if (!option.relations.length) continue;

    const index = field.options.findIndex((item: any) => item.label === option.select_option);

    if (index > -1) {
      const isShow = bindRelation(option.relations, formData, (rela, data) =>
        findOtherModuleValue(rela, data, moduleId)
      );

      field.options[index].show = isShow ? !option.is_show : !!option.is_show;
    }
  }
}

// 查找表单条件关联值
function findOtherModuleValue(rela, data, moduleId: number) {
  if (rela.module_id === moduleId) {
    return data;
  }
  const module = displayData.value.find(item => item.moduleId === rela.module_id);
  const key = rela.type === "form_fields" ? "form" : "table";

  return module && module[key] ? module[key].data : {};
}

// 匹配模块
function findIndexModule(moduleNameOrId: NumberOrString): number {
  return displayData.value.findIndex(
    item => item.moduleName === moduleNameOrId || item.moduleId === moduleNameOrId
  );
}

async function getValue(filterModule?: string[]) {
  const result = [];
  for (const [index, item] of Object.entries(displayData.value)) {
    if (filterModule && filterModule.includes(item.moduleName)) continue;
    let form = {};
    let table = [];
    if (item.form) {
      form = await formInfoRef.value[index].getValue();
    }
    if (item.table) {
      table = await tableInfoRef.value[index].getValue();
    }
    const modules = {
      moduleId: item.moduleId,
      moduleKey: item.moduleKey,
      moduleName: item.moduleName,
      form,
      table
    };
    result.push(modules);
  }

  return result;
}

/**
 * @description 设置表单值
 * @param moduleNameOrId 模块名称或id
 * @param value 值
 * @param key 选项key
 */
function setFormValue(moduleNameOrId: NumberOrString, value, key?: string) {
  const findIndex = findIndexModule(moduleNameOrId);
  if (findIndex > -1) {
    formInfoRef.value[findIndex].setValue(value, key);
  }
}

/**
 * @description 设置表格值
 * @param moduleName 模块名称
 * @param value 值
 */
function setTableValue(moduleNameOrId: NumberOrString, value, index, key?: string) {
  const findIndex = findIndexModule(moduleNameOrId);
  const module = displayData.value[findIndex];
  if (module && module.table) {
    if (module.table.data[index]) {
      if (key) {
        module.table.data[index][key] = value;
      } else {
        module.table.data[index] = value;
      }
    }
  }
}

function setTableItemValue(moduleNameOrId, value, index, key?: string) {
  const findIndex = findIndexModule(moduleNameOrId);
  const item = displayData.value[findIndex];
  if (item && item.table && item.table.data[index]) {
    if (key) {
      item.table.data[index][key] = value;
    } else {
      item.table.data[index] = value;
    }
  }
  // 强制更新子组件的值
  tableInfoRef.value[findIndex].setValue(item.table.data);
}

/**
 * @description 设置表格行值
 * @param moduleNameOrId 模块名称或id
 * @param value 值
 * @param index 行索引
 * @param key 选项key
 */
function setTableRowValue(moduleNameOrId: NumberOrString, value, index, key?: string) {
  const findIndex = findIndexModule(moduleNameOrId);
  if (findIndex > -1) {
    tableInfoRef.value[findIndex].setRowValue(index, value, key);
  }
}

function setFormOptions(moduleNameOrId: NumberOrString, key, options, value?: any) {
  const findIndex = findIndexModule(moduleNameOrId);
  if (findIndex > -1) {
    formInfoRef.value[findIndex].setOptions(key, options, value);
  }
}

function setTableOptions(moduleNameOrId: NumberOrString, index, key, options, value?: any) {
  const findIndex = findIndexModule(moduleNameOrId);
  if (findIndex > -1) {
    tableInfoRef.value[findIndex].setOptions(index, key, options, value);
  }
}

function deleteTableRow(index: number, module_id: number) {
  tableInfoRef.value[module_id].deleteRow(index);
}
function copyTableRow(index: number, module_id: number) {
  tableInfoRef.value[module_id].copyRow(index);
}

function getTableData() {
  return tableInfoRef.value[0].getData();
}

// 获取当前模块的表单数据
function getFormValue(moduleNameOrId) {
  const findIndex = findIndexModule(moduleNameOrId);
  if (findIndex === -1) return;
  return formInfoRef.value[findIndex].getDefaultValue();
}

// 获取表格模块的数据
function getTableValue(moduleNameOrId) {
  const findIndex = findIndexModule(moduleNameOrId);
  if (findIndex === -1) return;
  return tableInfoRef.value[findIndex].getDefaultValue();
}

// 获取表格模块的数据
function getFormItemData(moduleName) {
  const item = displayData.value.find(item => item.moduleName === moduleName);
  return item || {};
}

// 新增表格行
const addTableRow = (moduleNameOrId: NumberOrString, data: any) => {
  const findIndex = findIndexModule(moduleNameOrId);
  if (findIndex > -1) {
    tableInfoRef.value[findIndex].addTableRow(data);
    tableInfoRef.value[findIndex].getDefaultValue(data);
  }
};

// 表格赋值
function setTableData(moduleNameOrId, data) {
  const findIndex = findIndexModule(moduleNameOrId);
  if (findIndex > -1) {
    tableInfoRef.value[findIndex].setValue(data);
  }
}

function setTableRowDisabled(moduleNameOrId: NumberOrString, index: number, disabled = true) {
  const findIndex = findIndexModule(moduleNameOrId);
  if (findIndex > -1) {
    tableInfoRef.value[findIndex].setRowDisabled(index, disabled);
  }
}

async function validateTable() {
  for (const item of displayData.value) {
    const { columns, data } = item.table;

    for (const dataItem of data) {
      for (const col of columns) {
        if (
          col.required &&
          col.key !== "action" &&
          (dataItem[col.key] === "" || dataItem[col.key] == null) &&
          dataItem[`${col.key}Show`]
        ) {
          const msg = `${col.label}不能为空`;
          ElMessage.warning(msg);
          return Promise.reject(msg);
        }
      }
    }
  }

  return Promise.resolve();
}

defineExpose({
  getValue,
  setFormValue,
  setTableValue,
  setTableItemValue,
  setTableRowValue,
  setFormOptions,
  setTableOptions,
  setTableRowDisabled,
  deleteTableRow,
  copyTableRow,
  getTableData,
  getFormValue,
  getTableValue,
  getFormItemData,
  addTableRow,
  setTableData,
  validateTable
});
</script>
<style scoped></style>
