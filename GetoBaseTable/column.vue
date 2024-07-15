<template>
  <el-table-column
    :prop="column.prop"
    :label="column.label"
    :width="column.width"
    align="center"
  >
    <template #default="scope" v-if="column.type === 'custom'">
      <slot
        name="custom"
        :row="scope.row"
        :key="column.prop"
        :index="scope.$index"
      />
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import { Column } from "./type";

defineProps({
  column: {
    type: Object as PropType<Column>,
    required: true
  }
});
</script>
