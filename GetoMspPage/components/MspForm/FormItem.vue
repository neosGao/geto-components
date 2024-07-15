<template>
  <el-form-item v-bind="$attrs">
    <template v-if="formItem.type === 'text'">
      {{ formValue }}
    </template>
    <template v-else-if="formItem.type === 'date'">
      <el-date-picker
        v-model="formValue"
        type="date"
        :placeholder="formItem.placeholder"
        :disabled="disabled"
        v-bind="formItem.attrs"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
        @change="handleSelectChange"
      />
    </template>
    <template v-else-if="formItem.type === 'daterange'">
      <el-date-picker
        v-model="formValue"
        type="daterange"
        range-separator="到"
        start-placeholder="开始"
        end-placeholder="结束"
        :placeholder="formItem.placeholder"
        :disabled="disabled"
        v-bind="formItem.attrs"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
        @change="handleSelectChange"
    /></template>
    <template v-else-if="formItem.type === 'textarea'">
      <el-input
        v-bind="formItem.attrs"
        v-model="formValue"
        :rows="2"
        type="textarea"
        :placeholder="formItem.placeholder"
        :disabled="disabled"
      />
    </template>
    <template v-else>
      <component
        v-bind="formItem.attrs"
        v-model="formValue"
        :is="getComponent(formItem.type)"
        :placeholder="formItem.placeholder"
        :disabled="disabled"
        :remote-method="handleRemoteMethod"
        @change="handleSelectChange"
      >
        <template v-if="formItem.type === 'select'">
          <template v-for="opt in options" :key="opt.value">
            <el-option
              :label="opt.label"
              :value="opt.value"
              v-show="opt.show ?? true"
            >
              {{ opt.label }}
            </el-option>
          </template>
        </template>
        <template v-if="formItem.type === 'radio'">
          <template v-for="opt in options" :key="opt.value">
            <el-radio :label="opt.value" v-show="opt.show ?? true">
              {{ opt.label }}
            </el-radio>
          </template>
        </template>
        <template v-if="formItem.type === 'checkbox'">
          <template v-for="opt in options" :key="opt.value">
            <el-checkbox
              :label="opt.label"
              :value="opt.value"
              v-show="opt.show ?? true"
            >
              {{ opt.label }}
            </el-checkbox>
          </template>
        </template>
      </component>
      <template v-if="formItem.type === 'custom'">
        <slot name="customForm" :formItem="formItem" />
      </template>
    </template>
  </el-form-item>
</template>

<script lang="ts" setup>
import { PropType, inject } from "vue";
import { useVModel } from "@vueuse/core";
import { type FormItemType, FormItemInjectKey, Options } from "./types";

defineOptions({
  name: "FormItem"
});

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object] as PropType<any>,
    required: true
  },
  formItem: {
    type: Object as PropType<FormItemType>,
    required: true
  },
  options: {
    type: Array as PropType<Options[]>
  },
  index: Number,
  disabled: Boolean
});

const emit = defineEmits(["update:modelValue"]);

const formValue = useVModel(props, "modelValue", emit);

const remoteMethod: Function = inject(FormItemInjectKey.remoteMethod, () => {});
function handleRemoteMethod(query) {
  if (!query) return;
  remoteMethod(query, props.formItem.key, props.index);
}

const change: Function = inject(FormItemInjectKey.change, () => {});
function handleSelectChange(val) {
  change(val, props.formItem.key, props.index);
}

function getComponent(type) {
  switch (type) {
    case "input":
      return "el-input";
    case "inputNumber":
      return "el-input-number";
    case "select":
      return "el-select";
    case "radio":
      return "el-radio-group";
    case "checkbox":
      return "el-checkbox-group";
    case "date":
      return "el-date-picker";
    case "daterange":
      return "el-date-picker";
    case "textarea":
      return "el-input";
    case "text":
      return "span";
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.el-form-item__content) {
  justify-content: center;
}
</style>
