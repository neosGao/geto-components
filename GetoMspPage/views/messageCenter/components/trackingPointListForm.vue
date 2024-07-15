<template>
  <div class="dark:text-white" style="padding-left: 10px">
    <GetoBackBar title="埋点库表单" :routeName="routeName">
      <template #extra>
        <el-button
          type="primary"
          @click="operateHandle('edit')"
          v-if="formConfig.disabled"
          >编辑</el-button
        >
        <el-button
          type="primary"
          v-if="!formConfig.disabled"
          @click="operateHandle('save')"
          >保存</el-button
        >
        <!-- <el-button @click="operateHandle('exit')">退出</el-button> -->
      </template>
    </GetoBackBar>
    <GetoForm
      ref="getoForm"
      style="margin-top: 10px"
      :formItemConfig="trackingPointListFormConfigs"
      :formInitial="trackingPointListFormData"
      :rules="formRules"
      :formConfig="formConfig"
      @onFormChange="onFormChange"
    />
    <!-------------------------------------------------------  设置变量字段 ------------------------------------------------------------------------>
    <div>
      <div class="title">
        设置变量字段
        <el-button
          type="primary"
          v-if="!formConfig.disabled"
          @click="add_variable"
          >新增</el-button
        >
      </div>
      <div>
        <el-table border :data="variableTableData" style="width: 1000px">
          <el-table-column
            type="index"
            align="center"
            width="100"
            label="序号"
          />
          <el-table-column align="center" prop="name" label="变量字段名称">
            <template #default="{ row }">
              <el-input
                v-model="row.name"
                :disabled="formConfig.disabled"
                placeholder="请输入变量字段名称"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="描述">
            <template #default="{ row }">
              <el-input
                v-model="row.remark"
                :disabled="formConfig.disabled"
                placeholder="请输入描述"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="120"
            v-if="!formConfig.disabled"
          >
            <template #default="{ row, $index }">
              <el-button
                link
                type="primary"
                size="small"
                @click="copy('variable', row)"
                >复制</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="del('variable', $index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-------------------------------------------------------  设置条件字段 ------------------------------------------------------------------------>
    <div>
      <div class="title">
        设置条件字段
        <el-button
          type="primary"
          v-if="!formConfig.disabled"
          @click="add_condition"
          >新增</el-button
        >
      </div>
      <el-table border :data="conditionTableData" style="width: 1000px">
        <el-table-column type="index" align="center" width="100" label="序号" />
        <el-table-column align="center" prop="name" label="条件字段名称">
          <template #default="{ row }">
            <el-input
              v-model="row.name"
              :disabled="formConfig.disabled"
              placeholder="请输入条件字段名称"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="type" label="条件字段类型">
          <template #default="{ row }">
            <el-select
              v-model="row.type"
              class="m-2"
              :disabled="formConfig.disabled"
              placeholder="请选择条件字段类型"
            >
              <el-option
                v-for="item in conditionTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="remark"
          label="描述"
          :disabled="formConfig.disabled"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.remark"
              :disabled="formConfig.disabled"
              placeholder="请输入描述"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="120"
          v-if="!formConfig.disabled"
        >
          <template #default="{ row, $index }">
            <el-button
              link
              type="primary"
              size="small"
              @click="copy('condition', row)"
              >复制</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="del('condition', $index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-------------------------------------------------------  设置接收人变量 ------------------------------------------------------------------------>
    <div>
      <div class="title">
        设置接收人变量
        <el-button
          type="primary"
          v-if="!formConfig.disabled"
          @click="add_receiver_variables"
          >新增</el-button
        >
      </div>
      <el-table border :data="receiverVariablesData" style="width: 1000px">
        <el-table-column type="index" align="center" width="100" label="序号" />
        <el-table-column align="center" prop="name" label="变量名称">
          <template #default="{ row }">
            <el-input
              v-model="row.name"
              :disabled="formConfig.disabled"
              placeholder="请输入变量名称"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="remark"
          label="描述"
          :disabled="formConfig.disabled"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.remark"
              :disabled="formConfig.disabled"
              placeholder="请输入描述"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="120"
          v-if="!formConfig.disabled"
        >
          <template #default="{ row, $index }">
            <el-button
              link
              type="primary"
              size="small"
              @click="copy('receiver_variables', row)"
              >复制</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="del('receiver_variables', $index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import GetoForm from "@/geto-components/GetoForm/index.vue";
import GetoBackBar from "@/geto-components/GetoBackBar/index.vue";
import { cloneDeep } from "@pureadmin/utils";
import {ref, onMounted, reactive, watch} from "vue";
import {
  menuTree,
  create,
  edit,
  info
} from "@/geto-components/GetoMspPage/api/messageCenter/trackingPointList";
import { formRules, trackingPointListFormConfig } from "./config.js";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { handleAliveRoute } from "@/router/utils";
defineOptions({
  name: "management_message_tracking_point_form"
});

interface res {
  code?: string;
  data?: any;
  message?: string;
}

