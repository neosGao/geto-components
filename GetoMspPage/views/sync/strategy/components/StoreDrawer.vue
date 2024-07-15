<template>
  <div>
    <el-drawer v-model="drawer" size="50%">
      <template #header>
        <h4>{{ !is_edit ? "新增策略任务" : "编辑策略任务" }}</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-form ref="myForm" :model="form" label-width="120px">
            <el-form-item label="策略名称" required>
              <el-input v-model="form.name" maxlength="20" show-word-limit />
            </el-form-item>

            <el-form-item label="定时规则" required>
              <template #label>
                定时规则
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content=""
                  placement="top"
                >
                  <el-icon style="top: 9px; margin-left: 3px">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </template>
              <!-- <el-popover placement="right" :width="400" trigger="click">
                <template #reference> -->
              <el-input v-model="form.cron" />
              <!-- </template>
                <Crontab @hide="false" @fill="crontabFill" />
              </el-popover> -->
            </el-form-item>

            <el-form-item label="源数据库" required>
              <el-select
                class="full_width"
                v-model="form.origin_db"
                @change="handleOriginDb"
              >
                <el-option
                  v-for="item in options.origin_db_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="源数据表" required>
              <el-select
                class="full_width"
                v-model="form.origin_table"
                @change="handleOriginTable"
              >
                <el-option
                  v-for="item in options.origin_table_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="目标库" required>
              <el-select
                class="full_width"
                v-model="form.target_db"
                @change="handleTargetDb"
              >
                <el-option
                  v-for="item in options.target_db_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="目标表" required>
              <el-select
                class="full_width"
                v-model="form.target_table"
                @change="handleTargetTable"
              >
                <el-option
                  v-for="item in options.target_table_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="同步类型" required>
              <el-select class="full_width" v-model="form.type">
                <el-option
                  v-for="item in options.type_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="同步方式" required>
              <el-select class="full_width" v-model="form.method">
                <el-option
                  v-for="item in options.method_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <div class="flex justify-space-between mb-4 flex-wrap gap-4">
              <el-button type="primary" @click="handleAddRaw" link>
                新增行
              </el-button>
              <span style="font-size: 12px; color: red">
                目标字段的【唯一键】字段需在数据库建立唯一索引，否则将严重影响同步性能及目标数据存在重复的风险
              </span>
            </div>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="date" label="序号" width="60">
                <template #default="scope"> {{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="target_field" label="目标字段">
                <template #default="scope">
                  <el-select
                    class="full_width"
                    v-model="scope.row.target_field"
                  >
                    <el-option
                      v-for="item in options.target_field_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="origin_field" label="源字段">
                <template #default="scope">
                  <el-select
                    class="full_width"
                    v-model="scope.row.origin_field"
                  >
                    <el-option
                      v-for="item in options.origin_field_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="is_unique_key" label="是否唯一键">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.is_unique_key"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="" label="操作">
                <template #default="scope">
                  <el-button
                    type="danger"
                    link
                    icon="Delete"
                    @click="handleDelRaw(scope.row)"
                    >删除行</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick"> 取消 </el-button>
          <el-button
            type="primary"
            @click="confirmClick"
            v-auth="'OPERATE_BASE_MATERIAL_BASE_DESIGN_TYPE_STORE'"
            v-if="!is_edit"
          >
            提交
          </el-button>
          <el-button
            type="primary"
            @click="confirmClick"
            v-else
            v-auth="'OPERATE_BASE_MATERIAL_BASE_DESIGN_TYPE_EDIT'"
          >
            编辑
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  store,
  detail,
  getDb,
  getField,
  getTable,
  edit,
  storeConf
} from "@/geto-components/GetoMspPage/api/sync/strategy";
import { message } from "@/utils/message";
// import Crontab from "./Crontab/index.vue";

const emit = defineEmits(["onSearch"]);

const drawer = ref(false);
const is_edit = ref(false);
const loading = ref(false);
const form = ref({
  id: 0,
  name: "",
  cron: "",
  origin_db: "",
  origin_table: "",
  target_db: "",
  target_table: "",
  type: null,
  method: null,
  detail: []
});

const tableData = ref([]);

function handleAddRaw() {
  tableData.value.push({
    origin_field: "",
    target_field: "",
    is_unique_key: 0
  });
}

function handleDelRaw(row) {
  const index = tableData.value.indexOf(row);
  if (index !== -1) {
    tableData.value.splice(index, 1);
  }
}

// 打开抽屉
const show = async (id = 0) => {
  drawer.value = true;
  resetForm();
  getStoreConf();
  if (id > 0) {
    is_edit.value = true;
    const res: any = await detail({ id: id });
    const data = res.data;
    form.value = data;
    tableData.value = data.detail;
    handleOriginDb(data.origin_db);
    handleTargetDb(data.target_db);
    handleOriginTable(data.origin_table);
    handleTargetTable(data.target_table);
  }
};

// const crontabFill = val => {
//   form.value.cron = val;
// };

const handleOriginDb = val => {
  getTableOptions(val, 1);
};

const handleTargetDb = val => {
  getTableOptions(val, 2);
};

const handleOriginTable = val => {
  getFieldOptions(val, 1);
};

const handleTargetTable = val => {
  getFieldOptions(val, 2);
};

const getTableOptions = async (db_name, type = 1) => {
  const res: any = await getTable({ db_name });
  if (type == 1) {
    options.value.origin_table_options = res.data;
  } else {
    options.value.target_table_options = res.data;
  }
};

const getFieldOptions = async (table_name, type = 1) => {
  const params = {
    db_name: "",
    table_name: ""
  };
  params.table_name = table_name;
  if (type == 1) {
    params.db_name = form.value.origin_db;
  } else {
    params.db_name = form.value.target_db;
  }
  const res: any = await getField(params);
  if (type == 2) {
    options.value.target_field_options = res.data;
    if (is_edit.value == false) {
      tableData.value = [];
      res.data.forEach(element => {
        tableData.value.push({
          target_field: element.value,
          origin_field: "",
          is_unique_key: 0
        });
      });
    }
  } else {
    options.value.origin_field_options = res.data;
  }
};
const options = ref({
  origin_db_options: [],
  origin_table_options: [],
  target_db_options: [],
  target_table_options: [],
  origin_field_options: [],
  target_field_options: [],
  type_options: [],
  method_options: []
});
const getStoreConf = async () => {
  const res: any = await getDb();
  options.value.origin_db_options = res.data;
  options.value.target_db_options = res.data;
  const result: any = await storeConf();
  options.value.type_options = result.data.type;
  options.value.method_options = result.data.method;
};

// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};
// 确认
const confirmClick = async () => {
  loading.value = true;
  form.value.detail = tableData.value;
  let operateFunc = store;
  if (form.value.id) {
    operateFunc = edit;
  }
  const res: any = await operateFunc(form.value).finally(() => {
    loading.value = false;
  });
  if (res.code === "0") {
    message(res.message, { type: "success" });
    onSearch(res);
    drawer.value = false;
  }
};
// 重置form
const resetForm = async () => {
  is_edit.value = false;
  form.value.id = 0;
  form.value.name = "";
  form.value.cron = "";
  form.value.origin_db = "";
  form.value.origin_table = "";
  form.value.target_db = "";
  form.value.target_table = "";
  form.value.type = null;
  form.value.method = null;
  form.value.detail = [];
  tableData.value = [];
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

<style>
.full_width {
  width: 100%;
}
</style>
