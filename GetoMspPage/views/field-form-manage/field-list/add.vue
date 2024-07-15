<template>
  <div>
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      :close-on-click-modal="false"
      :z-index="zIndex"
      :size="width"
      direction="rtl"
      lock-scroll
    >
      <template #default>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="字段名称" prop="field_name">
            <el-input
              v-model="form.field_name"
              placeholder="请输入字段名称"
              clearable
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="字段类型" prop="field_type">
            <el-select
              v-model="form.field_type"
              placeholder="请选择字段类型"
              class="w-full"
              clearable
              @change="fieldTypeChange"
            >
              <el-option
                v-for="item in fieldTypeList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <template v-if="selectedFieldType === FieldType.input">
            <el-form-item label="限制范围" prop="char_max_length">
              <div class="flex w-full">
                <span class="w-20 text-gray-400">最大长度</span>
                <el-input-number
                  :min="0"
                  :max="255"
                  :precision="0"
                  v-model="form.char_max_length"
                />
              </div>
            </el-form-item>
            <el-form-item label="默认值" prop="default_value">
              <el-input v-model="form.default_value" />
            </el-form-item>
          </template>

          <template v-if="selectedFieldType === FieldType.select">
            <el-form-item label="交互方式" prop="option_interactive_mode">
              <el-select
                v-model="form.option_interactive_mode"
                clearable
                class="w-full"
                @change="interactionMode"
              >
                <el-option
                  v-for="item in optionInteractiveModeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="选项" prop="option_value">
              <el-input
                v-model="form.option_value"
                @input="optionValueChange"
              />
              <span class="text-gray-400">多个选择间用英文逗号","隔开</span>
            </el-form-item>
            <el-form-item label="支持模糊搜索" prop="can_fuzzy_search">
              <el-radio-group v-model="form.can_fuzzy_search">
                <el-radio
                  :label="item.value"
                  v-for="item in canFuzzySearchList"
                  :key="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="默认值" prop="default_value">
              <el-select
                v-model="form.default_value"
                clearable
                class="w-full"
                :multiple="form.option_interactive_mode === 2"
              >
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </template>

          <template v-if="selectedFieldType === FieldType.inputNumber">
            <el-form-item label="数值类型" prop="number_type">
              <el-radio-group v-model="form.number_type">
                <el-radio
                  :label="item.value"
                  v-for="item in numberTypeList"
                  :key="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="最大小数位" prop="max_decimal_place">
              <el-input-number
                :min="0"
                :max="9"
                :precision="0"
                v-model="form.max_decimal_place"
              />
            </el-form-item>
            <el-form-item label="默认值" prop="default_value">
              <el-input v-model="form.default_value" />
            </el-form-item>
          </template>
          <template
            v-if="
              [FieldType.date, FieldType.daterange].includes(selectedFieldType as number)
            "
          >
            <el-form-item label="可选起始日期" prop="can_choose_start_day">
              <div>
                <div class="flex">
                  <el-select v-model="isLimit" class="w-full">
                    <el-option
                      v-for="item in canChooseStartDayModeList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                  <div v-if="isLimitDay" class="mx-4 flex">
                    <el-input-number
                      :min="0"
                      :precision="0"
                      v-model="form.can_choose_start_day"
                    />
                    <span class="ml-2">天</span>
                  </div>
                </div>
                <div class="text-gray-400">
                  天数设置为正数表示“所选日期后n天”，0表示“所选日期当日”
                </div>
              </div>
            </el-form-item>
            <el-form-item label="默认值" prop="default_value">
              <el-select v-model="form.default_value" clearable class="w-full">
                <el-option value="0" label="填写当日" />
              </el-select>
            </el-form-item>
          </template>
          <template v-if="selectedFieldType === FieldType.textarea">
            <el-form-item label="限制范围" prop="char_max_length">
              <div class="flex w-full">
                <span class="w-20 text-gray-400">最大长度</span>
                <el-input-number
                  :min="0"
                  :max="255"
                  :precision="0"
                  v-model="form.char_max_length"
                />
              </div>
            </el-form-item>
            <el-form-item label="默认值" prop="default_value">
              <el-input v-model="form.default_value" />
            </el-form-item>
          </template>

          <template
            v-if="
              [FieldType.radio, FieldType.checkbox].includes(selectedFieldType as number)
            "
          >
            <el-form-item label="选项" prop="option_value">
              <el-input v-model="form.option_value" />
              <span class="text-gray-400">多个选择间用英文逗号","隔开</span>
            </el-form-item>
            <el-form-item label="默认值" prop="default_value">
              <el-select
                v-model="form.default_value"
                clearable
                class="w-full"
                :multiple="selectedFieldType === FieldType.checkbox"
              >
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </template>

          <el-form-item label="输入提示" prop="placeholder">
            <el-input v-model="form.placeholder" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <slot name="footer">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </slot>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, ref, onMounted, PropType } from "vue";
import {
  conf,
  fieldAdd,
  fieldEdit
} from "@/geto-components/GetoApi/field-list";
import { ElMessage, FormInstance } from "element-plus";
import {
  submitFormatDefaultValue,
  FieldType
} from "@/geto-components/GetoFormDisplay/config";

type NumberOrString = number | string;

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String as PropType<"add" | "edit">,
    default: "add"
  },
  width: {
    type: [String, Number],
    default: "40%"
  },
  zIndex: Number
});

const emit = defineEmits(["update:visible", "confirm", "cancel"]);

const drawerVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    if (!val) {
      resetForm();
    }
    emit("update:visible", val);
  }
});

const drawerTitle = computed(() => {
  return props.type === "add" ? "新增字段" : "编辑字段";
});

