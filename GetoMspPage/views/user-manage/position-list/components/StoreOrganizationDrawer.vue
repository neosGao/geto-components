<template>
  <div>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ !is_edit ? "新增" : "编辑" }}</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-form ref="myForm" :model="form" label-width="120px">
            <el-form-item label="编码" required>
              <el-input v-model="form.code" maxlength="50" show-word-limit />
            </el-form-item>
            <el-form-item label="名称" required>
              <el-input v-model="form.name" maxlength="50" show-word-limit />
            </el-form-item>

            <el-form-item label="所属组织" required>
              <el-input
                v-model="form.organization_id"
                disabled
                class="hidden-input"
              />
              <el-input v-model="form.organization_name" readonly>
                <template
                  #append
                  v-if="
                    form.organization_id == null || form.organization_id > 0
                  "
                >
                  <el-button>
                    <IconifyIconOffline
                      :icon="Search"
                      @click="handleSearchOrganization"
                    />
                  </el-button>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="是否管理岗位" required>
              <el-switch v-model="form.is_management" />
            </el-form-item>

            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick"> 取消</el-button>
          <el-button type="primary" @click="confirmClick">
            {{ is_edit ? "编辑" : "提交" }}
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>

  <OrganizationDialog
    ref="organizationDialog"
    @handlerConfirmInfo="handlerParentInfo"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Search from "@iconify-icons/ep/search";
import {
  getInfo,
  store,
  edit
} from "@/geto-components/GetoMspPage/api/userManage/position-list";
// import { getInfo, store, edit } from "@/api/organization/business-manage-api";
import { message } from "@/utils/message";
import { hasAuth } from "@/router/utils";
import OrganizationDialog from "./OrganizationDialog.vue";
import { number } from "vue-types";

const props = defineProps({
  typeListData: {
    type: Object,
    default: () => {}
  },
  businessTypeId: {
    type: number,
    default: () => 0
  }
});

const organizationDialog = ref(null);

const emit = defineEmits(["onSearch", "updateOrgTree"]);
const drawer = ref(false);
const is_edit = ref(false);
const loading = ref(false);
const form = ref({
  id: 0,
  code: "",
  name: "",
  organization_id: null,
  organization_name: "",
  is_management: false,
  remark: ""
});

// 打开抽屉
const show = async (id = 0, defaultData = null) => {
  drawer.value = true;
  resetForm();
  if (id > 0) {
    is_edit.value = true;
    const res: any = await getInfo({
      id: id
    });
    const data = res.data;
    form.value.id = id;
    form.value.code = data.code;
    form.value.name = data.name;
    form.value.organization_id = data.organization_id;
    form.value.organization_name = data.organization_name;
    form.value.is_management = data.is_management ? true : false;
    form.value.remark = data.remark;
  }else{
    form.value.organization_id = defaultData.organization_id;
    form.value.organization_name = defaultData.organization_name;
  }
};

// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};

// 确认
const confirmClick = async () => {
  loading.value = true;
  const params = {
    ...form.value,
    is_management: form.value.is_management ? 1 : 0
  };
  let operateFunc = store;
  if (form.value.id) {
    operateFunc = edit;
  }
  const res: any = await operateFunc(params).finally(() => {
    loading.value = false;
  });
  message(res.data.msg, { type: "success" });
  drawer.value = false;
  onSearch(res);
};

// 重置form
const resetForm = async () => {
  is_edit.value = false;
  form.value.id = 0;
  form.value.code = "";
  form.value.name = "";
  form.value.organization_id = null;
  form.value.organization_name = "";
  form.value.is_management = false;
  form.value.remark = "";
};

const handleSearchOrganization = () => {
  organizationDialog.value.show(props.businessTypeId);
};

const handlerParentInfo = data => {
  form.value.organization_id = data.id;
  form.value.organization_name = data.name;
};

// 搜索事件
const onSearch = res => {
  if (res.code != "0") return;
  emit("onSearch");
  emit("updateOrgTree");
};

defineExpose({
  show
});
</script>

<style lang="scss" scoped>
.hidden-input {
  display: none;
}
</style>
