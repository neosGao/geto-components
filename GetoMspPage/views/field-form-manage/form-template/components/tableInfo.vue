<template>
  <div>
    <div class="flex justify-end" v-if="!isDisabled">
      <el-button type="primary" link @click="handleTableAdd">增行</el-button>
      <el-button type="primary" link @click="handleDelete">删行</el-button>
    </div>
    <div class="table-wrap">
      <MspTable
        :columns="tableColumns"
        :config="tableConfig"
        v-model="tableData"
        size="small"
        selection
        border
        @selection-change="handleSelectionChange"
        @change="handleTableChange"
        @remote-method="handleRemoteMethod"
        :disabled="isDisabled"
        :height="moduleType === 'table' ? 300 : 400"
      >
        <template #custom="{ row, key, index }">
          <div v-if="key === 'default_value'">
            <template v-if="row.field_type === FieldType.input">
              <el-input
                v-model="row.default_value"
                :maxlength="row.char_max_length"
                :placeholder="row.placeholder"
                :disabled="isDisabled"
              />
            </template>
            <template v-if="row.field_type === FieldType.inputNumber">
              <el-input-number
                style="width: 100%"
                v-model="row.default_value"
                :controls="false"
                :precision="row.max_decimal_place"
                :disabled="isDisabled"
              />
            </template>
            <template v-if="row.field_type === FieldType.select">
              <el-select
                v-model="row.default_value"
                :multiple="row.option_interactive_mode === 2"
                :filterable="row.can_fuzzy_search === 1 || row.is_remote === 1"
                :remote="row.is_remote === 1"
                :remote-method="
                  row.is_remote === 1
                    ? value => handleRemoteMethodSelect(value, index, row.remote_data)
                    : null
                "
                clearable
                class="w-full"
                :disabled="isDisabled"
              >
                <el-option
                  v-for="item in row.option_value"
                  :value="item.value"
                  :label="item.label"
                  :key="item.value"
                />
              </el-select>
            </template>
            <template v-if="row.field_type === FieldType.radio">
              <el-radio-group v-model="row.default_value" :disabled="isDisabled">
                <el-radio v-for="item in row.option_value" :label="item.value" :key="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </template>
            <template v-if="row.field_type === FieldType.checkbox">
              <el-checkbox-group v-model="row.default_value" :disabled="isDisabled">
                <el-checkbox v-for="item in row.option_value" :label="item.value" :key="item.value">
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </template>

            <template v-if="row.field_type === FieldType.date">
              <el-date-picker
                v-model="row.default_value"
                type="date"
                style="width: 100%"
                :placeholder="row.placeholder"
                :disabled="isDisabled"
              />
            </template>
            <template v-if="row.field_type === FieldType.daterange">
              <el-date-picker
                v-model="row.default_value"
                type="daterange"
                :placeholder="row.placeholder"
                :disabled="isDisabled"
                style="width: 100%"
            /></template>
            <template v-if="row.field_type === FieldType.textarea">
              <el-input
                v-model="row.default_value"
                :rows="2"
                type="textarea"
                :placeholder="row.placeholder"
                :maxlength="row.char_max_length"
                :disabled="isDisabled"
            /></template>
          </div>
          <span
            class="text-blue-500 cursor-pointer"
            v-if="isSetFieldCondition(key, row)"
            @click="setCondition('field', row, index)"
            >设置({{ row.field_show_relations.length }})</span
          >
          <span
            class="text-blue-500 cursor-pointer"
            v-if="
              key === 'field_option_relations' &&
              [FieldType.select, FieldType.radio, FieldType.checkbox].includes(row.field_type)
            "
            @click="setCondition('option', row, index)"
            >设置</span
          >
          <div v-if="key === 'sort'" class="flex justify-center cursor-move">
            <IconifyIconOffline :icon="menuFill" class="sort-icon" />
          </div>
        </template>
      </MspTable>

      <div v-if="moduleType === 'table'">
        <el-form-item label="是否显示合计行">
          <el-radio-group v-model="tableIsSum">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="统计字段" v-if="tableIsSum === 1">
          <el-select v-model="tableSumFields" multiple>
            <el-option
              v-for="item in totalFields"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
    </div>
    <HiddenLink ref="fieldRef" @confirm="conditionConfirm" />
    <OptionLink ref="optionRef" @confirm="conditionConfirm" />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, inject } from "vue";
