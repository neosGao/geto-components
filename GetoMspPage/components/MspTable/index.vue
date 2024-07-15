<template>
  <slot name="tableOperations" />
  <el-table
    v-bind="$attrs"
    class="msp-table"
    border
    :data="data"
    row-key="id"
    @selection-change="handleSelectionChange"
  >
    <template v-slot="scope">
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
      <template v-for="(item, index) in columns" :key="index">
        <ColumnItem
          v-if="item.show ?? true"
          :column-item="item"
          :label="item.label"
          :prop="item.key"
          :width="(config as Config)?.width || item.width"
          :align="(config as Config)?.align || item.align"
          :disabled="disabled"
          :fixed="item.fixed"
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
    </template>
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
import Sortable from "sortablejs";

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
  "change"
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

const data = useVModel(props, "modelValue", emit);

// const tableKeys = ref(0);
function sortTableCallback() {
  // tableKeys.value += 1;
  nextTick(() => {
    const wrapper: HTMLElement = document.querySelector(
      `.msp-table .el-table__body-wrapper tbody`
    );
    Sortable.create(wrapper, {
      animation: 300,
      handle: ".sort-icon",
      onEnd: ({ newIndex, oldIndex }) => {
        const currRow = data.value.splice(oldIndex, 1)[0];
        data.value.splice(newIndex, 0, currRow);
      }
    });
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
