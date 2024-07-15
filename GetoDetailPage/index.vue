<!--
 * @Author: 高文进 gwj@geto.com.cn
 * @Date: 2023-11-01 17:14:51
 * @LastEditors: 高文进 gwj@geto.com.cn
 * @LastEditTime: 2023-11-02 17:02:41
 * @FilePath: \hr-service-web\src\geto-components\GetoDetailPage\index.vue
 * @Description:
 *
 * Copyright (c) gwj, All Rights Reserved.
-->
<template>
  <div class="geto-form">
    <el-form
      :model="form"
      :label-width="props.formConfig?.labelWidth ?? '120px'"
      :label-position="props.formConfig?.labelPosition ?? 'right'"
      ref="getoForm"
      :rules="props.rules"
      :label-suffix="props.formConfig?.labelSuffix ?? ''"
    >
      <el-row>
        <template v-for="(item, index) in props.formItemConfig" :key="index">
          <el-col :span="24" v-if="item.type === 'title'">
            <div class="mt-3">
              <h3>{{ item.title }}</h3>
              <el-divider style="margin: 10px 0" />
            </div>
          </el-col>
          <el-col :span="item.span" v-else-if="item.display">
            <GetoDetailPageInfoTable
              v-if="item.type === 'table'"
              :tableConfig="item.table_config"
              :config="item.table_data_params"
              :data="form[item.prop]"
            />
            <el-form-item
              v-else
              :label="item.label"
              :prop="item.prop"
              style="padding-right: 10px"
            >
              <slot
                name="formItem"
                v-if="item.type === 'slot'"
                :item="item"
                :form="form"
              />
              <span v-else>
                {{ form[item.prop] }}
              </span>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import GetoDetailPageInfoTable from "../GetoDetailPageInfoTable/index.vue";

defineOptions({
  name: "GetoDetailPage"
});
const props = defineProps({
  rules: {
    type: Object,
    default: () => {}
  },
  formItemConfig: {
    type: Object,
    default: () => {}
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

const form = ref(cloneDeep(props.formInitial || {}));
const getoForm = ref();

// 用于监听详情页面的数据更新
watch(
  props,
  val => {
    form.value = val.formInitial;
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.geto-form {
  background-color: #fff;
  // padding: 20px;
  border-radius: 4px;
  flex: 1;
}
::v-deep .el-form-item__label {
  font-weight: bold !important;
}
</style>