const formConfig = ref({
  labelPosition: "right",
  disabled: false
});

const router = useRouter();
const useroute = useRoute();
const getoForm = ref();
const menuTreeOption = ref([]);
const conditionTypeOption = reactive([
  { value: 1, label: "文本类型" },
  { value: 2, label: "枚举类型" },
  { value: 3, label: "数字类型" },
  // { value: 4, label: "日期" },
  { value: 5, label: "日期时间" }
]);
const trackingPointListFormData = ref({});
const variableTableData = ref([]);
const conditionTableData = ref([]);
const receiverVariablesData = ref([]);
const trackingPointListFormConfigs = ref(trackingPointListFormConfig);

const onFormChange = async (data, form) => {
  // if (data.prop === "perform_coefficient") {
  // }
};
const add_variable = () => {
  variableTableData.value.push({});
};
const add_condition = () => {
  conditionTableData.value.push({});
};
const add_receiver_variables = () => {
  receiverVariablesData.value.push({});
};
const copy = (type, row) => {
  if (type === "variable") {
    variableTableData.value.push(cloneDeep(row));
  }
  if (type === "condition") {
    conditionTableData.value.push(cloneDeep(row));
  }
  if (type === "receiver_variables") {
    receiverVariablesData.value.push(cloneDeep(row));
  }
};
const del = (type, index) => {
  console.log(type, index);
  if (type === "variable") {
    variableTableData.value.splice(index, 1);
  }
  if (type === "condition") {
    conditionTableData.value.splice(index, 1);
  }
  if (type === "receiver_variables") {
    receiverVariablesData.value.splice(index, 1);
  }
};

const operateHandle = async type => {
  if (type === "edit") {
    pageType.value = "edit";
    formConfig.value.disabled = false;
  }
  if (type === "save") {
    const form = await getoForm.value.submitForm();
    const param = {
      ...form.value,
      variables: variableTableData.value,
      condition_fields: conditionTableData.value,
      receiver_variables: receiverVariablesData.value
    };
    if (pageType.value == "edit") {
      const res: res = await edit(param);
      if (res.code == "0") {
        ElMessage({
          type: "success",
          message: "编辑成功"
        });
        toTableList();
      }
    } else {
      const res: res = await create(param);
      if (res.code == "0") {
        ElMessage({
          type: "success",
          message: "新增成功"
        });
        toTableList();
      }
    }
  }
  // if (type === "exit") {
  // }
};
const useOptions = () => {
  trackingPointListFormConfigs.value.forEach(item => {
    if (item.prop == "menu_id") {
      item.options = menuTreeOption.value;
    }
  });
};

const pageType = ref("");
const id = ref("");
const pageDisabled = ref(false);
onMounted(async () => {
  trackingPointListFormConfigs.value.find(item => item.prop == 'code').disabled = false
  const res1: res = await menuTree();
  if (res1.code == "0") {
    menuTreeOption.value = res1.data;
  }
  useOptions();

  pageType.value = router.currentRoute.value.query.type as string;
  if (['view', 'copy'].includes(pageType.value)) {
    if (pageType.value =="view") {
      pageDisabled.value = true;
      formConfig.value.disabled = true;
    }
    id.value = router.currentRoute.value.query.id as string;

    const res2: res = await info({ id: id.value });
    if (res2.code == "0") {
      if (pageType.value == 'view') {
        trackingPointListFormConfigs.value.find(item => item.prop == 'code').disabled = true;
      }
      let res2Data = res2.data;
      if (pageType.value == "copy") {
        res2Data.id = 0;
        res2Data.code = "";
      }
      getoForm.value.setForm(res2Data);
      trackingPointListFormData.value = res2.data;
      variableTableData.value = res2.data.variables || [];
      conditionTableData.value = res2.data.condition_fields || [];
      receiverVariablesData.value = res2.data.receiver_variables || [];
    }
  }
});

const env = import.meta.env;
const toTableList = () => {
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    useMultiTagsStoreHook().handleTags(
      "splice",
      router.currentRoute.value.path
    );
    handleAliveRoute(useroute as ToRouteType);
    router.push({
      name: "management_message_tracking_point"
    });
    return;
  }
  // ms架构的跳转''
  const routes = router.getRoutes();
  const route = routes.find(
    item => item.name == "management_message_tracking_point"
  );
  const host = env.VITE_PUBLIC_PATH + "#";
  const title = route.meta.title;
  const url = host + route.path;
  const params = [
    {
      name: title,
      path: url,
      url: url
    }
  ];
  window.parent.postMessage({ flag: "tab", data: params }, "*"); //解决跨域
  window.parent.postMessage({ flag: "loading", data: { loading: false } }, "*");
};

</script>
<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-weight: 600;
}
.condition-box {
  overflow: auto;
  width: 100%;
  height: 150px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.line {
  cursor: pointer;
  padding-left: 14px;
}
.line:hover {
  background-color: #99ccff;
}
.active {
  background-color: #99ccff;
}
</style>
