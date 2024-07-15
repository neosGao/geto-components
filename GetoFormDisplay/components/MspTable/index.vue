<template>
  <slot name="tableOperations" />
  <el-table
    v-bind="$attrs"
    class="msp-table"
    border
    :data="data"
    @selection-change="handleSelectionChange"
    :key="tableKeys"
  >
    <el-table-column
      type="selection"
      width="55"
      align="center"
      fixed="left"
      v-if="selection && !disabled"
    />
    <el-table-column
      type="index"
      label="序号"
      width="55"
      align="center"
      v-if="showIndex"
    />

    <template v-for="item in columns" :key="item.key">
      <ColumnItem
        v-if="item.show ?? true"
        :column-item="item"
        :label="item.label"
        :prop="item.key"
        :width="(config as Config)?.width || item.width"
        :align="(config as Config)?.align || item.align"
        :disabled="disabled || item.disabled"
        :fixed="item.key == 'action' ? 'right' : item.fixed"
      >
        <template #custom="{ row, key, index, prop }">
          <slot
            name="custom"
            :row="row"
            :index="index"
            :key="key"
            :prop="prop"
          />
        </template>
        <template #action="{ row, key, index }">
          <slot name="action" :row="row" :index="index" :key="key" />
        </template>
      </ColumnItem>
    </template>
    <!-- 自定义表格操作列 -->
    <slot name="tableAction" />
  </el-table>
</template>

<script lang="ts" setup>
import { PropType, provide, onMounted, ref, nextTick } from "vue";
import { useVModel } from "@vueuse/core";
import ColumnItem from "./ColumnItem.vue";
import type { Config } from "./types";
import {
  type FormItemType,
  FormItemInjectKey
} from "@/geto-components/GetoMspPage/components/MspForm/types";
import { initSortTable } from "@/utils/sortableTable";

defineOptions({
  name: "MspTable",
  inheritAttrs: false
});

const props = defineProps({
  columns: {
    type: Array as PropType<FormItemType[]>,
    required: true
  },
  modelValue: {
    type: Array as PropType<any[]>,
    required: true
  },
  config: {
    type: Object as PropType<Config>
  },
  selection: Boolean,
  showIndex: Boolean,
  disabled: Boolean
});

const emit = defineEmits([
  "update:modelValue",
  "selection-change",
  "remote-method",
  "change",
  "blur"
]);

const handleSelectionChange = (val: any[]) => {
  emit("selection-change", val);
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

const data = useVModel(props, "modelValue", emit);

const tableKeys = ref(0);

function sortTableCallback() {
  tableKeys.value += 1;
  nextTick(() => {
    initSortTable("msp-table", data.value, "sort-icon", sortTableCallback);
  });
}

// wip
const validate = () => {
  return true;
};

onMounted(() => {
  sortTableCallback();
});

defineExpose({
  validate
});
</script>

<style scoped></style>
