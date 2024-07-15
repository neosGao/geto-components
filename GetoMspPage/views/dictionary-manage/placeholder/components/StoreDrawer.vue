<template>
  <div>
    <el-drawer v-model="drawer" size="50%">
      <template #header>
        <h4>{{ !is_edit ? "新增字段" : "编辑字段" }}</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-form ref="myForm" :model="form" label-width="70px">
            <el-form-item label="模块" required>
              <el-select
                v-model="form.module"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in modules"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="占位符" required>
              <el-input
                v-model="form.placeholder"
                maxlength="255"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                maxlength="255"
                show-word-limit
              />
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="handleStore" class="mb-2"
            >添加行</el-button
          >
          <el-table :data="form.languages" border>
            <el-table-column label="#" width="55" align="center">
              <template v-slot="scoped">
                <span>{{ scoped.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="语言" width="120" align="center">
              <template #default="{ row }">
                <el-select
                  v-model="row.language_type"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in language_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="翻译结果" align="center">
              <template #default="{ row }">
                <el-input
                  v-model="row.placeholder"
                  maxlength="255"
                  show-word-limit
                />
              </template>
            </el-table-column>
            <el-table-column label="禁用" width="100" align="center">
              <template #default="{ row }">
                <el-switch
                  v-model="row.status"
                  :active-value="1"
                  :inactive-value="0"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ row }">
                <el-button type="danger" @click="handleDelete(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick"> 取消 </el-button>
          <el-button type="primary" @click="confirmClick" v-if="!is_edit">
            提交
          </el-button>
          <el-button
            type="primary"
            @click="confirmClick"
            v-if="is_edit && hasAuth('OPERATE_LANGUAGE_FIELD_EDIT')"
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
  edit,
  storeConf,
  info
} from "@/geto-components/GetoMspPage/api/placeholder";
import { message } from "@/utils/message";
import { hasAuth } from "@/router/utils";

const emit = defineEmits(["onSearch"]);

const drawer = ref(false);
const is_edit = ref(false);
const loading = ref(false);
const language_type: any = ref([]);
const modules: any = ref([]);
const form: any = ref({
  id: 0,
  placeholder: "",
  remark: "",
  languages: []
});

// 打开抽屉
const show = async (id = 0) => {
  drawer.value = true;
  resetForm();
  storeConf().then((res: any) => {
    modules.value = res.data.modules;
    language_type.value = res.data.language_type;
  });

  if (id > 0) {
    is_edit.value = true;
    const res: any = await info({ id: id });
    const data = res.data;
    form.value.id = id;
    form.value.placeholder = data.placeholder;
    form.value.remark = data.remark;
    form.value.languages = [];
    for (const index in data.languages) {
      const item = data.languages[index];
      form.value.languages.push({
        id: item.id,
        language_type: item.language_type,
        placeholder: item.placeholder,
        status: item.status
      });
    }
  }
};
// 添加行数据
const handleStore = async () => {
  form.value.languages.push({
    language_type: "",
    placeholder: "",
    status: 1
  });
};
// 删除行数据
const handleDelete = async row => {
  const index = form.value.languages.indexOf(row);
  form.value.languages.splice(index, 1);
};
// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};
// 确认
const confirmClick = async () => {
  loading.value = true;
  let operateFunc = store;
  if (form.value.id) {
    operateFunc = edit;
  }
  const res: any = await operateFunc(form.value).finally(() => {
    loading.value = false;
  });
  if (res.code != "0") {
    return;
  }
  message(res.data.msg, { type: "success" });
  onSearch(res);
  drawer.value = false;
};
// 重置form
const resetForm = async () => {
  is_edit.value = false;
  form.value.id = 0;
  form.value.placeholder = "";
  form.value.remark = "";
  form.value.languages = [];
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
@/geto-components/GetoMspPage/api/placeholder