import { buildUUID } from "@pureadmin/utils";
import { useVModel } from "@vueuse/core";
import MspTable from "@/geto-components/GetoMspPage/components/MspTable/index.vue";
import HiddenLink from "./hiddenLink.vue";
import OptionLink from "./optionLink.vue";
import menuFill from "@iconify-icons/ri/menu-fill";
import { FormItemType } from "@/geto-components/GetoMspPage/components/MspForm/types";
import { fieldSelectList } from "@/geto-components/GetoApi/field-list";
import { formatDefaultValueDetails, FieldType } from "@/geto-components/GetoFormDisplay/config";
import { getSelectOptions } from "@/geto-components/GetoFormDisplay/display";

interface TableData {
  field_id: string;
  field_name: string;
  field_type: string;
  default_value: string;
  status: number;
  requreid_when_save: string;
  display_switch: string;
  field_show_relations: Object;
  field_option_relations: Object;
  sort: number;
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<TableData[]>,
    default: () => []
  },
  isSum: Number,
  sumFields: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  getSelectedFields: {
    type: Function,
    default: () => {}
  },
  moduleId: {
    type: Number,
    required: true
  },
  moduleType: {
    type: String,
    required: true
  }
});

defineOptions({
  name: "TableInfo"
});

const emit = defineEmits(["update:modelValue", "update:isSum", "update:sumFields"]);

const isDisabled = inject("isDisabled", false);

const tableColumns = ref<FormItemType[]>([
  {
    label: "字段名称",
    type: "select",
    key: "field_id",
    options: [],
    width: 200,
    attrs: {
      remote: true,
      filterable: true,
      loading: false
    }
  },
  {
    label: "字段类型",
    key: "field_type_name",
    type: "text",
    width: 120
  },
  {
    label: "默认值",
    key: "default_value",
    type: "custom",
    width: 260
  },
  {
    label: "状态",
    type: "radio",
    key: "status",
    width: 260,
    options: [
      { value: 0, label: "不限" },
      { value: 1, label: "必填" },
      { value: 2, label: "不可维护" }
    ]
  },
  {
    key: "required_when_save",
    label: "保存是否必填",
    type: "select",
    options: [
      { value: 1, label: "是" },
      { value: 0, label: "否" }
    ],
    width: 120
  },
  {
    key: "display_switch",
    label: "字段默认显示/隐藏",
    type: "select",
    options: [
      { value: 1, label: "显示" },
      { value: 0, label: "隐藏" }
    ],
    width: 120
  },
  {
    key: "field_show_relations",
    label: "字段显/隐条件",
    type: "custom",
    width: 100
  },
  {
    key: "field_option_relations",
    label: "选项显/隐条件",
    type: "custom",
    width: 100
  },
  {
    key: "sort",
    label: "排序",
    type: "custom",
    width: 80
  }
]);
const tableConfig = ref({
  align: "center"
});

const tableData = useVModel(props, "modelValue", emit);
const tableIsSum = useVModel(props, "isSum", emit);
const tableSumFields = useVModel(props, "sumFields", emit);

const totalFields = computed(() => {
  const result = [];
  for (const item of tableData.value) {
    if (item.field_type === FieldType.inputNumber) {
      result.push({
        value: item.field_name,
        label: item.field_name
      });
    }
  }
  return result;
});

const handleTableAdd = () => {
  tableData.value.push({
    sort: tableData.value.length + 1,
    id: buildUUID(),
    field_id: "",
    field_name: "",
    default_value: "",
    field_type_name: "",
    status: "",
    required_when_save: "",
    display_switch: 1,
    field_show_relations: [],
    field_option_relations: []
  });
};

