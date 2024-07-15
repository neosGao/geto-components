<template>
  <el-dialog
    v-model="dialogVisible"
    title="复制权限配置到其他角色"
    width="30%"
    v-loading="loading"
  >
    <div>
      <el-form :model="form" label-width="120px">
        <el-form-item label="角色" required>
          <el-select
            v-model="form.role_ids"
            placeholder="请选择角色"
            style="width: 90%"
            multiple
          >
            <el-option
              :label="item['label']"
              :value="item['value']"
              v-for="(item, index) in props.role_list"
              :key="index"
          /></el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({
  name: "CopyToRole"
});
import { ref, defineProps } from "vue";
import { copyToRole } from "@/geto-components/GetoMspPage/api/data-permission";
import { message } from "@/utils/message";

const props = defineProps({
  role_list: {
    type: Array,
    default: () => []
  },
  role_id: {
    type: String,
    default: ""
  },
  org_id: {
    type: String,
    default: ""
  }
});

const dialogVisible = ref(false);
const loading = ref(true);
const form = ref({
  role_ids: []
});

const show = () => {
  dialogVisible.value = true;
};

const handleSubmit = () => {
  loading.value = true;
  copyToRole({
    role_id: props.role_id,
    org_id: props.org_id,
    role_ids: form.value.role_ids
  })
    .then((res: any) => {
      message(res.data.msg, { type: "success" });
      dialogVisible.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  show
});
</script>

<style lang="scss" scoped></style>
