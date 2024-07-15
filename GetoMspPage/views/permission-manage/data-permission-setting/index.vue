<template>
  <div class="dark:text-white geto-step-form">
    <GetoBackBar title="数据权限配置" routeName="role_list">
      <template #title>
        <span class="text-sm" style="color: #f56c6c"> 角色： </span>
        <el-select
          v-model="form.role_id"
          filterable
          clearable
          placeholder="请选择角色"
          @change="loadConfig"
        >
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span
          class="text-sm ml-5"
          style="color: #f56c6c"
          v-if="permission_mode == 'ORG'"
        >
          业务组织：
        </span>
        <el-select
          v-model="form.org_id"
          filterable
          clearable
          placeholder="请选业务组织"
          @change="loadConfig"
          v-if="permission_mode == 'ORG'"
        >
          <el-option
            v-for="item in org_list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #extra>
        <el-button
          type="primary"
          @click="handleCopyToOrg"
          v-if="permission_mode == 'ORG'"
          v-auth="'OPERATE_PERMISSION_DATA_PERMISSION_COPY_TO_ORG'"
          >应用当前配置到其他组织</el-button
        >
        <el-button
          type="primary"
          @click="handleCopyToRole"
          v-auth="'OPERATE_PERMISSION_DATA_PERMISSION_COPY_TO_ROLE'"
          >复制权限配置到其他角色</el-button
        >
        <el-button
          type="primary"
          @click="submitForm"
          v-auth="'OPERATE_PERMISSION_DATA_PERMISSION_SUBMIT'"
          >提交</el-button
        >
      </template>
    </GetoBackBar>
    <splitpane :splitSet="settingLR">
      <template #paneL>
        <!-- 自定义左侧面板的内容 -->
        <div class="left-table">
          <el-input
            v-model="list_query"
            placeholder=""
            :prefix-icon="Search"
            @change="handleFilterList"
          />
          <el-checkbox-group
            v-model="filter_type"
            class="mt-1 mb-1 ml-1"
            @change="loadConfig"
          >
            <el-checkbox :label="1">查看有权</el-checkbox>
            <el-checkbox :label="2">查看无权</el-checkbox>
          </el-checkbox-group>
          <el-table
            ref="multipleTable"
            height="670"
            :data="list_table_data"
            border
            @row-click="singleElection"
            highlight-current-row
          >
            <el-table-column label="#" width="50" align="center">
              <template v-slot="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="列表名称" />
            <el-table-column align="center" width="100" label="配置情况">
              <template v-slot="scope">
                <!-- 可以手动的修改label的值，从而控制选择哪一项 -->
                <el-tag
                  :type="scope.row.is_setting ? 'success' : 'warning'"
                  v-if="form.role_id && form.org_id"
                  >{{ scope.row.is_setting ? "已配置" : "未配置" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template #paneR>
        <!-- 自定义右侧面板的内容 -->
        <div class="right-table" v-if="conditions.length > 0">
          <el-button style="width: 100%" @click="onAddItem"
            >新增查询条件</el-button
          >
          <el-table :data="search_table_data" height="670">
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
        </div>
        <div class="right-table" v-else>
          <el-empty :image-size="300" description="请选择需要配置的列表" />
        </div>
      </template>
    </splitpane>
    <div />
    <CopyToOrg
      ref="copyToOrg"
      :org_list="org_list"
      :role_id="form.role_id"
      :org_id="form.org_id"
    />
    <CopyToRole
      ref="copyToRole"
      :role_list="roles"
      :role_id="form.role_id"
      :org_id="form.org_id"
    />
  </div>
</template>

<script setup lang="ts">
import GetoBackBar from "@/geto-components/GetoBackBar/index.vue";
import { ref, onMounted, reactive } from "vue";
import {
  bindDataPermissionConf,
  bindDataPermission
} from "@/geto-components/GetoMspPage/api/data-permission";
import { Search } from "@element-plus/icons-vue";
import GetoInputItem from "@/geto-components/GetoInputItem/index.vue";
import { cloneDeep } from "@pureadmin/utils";
import { message } from "@/utils/message";
import CopyToOrg from "./components/CopyToOrg.vue";
import CopyToRole from "./components/CopyToRole.vue";
import splitpane, { ContextProps } from "@/components/ReSplitPane";

defineOptions({
  name: "data_permission_setting"
});

const permission_mode = ref("ORG");

const settingLR: ContextProps = reactive({
  minPercent: 15,
  defaultPercent: 40,
  split: "vertical"
});

const copyToOrg = ref(null);
const copyToRole = ref(null);

const roles = ref([]);
const org_list = ref([]);
const checkList = ref([]);
const list_key = ref("");
const filter_type = ref([]);

const multipleTable = ref(null);
const templateSelection = ref("");
const list_query = ref("");
const list_table_data = ref([]);

const inputItem = ref(null);

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
  type: "",
  list_key: ""
};
const search_table_data = ref<any>([search_item]);

const form = ref({
  role_id: "",
  org_id: "",
  role_ids: [],
  list_key: "",
  queries: []
});
const loadConfig = () => {
  bindDataPermissionConf({
    role_id: form.value.role_id,
    org_id: form.value.org_id,
    list_key: list_key.value,
    filter_type: filter_type.value
  }).then(res => {
    const data: any = res.data;
    roles.value = data.role_list;
    list_table_data.value = data.list_data;
    // 赋值
    search_table_data.value = data.data_permission;
    search_table_data.value.forEach(j => {
      conditions.value.forEach(item => {
        if (item.value === j.column) {
          j.type = item.query_type;
          if (j.query !== 0) {
            j.query = j.query ? j.query : item.query;
          }
          operator.value = item.operator;
          j["options"] = item.options;
          j.list_key = item.list_key;
        }
      });
    });
  });
};

const handleFilterList = () => {
  bindDataPermissionConf({
    role_id: form.value.role_id,
    org_id: form.value.org_id,
    list_key: list_key.value,
    list_name: list_query.value,
    filter_type: filter_type.value
  }).then(res => {
    const data: any = res.data;
    list_table_data.value = data.list_data;
    // 赋值
    if (form.value.role_id != "") {
      search_table_data.value = data.data_permission;
    }
  });
};

const singleElection = row => {
  templateSelection.value = row.id;
  checkList.value = list_table_data.value.filter(item => item.id === row.id);
  list_key.value = row.key;
  // 获取接口数据
  bindDataPermissionConf({
    role_id: form.value.role_id,
    org_id: form.value.org_id,
    list_key: list_key.value,
    filter_type: filter_type.value
  }).then(res => {
    const data: any = res.data;
    border_left.value = data.list_conf.border_left;
    border_right.value = data.list_conf.border_right;
    joint.value = data.list_conf.joint;
    operator.value = data.list_conf.operator;
    conditions.value = data.list_conf.conditions;

    // 赋值
    search_table_data.value = data.data_permission;
    form.value.list_key = row.key;
    if (search_table_data.value.length === 0) return;
    search_table_data.value.forEach(j => {
      conditions.value.forEach(item => {
        if (item.value === j.column) {
          j.type = item.query_type;
          if (j.query !== 0) {
            j.query = j.query ? j.query : item.query;
          }
          operator.value = item.operator;
          j["options"] = item.options;
          j.list_key = item.list_key;
        }
      });
    });
  });
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
      scope.row.operator = "";
      scope.row.list_key = item.list_key;
    }
  });
};
// 增加搜索条件
const onAddItem = () => {
  if (!form.value.role_id) {
    message("请选择角色", { type: "warning" });
    return;
  }
  if (!form.value.list_key) {
    message("请选择列表", { type: "warning" });
    return;
  }
  search_table_data.value.push({
    border_left: "",
    column: "",
    operator: "",
    query: "",
    border_right: "",
    joint: "",
    type: "",
    list_key: ""
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
const handleCopyToOrg = () => {
  copyToOrg.value.show();
};
const handleCopyToRole = () => {
  copyToRole.value.show();
};

const submitForm = async () => {
  if (!form.value.role_id) {
    message("请选择角色", { type: "warning" });
    return;
  }
  if (!form.value.list_key) {
    message("请选择列表", { type: "warning" });
    return;
  }
  form.value.role_ids = [form.value.role_id];
  form.value.queries = search_table_data.value;
  const res: any = await bindDataPermission(form.value);
  message(res.data.msg, { type: "success" });
};
// 挂载
onMounted(() => {
  bindDataPermissionConf().then(res => {
    const data: any = res.data;
    permission_mode.value = data.permission_mode;
    roles.value = data.role_list;
    org_list.value = data.org_list;
    list_table_data.value = data.list_data;
  });
});
</script>

<style lang="scss" scoped>
.left-table {
  width: 100%;
  height: calc(100% - 10px);
  color: rgba(30, 144, 255, 0.8);
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
}

.right-table {
  width: 100%;
  height: calc(100% - 10px);
  color: rgba(30, 144, 255, 0.8);
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  margin-left: 5px;
}
</style>
