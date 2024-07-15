<template>
  <div class="search">
    <div class="tag-bar pt-2">
      <el-button type="primary" @click="show" link class="float-left mt-1"
        >过滤查询</el-button
      >
      <div class="tag-list">
        <el-tag
          v-for="(tag, index) in tags"
          :key="index"
          closable
          type="success"
          class="ml-2"
          @close="handleClose(tag)"
        >
          {{ tag.label }}
        </el-tag>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="查询条件">
      <GetoForm
        ref="getoForm"
        :formItemConfig="props.formItemConfig"
        :formInitial="formInitial"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleReSet"> 重置 </el-button>
          <el-button @click="handleSearch" type="primary"> 搜索 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineOptions, defineProps } from "vue";
import GetoForm from "@/geto-components/GetoForm/index.vue";

defineOptions({
  name: "GetoTableTagSearch"
});
const props = defineProps({
  rules: {
    type: Object,
    default: () => {}
  },
  formItemConfig: {
    type: Array,
    default: () => []
  },
  formInitial: {
    type: Object,
    default: () => {}
  },
  formConfig: {
    type: Object,
    default: () => {}
  }
});
const emits = defineEmits(["onSearch"]); // 定义发射给父组件的事件
const dialogVisible = ref(false);
const form: any = ref({});
const tags = ref([]);
const handleClose = (tag: any) => {
  tags.value.splice(tags.value.indexOf(tag), 1);
  // 删除对象键值
  delete form.value[tag.value];
  emits("onSearch", form.value);
};
// 重置
const handleReSet = () => {
  for (const key in form.value) {
    delete form.value[key];
  }
  tags.value = [];
  getoForm.value.resetForm();
  for (const key in props.formInitial) {
    getoForm.value.setForm(props.formInitial[key], key);
  }

  emits("onSearch", form.value);
};
// 搜索
const getoForm = ref();
const handleSearch = () => {
  form.value = getoForm.value.getForm();
  // tag生成
  genTags();
  emits("onSearch", form.value);
  dialogVisible.value = false;
};
const genTags = () => {
  tags.value = [];
  for (const key in form.value) {
    if (form.value[key] || form.value[key] === 0) {
      const form_value = form.value[key];
      const config: any = props.formItemConfig.find(
        (item: any) => item.prop === key
      );

      const value: any = getValue(config.type, form_value, config);
      const tag_str = config.label + "：" + value;
      if (value == "") {
        delete form.value[key];
        continue;
      }

      tags.value.push({
        label: tag_str,
        value: key
      });
    }
  }
};
const getValue = (type, form_value, config) => {
  let value = "";
  switch (type) {
    case "select":
      // 多选
      if (config.multiple) {
        const values = [];
        form_value?.forEach((i: any) => {
          const option: any = config.options.find((o: any) => o.value == i);
          values.push(option.label);
        });
        value = values.join(" / ");
        break;
      }
      // eslint-disable-next-line no-case-declarations
      const option: any = config.options.find(
        (o: any) => o.value == form_value
      );
      value = option.label;
      break;
    case "year":
    case "month":
    case "week":
    case "date":
    case "daterange":
    case "datetimerange":
    case "datetime":
      // 判断是否数组
      if (Array.isArray(form_value)) {
        value = form_value.join(" - ");
        break;
      }
      value = form_value;
      break;
    default:
      value = form_value;
  }

  return value;
};
// --------------------------------------------------------------导出列表部分开始-----------------------------------------------------------------

const show = () => {
  dialogVisible.value = true;
};
// --------------------------------------------------------------导出列表部分结束-----------------------------------------------------------------
defineExpose({
  // 暴露出子组件方法
  show
});
</script>
<style lang="scss">
.tag-bar {
  .tag-list {
    max-width: 500px;
    overflow-x: scroll;
    // 滚动条样式
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
  }
}
.search .el-form-item {
  margin-bottom: 0px;
}
</style>
