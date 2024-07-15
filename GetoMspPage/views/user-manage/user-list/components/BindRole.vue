<template>
  <div>
    <el-drawer v-model="drawer" size="80%">
      <template #header>
        <h4>{{ props.title }}</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-row :gutter="10">
            <el-col :span="12">
              <div>
                <el-table
                  ref="table"
                  :data="table_data"
                  border
                  style="width: 100%"
                  height="600"
                  v-loading="table_loading"
                >
                  <el-table-column label="序号" width="55" align="center">
                    <template v-slot="scope">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" align="center" />
                  <el-table-column prop="work_id" label="工号" align="center" />
                </el-table>
              </div>
            </el-col>
            <el-col :span="12">
              <el-radio-group v-model="form.bind_type" class="ml-4">
                <el-radio :label="2" size="large">覆盖</el-radio>
                <el-radio :label="1" size="large">追加</el-radio>
              </el-radio-group>
              <el-transfer
                v-model="role_ids"
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
            </el-col>
          </el-row>
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
} from "@/geto-components/GetoMspPage/api/userManage/user-list";
import { message } from "@/utils/message";

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  user_ids: Array<number>,
  default: () => []
});
const emit = defineEmits(["onSearch"]);

const drawer = ref(false);
const loading = ref(false);
const table_loading = ref(false);

const table_data = ref([]);
interface Option {
  value: number;
  label: string;
  disabled: boolean;
}
const role_list = ref<Option[]>([]);
const role_ids = ref([]);
const form = ref({
  user_ids: [],
  bind_role_ids: [],
  bind_type: 2
});

// 打开抽屉
const show = async () => {
  loading.value = true;
  bindRoleConf({
    user_ids: props.user_ids
  })
    .then((res: any) => {
      table_data.value = res.data.user_list;
      role_list.value = res.data.role_list;
      role_ids.value = res.data.bind_role_ids;
      drawer.value = true;
    })
    .finally(() => {
      loading.value = false;
      resetForm();
    });
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
  form.value.user_ids = props.user_ids;
  form.value.bind_role_ids = role_ids.value;
  loading.value = true;

  const res: any = await bindRole(form.value);
  if (res.code != "0") {
    loading.value = false;
    return;
  }
  message(res.data.msg, { type: "success" });
  onSearch(res);
  loading.value = false;
  drawer.value = false;
};
// 重置form
const resetForm = async () => {
  form.value.user_ids = [];
  form.value.bind_role_ids = [];
  form.value.bind_type = 2;
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
