<!--
 * @Author: 高文进 gwj@geto.com.cn
 * @Date: 2023-11-30 09:56:06
 * @LastEditors: 高文进 gwj@geto.com.cn
 * @LastEditTime: 2023-12-12 15:31:15
 * @FilePath: \scm-web\src\geto-components\GetoDrawerForm\index.vue
 * @Description:
 *
 * Copyright (c) gwj, All Rights Reserved.
-->
<template>
  <div class="dark:text-white">
    <!-- drawerSize参数整合到formConfig中 -->
    <el-drawer
      v-model="drawer"
      @close="onCancel"
      :size="props.formConfig?.drawerSize ?? '30%'"
    >
      <template #header>
        <h4>{{ props.title }}</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <GetoForm
            ref="getoForm"
            :formInitial="props.formInitial"
            :formItemConfig="props.formItemConfig"
            :formConfig="props.formConfig"
            :rules="props.rules"
          />
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick"> 取消 </el-button>
          <el-button type="primary" @click="confirmClick"> 提交 </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import GetoForm from "../GetoForm/index.vue";
defineOptions({
  name: "GetoDrawerForm"
});
const emits = defineEmits(["onCancelClick", "onConfirmClick"]); // 定义发射给父组件的事件
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  view: {
    type: Boolean,
    default: false
  },
  formItemConfig: {
    type: Object,
    default: () => {}
  },
  formConfig: {
    type: Object,
    default: () => {}
  },
  formInitial: {
    type: Object,
    default: () => {}
  },
  rules: {
    type: Object,
    default: () => {}
  },
  loading: {
    type: Boolean,
    default: false
  }
});
const drawer = ref(props.view);
const getoForm = ref(null);
const onCancel = () => {
  emits("onCancelClick");
  getoForm.value.resetForm();
};
const setGetoForm = data => {
  getoForm.value.setForm(data);
};
const cancelClick = () => {
  emits("onCancelClick");
  drawer.value = false;
};
const confirmClick = async () => {
  const params = await getoForm.value.submitForm();
  emits("onConfirmClick", params);
  // 需要业务按情况关闭弹窗
  // drawer.value = false;
};
watch(props, val => {
  drawer.value = val.view;
});
defineExpose({
  // 暴露出子组件方法
  setGetoForm
});
</script>
