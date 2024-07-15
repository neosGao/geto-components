<template>
  <el-form ref="formRef" v-if="model && rules" :model="model" :rules="rules" v-bind="$attrs">
    <el-row>
      <template v-for="item in options" :key="item.key">
        <el-col class="mt-2" :span="6" v-show="item.show">
          <FormItem
            :label="item.label"
            :prop="item.key"
            :form-item="item"
            :options="item.options"
            :disabled="disabled || item.disabled"
            :required="item.required"
            v-model="model[item.key]"
          >
            <template #customForm="{ formItem }">
              <slot name="customForm" :formItem="formItem" :disabled="disabled || item.disabled" />
            </template>
          </FormItem>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, provide } from "vue";
import { useVModel } from "@vueuse/core";
import cloneDeep from "lodash/cloneDeep";
import { FormInstance } from "element-plus";
import { type FormItemType, FormItemInjectKey } from "./types";
import FormItem from "./FormItem.vue";

const props = defineProps({
  options: {
    type: Array as PropType<FormItemType[]>,
    required: true
  },
  modelValue: {
    type: Object as PropType<object>,
    required: true
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  }
});

const emit = defineEmits(["update:modelValue", "remote-method", "change", "blur"]);

const model = useVModel(props, "modelValue", emit);

const rules = ref<any>();
const formRef = ref<FormInstance | null>(null);

const initForm = () => {
  if (props.options && props.options.length) {
    const r: any = {};
    props.options.map((item: FormItemType) => {
      r[item.key] = item.rules;
    });
    rules.value = cloneDeep(r);
  }
};

const handleRemoteMethod = (...args) => {
  emit("remote-method", ...args);
};
provide(FormItemInjectKey.remoteMethod, handleRemoteMethod);

const handleChange = (...args) => {
  emit("change", ...args);
};
provide(FormItemInjectKey.change, handleChange);

const handleBlur = (...args) => {
  emit("blur", ...args);
};
provide(FormItemInjectKey.blur, handleBlur);

watch(
  () => props.options,
  () => {
    initForm();
  },
  { deep: true }
);

const validate = () => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((valid: boolean) => {
      if (valid) {
        resolve(true);
      } else {
        reject(valid);
      }
    });
  });
};

onMounted(() => {
  initForm();
});

defineExpose({
  validate
});
</script>
<style scoped></style>
