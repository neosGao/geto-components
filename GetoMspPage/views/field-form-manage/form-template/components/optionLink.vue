<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="选项显/隐条件设置"
      width="1400px"
      :close-on-click-modal="false"
      draggable
    >
      <div class="pb-2">
        <span class="mr-2 required">当前字段</span>
        <el-input v-model="fieldName" readonly :style="{ width: '200px' }" />
      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item
          :name="conditionIndex"
          v-for="(condition, conditionIndex) in conditionData"
          :key="conditionIndex"
        >
          <template #title>
            <span class="mr-2">{{ condition.select_option }}</span>
            <el-select v-model="condition.is_show" clearable :disabled="isDisabled">
              <el-option label="显示" :value="1" />
              <el-option label="隐藏" :value="0" />
            </el-select>
            <span class="text-black-500 cursor-pointer ml-2" v-if="condition.relations.length > 0"
              >( {{ condition.relations.length }}个关联字段 )</span
            >
            <div v-if="!isDisabled">
              <span
                class="text-blue-500 cursor-pointer ml-2"
                v-if="condition.relations.length > 0"
                @click="cancelLink(conditionIndex)"
                >取消关联</span
              >
              <span class="text-blue-500 cursor-pointer ml-2" v-else>添加关联</span>
            </div>
          </template>

          <el-button text type="primary" @click="handleRowAdd(conditionIndex)" v-if="!isDisabled"
            >添加行</el-button
          >
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
              v-for="(item, index) in condition.relations"
              :key="index"
            >
              <el-col :span="2"
                ><el-select v-model="item.left_parenthesis" clearable :disabled="isDisabled">
                  <el-option
                    v-for="opt in leftParenthesisList"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  /> </el-select
              ></el-col>
              <el-col :span="3">
                <el-select
                  v-model="item.field_module_id"
                  clearable
                  @change="val => selectChange(val, conditionIndex, index)"
                  :disabled="isDisabled"
                >
                  <el-option
                    v-for="opt in fieldList"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
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
                    v-for="opt in optionConditionList"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
                <span
                  >时，当前字段才<span class="text-red-500">{{
                    condition.is_show === 1 ? "隐藏" : "显示"
                  }}</span></span
                ></el-col
              >
              <el-col :span="2"
                ><el-select v-model="item.right_parenthesis" clearable :disabled="isDisabled">
                  <el-option
                    v-for="opt in rightParenthesisList"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  /> </el-select
              ></el-col>
              <el-col :span="2"
                ><el-select v-model="item.connection_relation" clearable :disabled="isDisabled">
                  <el-option
                    v-for="opt in connectList"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  /> </el-select
              ></el-col>
              <el-col :span="3" v-if="!isDisabled">
                <el-button
                  size="small"
                  type="primary"
                  text
                  @click="handleOperateCopy(item, conditionIndex)"
                  >复制</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  text
                  @click="handleOperateDelete(conditionIndex, index)"
                  >删除</el-button
                >
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>

      <template #footer>
        <div class="flex justify-center">
          <el-button @click="dialogVisible = false">取消</el-button>
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
import { ElMessage, ElMessageBox } from "element-plus";

interface optionValue {
  value: number | string;
  label: string;
}

defineOptions({
  name: "optionLink"
});

const emit = defineEmits(["confirm"]);

const dialogVisible = ref(false);

interface ConditionData {
  select_option: string;
  is_show: number;
  relations: {
    id: string;
    left_parenthesis: string;
    field_id: number;
    choose_value: (number | string)[];
    choose_value_type: string;
    right_parenthesis: string;
    connection_relation: string;
    module_id: number;
    field_module_id: string;
    option_value: optionValue[];
    type: string;
    table_field: string;
  }[];
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

const isDisabled = inject("isDisabled", false);

const show = async (field, data, fieldOptions) => {
  fieldName.value = field.fieldName;
  fieldIndex.value = field.index;
  fieldList.value = fieldOptions;

  conditionData.value = data || [];
  dialogVisible.value = true;
};

const handleRowAdd = index => {
  if (validate(conditionData.value[index].relations)) {
    conditionData.value[index].relations.push({
      id: buildUUID(),
      field_id: undefined,
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

const handleOperateCopy = (item: any, index) => {
  conditionData.value[index].relations.push({
    ...item,
    id: buildUUID()
  });
};

const handleOperateDelete = (rowIndex, index: number) => {
  conditionData.value[rowIndex].relations.splice(index, 1);
};

const handleConfirm = () => {
  for (const item of conditionData.value) {
    if (!validate(item.relations)) {
      ElMessage.error("请先完善数据");
      return;
    }
  }
  emit("confirm", "field_option_relations", fieldIndex.value, conditionData.value);
  dialogVisible.value = false;
};

const activeNames = ref(["1"]);

const selectChange = async (value, rowIndex, index) => {
  const opt = fieldList.value.find(item => item.value === value);
  if (opt) {
    conditionData.value[rowIndex].relations[index].type = opt.type;
    conditionData.value[rowIndex].relations[index].field_id = opt.field_id;
    conditionData.value[rowIndex].relations[index].table_field = opt.table_field;
    conditionData.value[rowIndex].relations[index].module_id = opt.module_id;
    conditionData.value[rowIndex].relations[index].option_value = await getFieldOption(
      opt.field_id
    );
  }
};

const getFieldOption = async (id): Promise<optionValue[]> => {
  const result = await fieldOptionList({ field_id: id });
  return result.data;
};

const validate = data => {
  const validateField = ["choose_value", "field_module_id", "choose_value_type"];

  const isEmpt = value => (Array.isArray(value) ? value.length : value !== "");

  const validate = data.every(item => {
    return validateField.every(field => {
      return item[field] && isEmpt(item[field]);
    });
  });

  return validate;
};

const cancelLink = async index => {
  const item = conditionData.value[index];

  ElMessageBox.confirm(
    `取消后，选项“${item.select_option}”下配置的关联条件将批量取消，是否确认`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  ).then(() => {
    item.relations = [];
  });
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
  max-height: 300px;
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
  color: red;
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
