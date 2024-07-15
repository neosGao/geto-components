<template>
  <el-dialog
    v-model="dialog_visible"
    title="查看SQL"
    width="80%"
    append-to-body
  >
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            v-model="source_sql_str"
            autosize
            type="textarea"
            readonly
          />
        </el-col>
        <el-col :span="12">
          <el-input v-model="sql_str" autosize type="textarea" readonly />
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const dialog_visible = ref(false);
const source_sql_str = ref("");
const sql_str = ref("");
const show = (source_sql: string, sql: string) => {
  source_sql_str.value = source_sql;
  sql_str.value = sql;
  dialog_visible.value = true;
};

defineExpose({
  show
});
</script>
