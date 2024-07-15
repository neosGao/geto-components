<template>
  <el-table-column v-bind="$attrs">
    <template #default="{ row, $index }">
      <template v-if="columnItem.type === 'action'">
        <slot name="action" :row="row" :index="$index" :key="columnItem.key" />
      </template>
      <template v-else-if="columnItem.type === 'custom'">
        <slot
          name="custom"
          :row="row"
          :index="$index"
          :key="columnItem.key"
          :prop="columnItem.prop"
        />
      </template>

      <FormItem
        v-else
        :prop="columnItem.key"
        :form-item="columnItem"
        :options="row[`${columnItem.key}Options`] ?? columnItem.options"
        :index="$index"
        :disabled="row[`${columnItem.key}Disabled`] ?? disabled"
        :required="columnItem.required"
        v-model="row[columnItem.key]"
        v-show="row[`${columnItem.key}Show`] ?? true"
        class="clear-margin-bottom"
      />
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import { FormItemType } from "@/geto-components/GetoFormDisplay/components/MspForm/types";
import FormItem from "@/geto-components/GetoFormDisplay/components/MspForm/FormItem.vue";

defineOptions({
  name: "ColumnItem",
  inheritAttrs: false
});

defineProps({
  columnItem: {
    type: Object as PropType<FormItemType>,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>
<style lang="scss" scoped>
.clear-margin-bottom {
  margin-bottom: 0 !important;
}
</style>
