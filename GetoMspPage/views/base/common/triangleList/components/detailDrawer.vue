<template>
  <el-drawer v-model="drawerVisible" :title="title" width="50%">
    <el-form :model="form" label-width="110px">
      <el-form-item label="编号" required v-if="isEdit">
        <el-input
          v-model="form.code"
          clearable
          placeholder="请输入"
          maxlength="20"
          disabled
        />
      </el-form-item>
      <el-form-item label="销售组" required>
        <el-select
          v-model="form.sale_group_id"
          clearable
          :disabled="isEdit"
          class="w-full"
        >
          <el-option
            v-for="(item, index) in saleGroupOption"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="深化组" required>
        <el-select
          v-model="form.deep_group_id_arr"
          clearable
          multiple
          class="w-full"
          @change="handleDeepGroupChange"
        >
          <el-option
            v-for="(item, index) in deepGroupOption"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="默认深化组">
        <el-select
          v-model="form.default_deep_group_id"
          clearable
          class="w-full"
        >
          <el-option
            v-for="(item, index) in deepGroupValueOption"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="区域工程经理" required>
        <el-select
          v-model="form.engineer_user_arr"
          clearable
          multiple
          filterable
          remote
          :remote-method="engineerUserRemote"
          class="w-full"
        >
          <el-option
            v-for="(item, index) in engineerUserOption"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工程部经理" required>
        <el-select
          v-model="form.engineer_org_user"
          clearable
          filterable
          remote
          :remote-method="engineerOrgRemote"
          class="w-full"
        >
          <el-option
            v-for="(item, index) in engineerOrgOption"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设计分部经理" required>
        <el-select
          v-model="form.designer_user"
          clearable
          filterable
          remote
          :remote-method="designerUserRemote"
          class="w-full"
        >
          <el-option
            v-for="(item, index) in designerUserOption"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="drawer-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button
          v-if="!isEdit"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_TRIANGLE_STORE'"
          @click="handleSubmit"
        >
          确定
        </el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_TRIANGLE_EDIT'"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  newStoreConf,
  storeTriangle,
  editTriangle
} from "@/geto-components/GetoMspPage/api/base/triangleList.ts";
import { ElMessage } from "element-plus";
const drawerVisible = ref(false);
const isEdit = ref(false);
const title = ref("");
const form: any = ref({
  // id: 0,
  sale_group_id: "",
  default_deep_group_id: "",
  deep_group_id_arr: [],
  engineer_user_arr: [],
  designer_user: "",
  engineer_org_user: ""
});
const submitLoading = ref(false);
const saleGroupOption: any = ref([]);
const deepGroupOption: any = ref([]);
const deepGroupValueOption: any = ref([]);
const userOption = ref([]);
const engineerUserOption = ref([]);
const engineerOrgOption = ref([]);
const designerUserOption = ref([]);

const show = async (row: any, is_edit: boolean) => {
  isEdit.value = is_edit;
  if (is_edit) {
    title.value = "编辑铁三角关系";
    form.value.id = row?.id;
    form.value.code = row?.code;
    form.value.sale_group_id = row?.sale_group_id;
    form.value.deep_group_id_arr = row?.deep_group_arr;
    form.value.default_deep_group_id = row?.default_deep_group_id;
    form.value.engineer_user_arr = row?.engineer_user_arr;
    form.value.designer_user = row?.design_user;
    form.value.engineer_org_user = row?.engineer_org_user;

    // 回显处理
    handleDeepGroupChange(form.value.deep_group_id_arr);
    engineerUserRemoteShow(row?.engineer_user_name_arr);
    engineerOrgRemote(row?.engineer_org_user_name);
    designerUserRemote(row?.design_user_name);
  } else {
    title.value = "新增铁三角关系";
    form.value.id = 0;
    form.value.sale_group_id = "";
    form.value.deep_group_id_arr = [];
    form.value.default_deep_group_id = [];
    form.value.engineer_user_arr = [];
    form.value.designer_user = "";
    form.value.engineer_org_user = "";
  }
  drawerVisible.value = true;
};
const handleDeepGroupChange = value => {
  deepGroupValueOption.value = deepGroupOption.value.filter(item =>
    value.includes(item.value)
  );
};

const engineerUserRemote = async (query: string) => {
  if (query !== "") {
    const res: any = await newStoreConf({
      conf_key: "user_option",
      user_name: query
    });
    if (res.code == "0") {
      engineerUserOption.value = res.data.user_option;
    }
  } else {
    engineerUserOption.value = [];
  }
};

// 回显工程部经理
const engineerUserRemoteShow = (queryArr: string[]) => {
  if (queryArr && queryArr.length > 0) {
    engineerUserOption.value = [];
    queryArr.forEach(async query => {
      const res: any = await newStoreConf({
        conf_key: "user_option",
        user_name: query
      });
      if (res.code == "0") {
        engineerUserOption.value.push(...res.data.user_option);
      }
    });
  }
};

const engineerOrgRemote = async (query: string) => {
  if (query !== "") {
    const res: any = await newStoreConf({
      conf_key: "user_option",
      user_name: query
    });
    if (res.code == "0") {
      engineerOrgOption.value = res.data.user_option;
    }
  } else {
    engineerOrgOption.value = [];
  }
};

const designerUserRemote = async (query: string) => {
  if (query !== "") {
    const res: any = await newStoreConf({
      conf_key: "user_option",
      user_name: query
    });
    if (res.code == "0") {
      designerUserOption.value = res.data.user_option;
    }
  } else {
    designerUserOption.value = [];
  }
};

const handleSubmit = async () => {
  let callFunction = storeTriangle;
  let msg = "新增成功";
  if (isEdit.value) {
    callFunction = editTriangle;
    msg = "编辑成功";
  }
  submitLoading.value = true;
  const res = await callFunction(form.value);
  submitLoading.value = false;
  if (res.code == "0") {
    ElMessage({
      showClose: true,
      message: msg,
      type: "success"
    });
    afterSubmit();
  }
};
const emit = defineEmits(["afterSubmit"]);
const afterSubmit = () => {
  drawerVisible.value = false;
  emit("afterSubmit");
};
defineExpose({
  // 暴露出子组件方法
  show,
  saleGroupOption,
  deepGroupOption,
  userOption,
  engineerUserOption,
  engineerOrgOption,
  designerUserOption
});
</script>

<style scoped></style>