interface Form {
  field_name: string;
  field_type: number;
  default_value: any;
  placeholder: string;
  can_choose_start_day: number;
  can_fuzzy_search: NumberOrString;
  char_max_length: number;
  max_decimal_place: number;
  number_type: NumberOrString;
  option_interactive_mode: NumberOrString;
  option_value: string;
  id?: number;
  [key: string]: any;
}

const isLimit = ref<NumberOrString>("");
const isLimitDay = computed(
  () =>
    canChooseStartDayModeList.value.find(e => e.value === isLimit.value)
      ?.label === "无限制"
);

const formRef = ref<FormInstance | null>(null);

const form = ref<Form>({
  field_name: "",
  field_type: "",
  default_value: "",
  placeholder: "",
  char_max_length: 255,
  option_interactive_mode: "",
  option_value: "",
  can_fuzzy_search: "",
  number_type: "",
  max_decimal_place: 0,
  can_choose_start_day: 0
});

const rules = ref({
  field_name: [
    {
      required: true,
      message: "请输入字段名称",
      trigger: "blur"
    }
  ],
  field_type: [
    {
      required: true,
      message: "请选择字段类型",
      trigger: "change"
    }
  ],
  option_interactive_mode: [
    {
      required: true,
      message: "请选择交互方式",
      trigger: "change"
    }
  ],
  option_value: [
    {
      required: true,
      message: "请输入选项",
      trigger: "blur"
    }
  ],
  can_fuzzy_search: [
    {
      required: true,
      message: "请选择是否支持模糊搜索",
      trigger: "change"
    }
  ],
  number_type: [
    {
      required: true,
      message: "请选择数值类型",
      trigger: "change"
    }
  ],
  max_decimal_place: [
    {
      required: true,
      message: "请输入最大小数位",
      trigger: "blur"
    }
  ],
  can_choose_start_day: [
    {
      required: true,
      message: "请选择可选起始日期",
      trigger: "change"
    }
  ]
});

const cancelClick = () => {
  drawerVisible.value = false;
  emit("cancel");
};

const confirmClick = async () => {
  const isValidate = await validate().catch(() => false);
  if (!isValidate) return;

  const param = {
    ...form.value,
    default_value: submitFormatDefaultValue(
      form.value.default_value,
      form.value.field_type,
      form.value.option_interactive_mode
    )
  };

  if (param.default_value === "") {
    // ckr后端要求未填传null
    param.default_value = null;
  }
  let requestFun = fieldAdd;
  if (props.type === "edit") {
    requestFun = fieldEdit;
  }
  const { message, code } = await requestFun(param);
  if (code === "0") {
    ElMessage.success(message);
    drawerVisible.value = false;
    emit("confirm");
  }
};

const validate = () => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate(valid => {
      if (valid) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
};

const resetForm = () => {
  form.value = {
    field_name: "",
    field_type: "",
    default_value: "",
    placeholder: "",
    char_max_length: 255,
    option_interactive_mode: "",
    option_value: "",
    can_fuzzy_search: "",
    number_type: "",
    max_decimal_place: 0,
    can_choose_start_day: 0
  };
};

/**
 * @description 设置表单数据
 * @param data 表单数据
 * @param extraObj 额外数据
 */
const setForm = (data, extraObj) => {
  for (const key in form.value) {
    if (key in data) {
      form.value[key] = data[key] ?? "";
    }
  }
  if (extraObj) {
    form.value = { ...form.value, ...extraObj };
  }
};

interface FieldTypeList {
  value: number;
  name: string;
  label: string;
}
const fieldTypeList = ref<FieldTypeList[]>([]);
const optionInteractiveModeList = ref<FieldTypeList[]>([]);
const numberTypeList = ref<FieldTypeList[]>([]);
const canFuzzySearchList = ref<FieldTypeList[]>([]);
const canChooseStartDayModeList = ref<FieldTypeList[]>([]);

const getConf = async () => {
  const { code, data } = await conf();
  if (code === "0") {
    fieldTypeList.value = data.field_type_list;
    optionInteractiveModeList.value = data.option_interactive_mode_list;
    numberTypeList.value = data.number_type_list;
    canFuzzySearchList.value = data.can_fuzzy_search_list;
    canChooseStartDayModeList.value = data.can_choose_start_day_mode_list;
  } else {
    ElMessage.error("获取字段类型失败");
  }
};

const fieldTypeChange = () => {
  form.value.default_value = "";
};

const selectedFieldType = computed(() => {
  if (fieldTypeList.value.length === 0) return "";

  const opt = fieldTypeList.value.find(
    item => item.value === form.value.field_type
  );
  return opt ? opt.value : undefined;
});

const selectOptions = ref([]);

watch(
  () => form.value.option_value,
  data => {
    // 选项清空时，清空默认值
    if (data === "") {
      form.value.default_value = "";
    } else {
      selectOptions.value = data.split(",").map(e => {
        return {
          value: e,
          label: e
        };
      });
    }
  }
);

const MULTIPLE = 2;

const interactionMode = value => {
  if (value === MULTIPLE) {
    form.value.default_value = [];
  }
};

const optionValueChange = () => {
  if (
    (form.value.option_interactive_mode === MULTIPLE &&
      form.value.field_type === FieldType.select) ||
    form.value.field_type === FieldType.checkbox
  ) {
    form.value.default_value = [];
  } else {
    form.value.default_value = "";
  }
};

onMounted(() => {
  getConf();
});

defineExpose({
  setForm
});
</script>

<style scoped lang="scss">
::v-deep(.el-drawer__title) {
  color: #333;
}

::v-deep(.el-drawer__body) {
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
</style>
