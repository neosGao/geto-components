<template>
  <div>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>绑定用户</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-form ref="myForm" :model="form" label-width="100px">
            <el-form-item label="岗位名称">
              <el-input
                v-model="form.name"
                maxlength="50"
                show-word-limit
                disabled
              />
            </el-form-item>
            <el-form-item label="选择用户" required>
              <el-select
                v-model="form.user_ids"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="选择用户"
                :remote-method="remoteMethod"
                :loading="remoteloading"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="任职类型" required>
              <el-radio-group v-model="form.job_type">
                <el-radio
                  v-for="item in props.job_type_option"
                  :key="item.value"
                  :label="item.value"
                  size="large"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick"> 取消</el-button>
          <el-button type="primary" @click="confirmClick"> 绑定 </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  getUser,
  bindUser,
  store,
  edit
} from "@/geto-components/GetoMspPage/api/userManage/position-list";
import { message } from "@/utils/message";
import { hasAuth } from "@/router/utils";
import { number } from "vue-types";

const props = defineProps({
  job_type_option: {
    type: Object,
    default: () => {}
  }
});

const emit = defineEmits(["onSearch", "updateOrgTree"]);
const drawer = ref(false);
const loading = ref(false);
const form = ref({
  position_id: 0,
  name: "",
  user_ids: "",
  job_type: ""
});

// 打开抽屉
const show = async row => {
  drawer.value = true;
  resetForm();
  form.value.position_id = row.id;
  form.value.name = row.name;
};
const remoteloading = ref(false);
const options = ref([]);
const remoteMethod = async (query: string) => {
  const param = {
    position_id: form.value.position_id,
    keyword: query
  };
  const res = await getUser(param);
  options.value = res.data.map(item => {
    const obj = { value: "", label: "" };
    obj.value = item.id;
    obj.label = item.name;
    return obj;
  });
};
// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};

// 确认
const confirmClick = async () => {
  loading.value = true;
  // let operateFunc = store;
  // if (form.value.id) {
  //   operateFunc = edit;
  // }
  const res: any = await bindUser(form.value).finally(() => {
    loading.value = false;
  });
  message(res.data.msg, { type: "success" });
  onSearch(res);
  drawer.value = false;
};

// 重置form
const resetForm = async () => {
  form.value.position_id = 0;
  form.value.name = "";
  form.value.user_ids = "";
  form.value.job_type = "";
};

onMounted(() => {
  remoteMethod("");
});
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