const selectedRows = ref<TableData[]>([]);
const handleSelectionChange = (value: TableData[]) => {
  selectedRows.value = value;
};
const handleDelete = () => {
  tableData.value = tableData.value.filter(item => !selectedRows.value.includes(item));
  selectedRows.value = [];
};

const fieldRef = ref<InstanceType<typeof HiddenLink> | null>(null);
const optionRef = ref<InstanceType<typeof OptionLink> | null>(null);

const returnFields = fieldId => {
  let fields = [];
  if (props.moduleType === "form") {
    const getFields = ["form_fields"];
    fields = props.getSelectedFields(getFields);
  } else {
    const getFields = ["form_fields", "table_fields"];
    fields = props.getSelectedFields(getFields, props.moduleId, "table_fields");
  }

  fields = fields
    .map(e => ({
      ...e,
      label: `${e.field_name}(${e.key})`,
      value: `${e.field_id}(${e.module_id})`
    }))
    .filter(e => e.field_id !== fieldId);

  return fields;
};

const setCondition = (type: "field" | "option", row, index: number) => {
  const modulesConditionFieldList = returnFields(row.field_id);
  const params = {
    fieldId: row.field_id,
    fieldName: row.field_name,
    displaySwitch: row.display_switch,
    index
  };
  if (type === "field") {
    fieldRef.value.show(params, row.field_show_relations, modulesConditionFieldList);
  } else {
    let conditionData = [];
    if (row.field_option_relations.length) {
      conditionData = row.field_option_relations;
    } else {
      conditionData = row.option_value.map(e => {
        return {
          select_option: e.label,
          isShow: 0,
          relations: []
        };
      });
    }

    optionRef.value.show(params, conditionData, modulesConditionFieldList);
  }
};

const getValue = () => {
  return tableData.value;
};

// 所选字段
const curModuleSelectedFields = computed(() => {
  const fields = props.getSelectedFields(["form_fields", "table_fields"], props.moduleId);
  return fields.length ? fields.map(e => e.field_id) : [];
});

const handleRemoteMethod = async (query: string, key: string, index: number) => {
  const result = await fieldSelectList({ field_name: query });
  if (result.code === "0") {
    // 过滤已选字段
    const data = result.data.filter(e => !curModuleSelectedFields.value.includes(e.field_id));

    const options = data.map(item => ({
      ...item,
      value: item.field_id,
      label: item.field_name
    }));
    tableData.value[index][`${key}Options`] = options;
  }
};

const handleTableChange = (value, key, index) => {
  if (key === "field_id") {
    const row = tableData.value[index];
    const optionkey = `${key}Options`;
    const option = row[optionkey].find(item => item.value === value);
    if (option) {
      row.field_name = option.label;
      row.field_type = option.field_type;
      row.field_type_name = option.field_type_name;
      row.option_interactive_mode = option.option_interactive_mode;
      row.field_config = option;

      row.option_value = option.option_value;
      row.default_value = formatDefaultValueDetails(
        option.field_type,
        option.default_value,
        option.option_interactive_mode
      );
    }
  }
};

const conditionConfirm = (key, index, data) => {
  tableData.value[index][key] = data;
};

const handleRemoteMethodSelect = async (value, index, remote) => {
  if (value === "") return;
  const { data, code } = await getSelectOptions(remote.method, {
    [remote.param]: value
  });
  if (code === "0") {
    tableData.value[index].option_value = data;
  }
};

const isSetFieldCondition = computed(() => {
  return (key, row) => {
    if (
      key !== "field_show_relations" ||
      (props.moduleType === "table" && row.display_switch === 0)
    ) {
      return false;
    }
    return true;
  };
});

defineExpose({
  getValue
});
</script>
<style lang="scss" scoped>
.table-wrap {
  height: 400px;
  overflow-y: scroll;
}
</style>
