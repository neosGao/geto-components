<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="字段隐藏条件设置"
      width="1400px"
      :close-on-click-modal="false"
      draggable
    >
      <el-form-item label="当前字段" required label-width="100">
        <el-input v-model="fieldName" readonly :style="{ width: '200px' }" />
      </el-form-item>
      <el-button text type="primary" @click="handleRowAdd">添加行</el-button>
      <el-row>
        <el-col :span="2">左括号</el-col>
        <el-col :span="3"><span class="required">关联字段</span></el-col>
        <el-col :span="2" />
        <el-col :span="5"><span class="required">关联选项</span></el-col>
        <el-col :span="5" />
        <el-col :span="2">右括号</el-col>
        <el-col :span="2">连接关系</el-col>
        <el-col :span="3" />
      </el-row>
      <div class="condition-box">
        <el-row
          class="mb-2"
          :gutter="6"
          align="middle"
          v-for="(item, index) in conditionData"
          :key="index"
        >
          <el-col :span="2"
            ><el-select v-model="item.left_parenthesis" clearable :disabled="isDisabled">
              <el-option
                v-for="item in leftParenthesisList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> </el-select
          ></el-col>
          <el-col :span="3">
            <el-select
              v-model="item.field_module_id"
              clearable
              @change="val => selectChange(val, index)"
              :disabled="isDisabled"
            >
              <el-option
                v-for="item in fieldList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> </el-select
          ></el-col>
          <el-col :span="2"><span>当字段选中选项</span></el-col>
          <el-col :span="5">
            <el-select
              v-model="item.choose_value"
              multiple
              clearable
              :style="{ width: '100%' }"
              :disabled="isDisabled"
            >
              <el-option
                v-for="opt in item.option_value"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select
              v-model="item.choose_value_type"
              clearable
              :style="{ width: '100px' }"
              :disabled="isDisabled"
            >
              <el-option
                v-for="item in optionConditionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span
              >时，当前字段才<span class="text-red-500">{{
                displaySwitch ? "隐藏" : "显示"
              }}</span></span
            ></el-col
          >
          <el-col :span="2"
            ><el-select v-model="item.right_parenthesis" clearable :disabled="isDisabled">
              <el-option
                v-for="item in rightParenthesisList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> </el-select
          ></el-col>
          <el-col :span="2"
            ><el-select v-model="item.connection_relation" clearable :disabled="isDisabled">
              <el-option
                v-for="item in connectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> </el-select
          ></el-col>
          <el-col :span="3" v-if="!isDisabled">
            <el-button size="small" type="primary" text @click="handleOperateCopy(item)"
              >复制</el-button
            >
            <el-button size="small" type="danger" text @click="handleOperateDelete(index)"
              >删除</el-button
            >
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <div class="flex justify-center">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, inject } from "vue";
import { buildUUID } from "@pureadmin/utils";
import { fieldOptionList } from "@/geto-components/GetoApi/field-list";
import { ElMessage } from "element-plus";

interface optionValue {
  value: number | string;
  label: string;
}

defineOptions({
  name: "heddenLink"
});

const emit = defineEmits(["confirm"]);

const dialogVisible = ref(false);

interface ConditionData {
  id: string;
  left_parenthesis: string;
  field_id: number[];
  choose_value: (number | string)[];
  choose_value_type: string;
  right_parenthesis: string;
  connection_relation: string;
  module_id: number;
  field_module_id: string;
  option_value: optionValue[];
  type: string;
  table_field: string;
}

const conditionData = ref<ConditionData[]>([]);

const leftParenthesisList = ref([
  { value: "(", label: "(" },
  { value: "((", label: "((" },
  { value: "(((", label: "(((" }
]);

const rightParenthesisList = ref([
  { value: ")", label: ")" },
  { value: "))", label: "))" },
  { value: ")))", label: ")))" }
]);

const connectList = ref([
  { value: "and", label: "并且" },
  { value: "or", label: "或者" }
]);
const optionConditionList = ref([
  { value: 1, label: "其中一个" },
  { value: 2, label: "全部选项" }
]);

const fieldList = ref([]);

const fieldName = ref("");
const fieldIndex = ref(undefined);
// 字段显隐状态 0隐藏 1显示
const displaySwitch = ref(0);

const isDisabled = inject("isDisabled", false);

const show = (field, data, fieldOptions) => {
  fieldName.value = field.fieldName;
  fieldIndex.value = field.index;
  displaySwitch.value = field.displaySwitch;

  fieldList.value = fieldOptions;
  conditionData.value = data;
  dialogVisible.value = true;
};

const getFieldOption = async (id): Promise<optionValue[]> => {
  const result = await fieldOptionList({ field_id: id });
  return result.data || [];
};

const validate = () => {
  const validateField = ["choose_value", "field_module_id", "choose_value_type"];

  const isEmpt = value => (Array.isArray(value) ? value.length : value !== "");

  const validate = conditionData.value.every(item => {
    return validateField.every(field => {
      return item[field] && isEmpt(item[field]);
    });
  });

  return validate;
};

const handleRowAdd = () => {
  if (validate()) {
    conditionData.value.push({
      id: buildUUID(),
      field_id: [],
      left_parenthesis: "",
      choose_value: [],
      choose_value_type: "",
      right_parenthesis: "",
      connection_relation: "",
      module_id: undefined,
      field_module_id: "",
      option_value: [],
      type: "",
      table_field: ""
    });
  } else {
    ElMessage.error("请先完善当前行数据");
  }
};

const handleOperateCopy = (item: any) => {
  conditionData.value.push({
    ...item,
    id: buildUUID()
  });
};

const handleOperateDelete = (index: number) => {
  conditionData.value.splice(index, 1);
};

const handleConfirm = () => {
  if (validate()) {
    emit("confirm", "field_show_relations", fieldIndex.value, conditionData.value);
    dialogVisible.value = false;
  } else {
    ElMessage.error("请先完善数据");
  }
};

const handleCancel = () => {
  if (!validate()) {
    const lastIndex = conditionData.value.length - 1;
    conditionData.value.splice(lastIndex, 1);
  }
  dialogVisible.value = false;
};

const selectChange = async (value, index) => {
  const opt = fieldList.value.find(item => item.value === value);
  if (opt) {
    conditionData.value[index].type = opt.type;
    conditionData.value[index].field_id = opt.field_id;
    conditionData.value[index].module_id = opt.module_id;
    conditionData.value[index].table_field = opt.table_field;
    conditionData.value[index].option_value = await getFieldOption(opt.field_id);
  }
};

defineExpose({
  show
});
</script>
<style lang="scss" scoped>
::v-deep(.el-dialog__body) {
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
.condition-box {
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.required {
  position: relative;
}
.required::before {
  content: "*";
  position: absolute;
  top: 0;
  left: -10px;
  color: #ff4d4f;
}
</style>
