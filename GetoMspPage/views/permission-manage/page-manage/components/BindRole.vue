<template>
  <div>
    <el-button plain @click="show()">绑定角色</el-button>
    <el-drawer v-model="drawer" size="50%">
      <template #header>
        <h4>{{ props.title }}</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-radio-group v-model="form.status" class="mb-2">
            <el-radio :label="1" size="large">有权</el-radio>
            <el-radio :label="2" size="large">无权</el-radio>
            <el-radio :label="3" size="large">禁止</el-radio>
          </el-radio-group>
          <el-transfer
            v-model="form.role_ids"
            filterable
            :filter-method="filterMethod"
            :titles="['未选中', '已选中']"
            :data="role_list"
            :props="{
              key: 'value',
              label: 'label',
              disabled: 'disabled'
            }"
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

<script lang="ts" setup>
import { ref } from "vue";
import {
  bindRole,
  bindRoleConf
} from "@/geto-components/GetoMspPage/api/page-manage";
import { message } from "@/utils/message";
import { cloneDeep } from "@pureadmin/utils";

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  ids: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(["onSearch"]);

const drawer = ref(false);
const loading = ref(false);
const role_list = ref([]);
const page_ids = ref([]);
const form = ref({
  page_ids: [],
  role_ids: [],
  status: 1
});

// 打开抽屉
const show = async () => {
  if (props.ids.length < 1) {
    message("请选择页面", { type: "warning" });
    return;
  }
  page_ids.value = cloneDeep(props.ids);
  drawer.value = true;
  resetForm();
  const query = {
    page_id: 0
  };
  if (page_ids.value.length == 1) {
    query.page_id = page_ids.value[0];
  }
  const res: any = await bindRoleConf(query);
  role_list.value = res.data.un_bind_role_list;
  form.value.role_ids = res.data.en_bind_role_list;
  form.value.status = res.data.status;
};
// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};
const filterMethod = (query, item) => {
  return item.label.indexOf(query) > -1;
};
// 确认
const confirmClick = async () => {
  loading.value = true;
  form.value.page_ids = page_ids.value;
  const res: any = await bindRole(form.value);
  message(res.data.msg, { type: "success" });
  onSearch(res);
  loading.value = false;
  drawer.value = false;
};
// 重置form
const resetForm = async () => {
  form.value.page_ids = [];
  form.value.role_ids = [];
  form.value.status = 1;
};
// 搜索事件
const onSearch = res => {
  if (res.code != "0") return;
  emit("onSearch");
};

defineExpose({
  show
});
</script>
