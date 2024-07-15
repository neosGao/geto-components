<template>
  <div>
    <el-button plain @click="show()">数据权限</el-button>
    <el-drawer v-model="drawer" size="80%">
      <template #header>
        <h4>{{ props.title }}</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-form-item label="选择角色：">
            <el-select
              v-model="form.role_ids"
              filterable
              clearable
              multiple
              placeholder="请选择"
              style="width: 50%"
            >
              <el-option
                v-for="item in role_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-divider />
          <el-table :data="search_table_data" style="width: 100%">
            <el-table-column
              prop="viewName"
              label="左括号"
              align="center"
              width="100"
            >
              <template #default="scope">
                <el-select
                  style="width: 100%"
                  v-model="scope.row.border_left"
                  placeholder=" "
                >
                  <el-option
                    v-for="k in border_left"
                    :key="k.value"
                    :label="k.label"
                    :value="k.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="viewName"
              align="center"
              label="字段"
              width="220"
            >
              <template #default="scope">
                <el-select
                  style="width: 100%"
                  v-model="scope.row.column"
                  placeholder=" "
                  @change="changeConditionColumn(scope)"
                >
                  <el-option
                    v-for="k in conditions"
                    :key="k.value"
                    :label="k.label"
                    :value="k.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="viewName"
              align="center"
              label="比较"
              width="120"
            >
              <template #default="scope">
                <el-select
                  style="width: 100%"
                  v-model="scope.row.operator"
                  placeholder=" "
                >
                  <el-option
                    v-for="k in operator"
                    :key="k.value"
                    :label="k.label"
                    :value="k.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="viewName" align="center" label="值">
              <template #default="scope">
                <GetoInputItem
                  ref="inputItem"
                  :config="scope.row"
                  :initData="scope.row.query"
                  @changeData="changeData"
                  :key="inputItemKeys"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="viewName"
              align="center"
              label="右括号"
              width="100"
            >
              <template #default="scope">
                <el-select
                  style="width: 100%"
                  v-model="scope.row.border_right"
                  placeholder=" "
                >
                  <el-option
                    v-for="k in border_right"
                    :key="k.value"
                    :label="k.label"
                    :value="k.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="viewName"
              align="center"
              label="链接"
              width="100"
            >
              <template #default="scope">
                <el-select
                  style="width: 100%"
                  v-model="scope.row.joint"
                  placeholder=" "
                >
                  <el-option
                    v-for="k in joint"
                    :key="k.value"
                    :label="k.label"
                    :value="k.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template v-slot:default="{ row, $index }">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="copyItem(row)"
                  >复制</el-button
                >
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="deleteItem($index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button class="mt-4" style="width: 100%" @click="onAddItem"
            >新增查询条件</el-button
          >
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
  bindRoleDataPermission,
  bindRoleDataPermissionConf
} from "@/geto-components/GetoMspPage/api/list-manage";
import { message } from "@/utils/message";
import GetoInputItem from "@/geto-components/GetoInputItem/index.vue";
import { cloneDeep } from "@pureadmin/utils";
defineOptions({
  name: "DataPermsssion"
});

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  list_keys: {
    type: String,
    default: () => ""
  }
});
const emit = defineEmits(["onSearch"]);

const drawer = ref(false);
const loading = ref(false);

const inputItem = ref(null);

const role_list = ref([]);

const border_left = ref([]);
const border_right = ref([]);
const joint = ref([]);
const operator = ref([]);
const conditions = ref([]);

const search_item = {
  border_left: "",
  column: "",
  operator: "",
  query: "",
  border_right: "",
  joint: "",
  type: ""
};
const search_table_data = ref([search_item]);

const form = ref({
  list_key: "",
  role_ids: [],
  queries: []
});

// 打开抽屉
const show = async () => {
  if (props.list_keys.length != 1) {
    message("请选择一条数据", { type: "warning" });
    return;
  }
  const res: any = await bindRoleDataPermissionConf({
    list_key: props.list_keys[0]
  });
  if (res.code != "0") return;

  role_list.value = res.data.role_list;
  form.value.role_ids = res.data.has_bind_role_ids;
  const data = res.data.list_conf;
  border_left.value = data.border_left;
  border_right.value = data.border_right;
  joint.value = data.joint;
  operator.value = data.operator;
  conditions.value = data.conditions;

  drawer.value = true;
  resetForm();
};
// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};

// 切换条件列
const inputItemKeys = ref(0);
const changeConditionColumn = (scope, reset = true) => {
  conditions.value.forEach(item => {
    if (item.value === scope.row.column) {
      scope.row.type = item.query_type;
      scope.row.query = scope.row.query ? scope.row.query : item.query;
      operator.value = item.operator;
      scope.row.options = item.options;
      if (!reset) return;
      scope.row.query = "";
      if (inputItem?.value?.length > 0) {
        inputItem.value[scope.$index].resetEditInput();
      } else {
        inputItem?.value?.resetEditInput();
      }
    }
  });
  inputItemKeys.value += 1;
};
// 增加搜索条件
const onAddItem = () => {
  search_table_data.value.push({
    border_left: "",
    column: "",
    operator: "",
    query: "",
    border_right: "",
    joint: "",
    type: ""
  });
};
// 复制搜索条件
const copyItem = row => {
  search_table_data.value.push(cloneDeep(row));
};
// 删除搜索条件
const deleteItem = index => {
  search_table_data.value.splice(index, 1);
};
const changeData = (row, config) => {
  // 保存回传数据
  config.query = row;
};

// 确认
const confirmClick = async () => {
  loading.value = true;
  form.value.list_key = props.list_keys[0];
  form.value.queries = search_table_data.value;
  const res: any = await bindRoleDataPermission(form.value);
  message(res.data.msg, { type: "success" });
  onSearch(res);
  loading.value = false;
  drawer.value = false;
};
// 重置form
const resetForm = async () => {
  form.value.queries = [];
  form.value.role_ids = [];
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
