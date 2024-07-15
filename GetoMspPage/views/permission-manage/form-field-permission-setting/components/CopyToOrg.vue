<template>
  <el-dialog
    v-model="dialogVisible"
    title="应用配置到其他组织"
    width="30%"
    v-loading="loading"
  >
    <div>
      <el-form :model="form" label-width="120px">
        <el-form-item label="业务组织" required>
          <el-select
            v-model="form.org"
            placeholder="请选择组织"
            style="width: 90%"
            multiple
          >
            <el-option
              :label="item['label']"
              :value="item['value']"
              v-for="(item, index) in props.org_list"
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
  name: "CopyToOrg"
});
import { ref, defineProps } from "vue";
import { copyToOrg } from "@/geto-components/GetoMspPage/api/form-field-permission";
import { message } from "@/utils/message";

const props = defineProps({
  org_list: {
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
  },
  type: {
    type: Number,
    default: 1
  }
});

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
  org: []
});

const show = () => {
  dialogVisible.value = true;
};

const handleSubmit = () => {
  copyToOrg({
    role_id: props.role_id,
    org_id: props.org_id,
    org_ids: form.value.org,
    type: props.type
  })
    .then((res: any) => {
      message(res.data.msg, {
        type: "success"
      });
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
