<template>
  <el-dialog v-model="dialog_visible" title="发布翻译" width="500">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="模块">
        <el-select v-model="form.modules" multiple style="width: 100%">
          <el-option
            v-for="(item, index) in modules"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialog_visible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmClick"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  storeConf,
  publish
} from "@/geto-components/GetoMspPage/api/placeholder";
import { message } from "@/utils/message";

const dialog_visible = ref(false);
const modules = ref([]);
const form = ref({
  modules: []
});
// 打开抽屉
const show = async () => {
  dialog_visible.value = true;
  const res: any = await storeConf().then((res: any) => {
    modules.value = res.data.modules;
  });
  if (res.code != "0") {
    return;
  }
};
// 确认
const loading = ref(false);
const confirmClick = async () => {
  loading.value = true;
  const res: any = await publish(form.value).finally(() => {
    loading.value = false;
  });
  if (res.code != "0") {
    return;
  }
  message("发布成功", { type: "success" });
  dialog_visible.value = false;
};

defineExpose({
  show
});
</script>
