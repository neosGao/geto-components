<template>
  <MspFrom
    ref="mspFormRef"
    v-model="data"
    :options="formOptions"
    :label-width="labelWdith"
    @change="handleChange"
    @remote-method="remoteMethod"
    @blur="handleBlur"
  >
    <template #customForm="{ formItem, disabled }">
      <slot name="customForm" :formItem="formItem" :disabled="disabled" />
    </template>
  </MspFrom>
</template>
<script lang="ts" setup>
import { ref, inject } from "vue";
import MspFrom from "./components/MspForm/index.vue";
import { useVModel } from "@vueuse/core";
import { FieldType, FieldTypeKey, FormItemOptions, submitFormatDefaultValue } from "./config";
import { getRemoteOptions } from "./display";

defineOptions({
  name: "FormInfo"
});

const props = defineProps({
  modelValue: {
    type: Object as PropType<any>,
    required: true
  },
  options: {
    type: Array as PropType<FormItemOptions[]>,
    required: true
  },
  labelWdith: [Number, String]
});

const emit = defineEmits(["change", "blur", "remote-method", "update:modelValue"]);

const mspFormRef = ref<InstanceType<typeof MspFrom> | null>(null);

const formOptions = ref(props.options);

const data = useVModel(props, "modelValue", emit);

const injectFormChange = inject("FormChange", () => {});
const handleChange = (value, key) => {
  const item = props.options.find(item => item.key === key);
  if (
    [FieldType.select, FieldType.radio, FieldType.checkbox].includes(
      FieldType[item.type as FieldTypeKey]
    )
  ) {
    injectFormChange();
  }

  emit("change", value, key);
};

const handleBlur = (value, key) => {
  emit("blur", value, key);
};

async function remoteMethod(value = "", key) {
  if (value === "") return;
  const curData = formOptions.value.find(item => item.key === key);
  if (curData && curData.remote_data) {
    // is_more_param表示需要多个传参，远程搜索自定义
    if (curData.remote_data.is_more_param) {
      emit("remote-method", value, key, curData);
    } else {
      curData.options = await getRemoteOptions(value, curData.remote_data);
    }
  }
}

// 获取表单默认值
async function getValue() {
  try {
    await mspFormRef.value?.validate();
    const result = [];
    formOptions.value.forEach(item => {
      let mode;
      if (item.type === "select" && item.attrs?.multiple) {
        mode = 2;
      }
      result.push({
        field_id: item.id,
        value: submitFormatDefaultValue(data.value[item.label], FieldType[item.type], mode)
      });
    });
    return result;
  } catch (error) {
    throw new Error("表单校验失败");
  }
}

function setValue(value, key?: string) {
  if (key) {
    data.value[key] = value;
  } else {
    data.value = value;
  }
}

function setOptions(key, options, value?: any) {
  const formItemOptions = formOptions.value.find(e => e.key === key);
  formItemOptions.options = options;
  if (value !== undefined) {
    data.value[key] = value;
  }
}

// 获取默认表单值
function getDefaultValue() {
  const result = {};
  formOptions.value.forEach(item => {
    // result[item.id] = data.value[item.key];
    result[item.key] = data.value[item.key];
  });
  return result;
}

defineExpose({
  getValue,
  setValue,
  setOptions,
  getDefaultValue
});
</script>
<style scoped></style>
