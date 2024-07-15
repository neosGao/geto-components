<template>
  <div class="bg-white m-2 p-4">
    <div class="border border-gray-300 p-4">
      <div class="flex align-center justify-between">
        <div>模板信息</div>
        <div>
          <el-button @click="onBackPage('form_list')">取消</el-button>
          <el-button type="primary" @click="handlePreview">预览</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="btnLoading" v-if="!isDisabled"
            >提交</el-button
          >
        </div>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" :label-width="100">
        <div class="flex">
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="form.name" maxlength="30" :disabled="isDisabled" />
          </el-form-item>
          <el-form-item label="版本" prop="version">
            <el-select v-model="form.version" @change="handleVersionChange">
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in versionList"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="form.desc" maxlength="300" :disabled="isDisabled" />
          </el-form-item>
        </div>
        <el-form-item label="表单显示模块">
          <el-checkbox-group
            v-model="form.modules"
            @change="formModulesChange"
            :disabled="isDisabled"
          >
            <el-checkbox v-for="(item, key) in modulesList" :label="item.module_id" :key="key">
              {{ item.module_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>

    <div class="border border-gray-300 p-4 mt-6">
      <div>表单字段配置</div>

      <div class="config-wrap">
        <div class="l pr-2">
          <draggable
            v-model="draggableFormModules"
            item-key="name"
            chosen-class="chosen"
            force-fallback="true"
            animation="300"
          >
            <template #item="{ element }">
              <div class="item-single" @click.stop="draggableItemClick(element)">
                <span
                  :class="{
                    'text-blue-500': activeFormModule === element
                  }"
                  >{{ element }}</span
                >
                <IconifyIconOffline class="item-draggable-icon" :icon="menuFill" />
              </div>
            </template>
          </draggable>
        </div>
        <div class="r px-2" v-if="formModules[activeFormModule]">
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="表头信息" name="tableHeader" />
            <el-tab-pane label="表格信息" name="tableBody" />
          </el-tabs>

          <TableInfo
            v-if="activeName === 'tableHeader'"
            ref="baseTableInfoRef"
            v-model="formModules[activeFormModule].form_fields"
            moduleType="form"
            :moduleId="formModules[activeFormModule].module_id"
            :getSelectedFields="getSelectedFields"
          />

          <TableInfo
            v-if="activeName === 'tableBody'"
            ref="tableInfoRef"
            v-model="formModules[activeFormModule].table_fields"
            v-model:isSum="formModules[activeFormModule].is_sum"
            v-model:sumFields="formModules[activeFormModule].sum_fields"
            moduleType="table"
            :moduleId="formModules[activeFormModule].module_id"
            :getSelectedFields="getSelectedFields"
          />
        </div>
      </div>
    </div>

    <!-- <FormPreview ref="previewRef" /> -->
    <previewVue ref="previewRef" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, computed, provide } from "vue";
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import TableInfo from "./components/tableInfo.vue";
import previewVue from "./components/preview.vue";

import draggable from "vuedraggable/src/vuedraggable";
import menuFill from "@iconify-icons/ri/menu-fill";
import { getCurrentDate, buildUUID } from "@pureadmin/utils";
import {
  moduleList,
  formConfigStore,
  formConfigUpdate,
  formInfo
} from "@/geto-components/GetoApi/field-list";
import {
  formatDefaultValue,
  submitFormatDefaultValue,
  resultModules,
  ArrayObjectFormat,
  FieldType,
  type ModulesInfo
} from "@/geto-components/GetoFormDisplay/config";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";

defineOptions({
  name: "form-template-edit"
});

const route = useRoute();
const router = useRouter();

const pageStatus = ref("add");

const formRef = ref<FormInstance>();
const form = ref({
  name: "",
  version: "",
  desc: "",
  modules: []
});
const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: "请输入模板名称",
      trigger: "blur"
    },
    {
      max: 30,
      message: "模板名称最多30个字符",
      trigger: "blur"
    }
  ],
  version: [
    {
      required: true,
      message: "请选择版本",
      trigger: "blur"
    }
  ],
  desc: [
    {
      max: 300,
      message: "描述最多300个字符",
      trigger: "blur"
    }
  ]
});

const version_no = ref("");

const versionList = ref([]);
const setVersionList = () => {
  const date = getCurrentDate({ type: 3 }).ymd;
  const version = 1 + date.replace(/\//g, "");
  versionList.value.push({
    label: version,
    value: version
  });
  form.value.version = version;
  version_no.value = version;
};

const modulesList = ref<Record<string, any>>({});
const getModuleListConf = async () => {
  const { code, data } = await moduleList();
  if (code === "0") {
    for (const item of data) {
      modulesList.value[item.module_name] = item;
    }
  }
};

const formModules = ref<ModulesInfo>({});

const draggableFormModules = ref([]);

const checkboxFn = (item: any) => {
  return {
    id: buildUUID(),
    field_idOptions: [{ value: item.field_id, label: item.field_name }],
    field_option_relations: [],
    field_show_relations: [],
    default_value: formatDefaultValue(
      item.field_type,
      item.module_default_value || item.field_default_value,
      item.option_interactive_mode
    )
  };
};

const formModulesChange = (checked: string[]) => {
  const checkedName = Object.values(modulesList.value)
    .filter(e => checked.includes(e.module_id))
    .map(e => e.module_name);

  draggableFormModules.value = checkedName;

  formModules.value = checkedName.reduce(
    (acc, key) => {
      if (!acc[key]) {
        acc[key] = {
          module_key: modulesList.value[key].module_key,
          module_name: modulesList.value[key].module_name,
          module_id: modulesList.value[key].module_id,
          form_fields: ArrayObjectFormat(modulesList.value[key].form_fields, checkboxFn),
          table_fields: ArrayObjectFormat(modulesList.value[key].table_fields, checkboxFn),
          is_sum: 0,
          sum_fields: []
        };
      }
      return acc;
    },
    { ...formModules.value }
  );

  Object.keys(formModules.value).forEach(key => {
    if (!checkedName.includes(key)) {
      delete formModules.value[key];
    }
  });
};

const activeFormModule = ref("");

const activeName = ref("tableHeader");

const baseTableInfoRef = ref<InstanceType<typeof TableInfo> | null>(null);
const tableInfoRef = ref<InstanceType<typeof TableInfo> | null>(null);

const validate = async () => {
  const result = await formRef.value?.validate();
  if (result) {
    return true;
  }
  return false;
};

const btnLoading = ref(false);
const handleSubmit = async () => {
  const isValidatge = await validate();
  if (!isValidatge) return;

  btnLoading.value = true;

  const handleFields = data => {
    return data.map((e, i) => {
      const field_option_relations = [];
      if (e.field_option_relations.length) {
        e.field_option_relations.forEach(option => {
          if (option.relations.length) {
            option.relations.forEach(e => {
              field_option_relations.push({
                ...e,
                select_option: option.select_option,
                is_show: option.is_show
              });
            });
          }
        });
      }

      return {
        ...e,
        default_value: submitFormatDefaultValue(
          e.default_value,
          e.field_type,
          e?.option_interactive_mode
        ),
        field_option_relations,
        sort: i + 1
      };
    });
  };

  const getModuleIndex = name => draggableFormModules.value.findIndex(e => e === name);

  const params: any = {
    name: form.value.name,
    description: form.value.desc,
    module_details: Object.values(formModules.value).map((e, i) => {
      return {
        ...e,
        form_fields: handleFields(e.form_fields),
        table_fields: handleFields(e.table_fields),
        is_sum: e.is_sum,
        sum_fields: e.sum_fields.join(","),
        sort: getModuleIndex(e.module_name) + 1
      };
    })
  };

  let request = formConfigStore;
  if (pageStatus.value === "edit") {
    const { id, version_no } = route.query;
    params.id = id;
    params.version_no = version_no;
    request = formConfigUpdate;
  }
  const result = await request(params);
  btnLoading.value = false;
  if (result.code === "0") {
    ElMessage.success(result.message);
    onBackPage("form_list");
  }
};

const onBackPage = (name: string) => {
  router.push({ name });
  useMultiTagsStoreHook().handleTags("splice", route.path);
};

const previewRef = ref<InstanceType<typeof previewVue> | null>(null);
const handlePreview = () => {
  const data = Object.values(formModules.value);
  previewRef.value.show(data);
};

const draggableItemClick = element => {
  if (element === activeFormModule.value) {
    activeFormModule.value = "";
    return;
  }
  activeFormModule.value = element;
};

/**
 * @description 获取不用模块所选字段
 * @param {Array} type 模块字段名称 [form_fields,table_fields]
 * @param {Number} moduleId 模块id
 */
const getSelectedFields = (type: string[], moduleId?: number, moduleIdTargetType?: string) => {
  const options = [];
  for (const key in formModules.value) {
    const item = formModules.value[key];

    type.forEach(typeKey => {
      for (const row of item[typeKey]) {
        const isTargetType = moduleIdTargetType ? moduleIdTargetType === typeKey : true;

        if (row.field_id === "" || (isTargetType && moduleId && moduleId !== item.module_id)) {
          continue;
        }
        if ([FieldType.select, FieldType.radio, FieldType.checkbox].includes(row.field_type)) {
          options.push({
            key,
            field_name: row.field_name,
            field_id: row.field_id,
            table_field: row.table_field,
            module_id: item.module_id,
            type: typeKey
          });
        }
      }
    });
  }
  return options;
};

const getDetails = async params => {
  const { code, data } = await formInfo(params);
  if (code === "0") {
    form.value.name = data.form_info.form_name;
    form.value.desc = data.form_info.description;
    form.value.version = data.form_info.now_version_no;

    // 当前最新版本
    version_no.value = data.form_info.version_no;

    versionList.value = data.version_no_list.map(e => {
      return {
        label: e,
        value: e
      };
    });
    draggableFormModules.value = [];
    if (data.module_info.length) {
      for (const item of data.module_info) {
        form.value.modules.push(item.module_id);
        draggableFormModules.value.push(item.module_name);
      }
      formModules.value = resultModules(data.module_info);
      activeFormModule.value = data.module_info[0].module_name;
    }
  }
};

const handleVersionChange = value => {
  if (!value) return;
  getDetails({ id: route.query.id, version_no: value });
};

const isDisabled = computed(() => {
  return !["add", "edit"].includes(pageStatus.value) || version_no.value !== form.value.version;
});
provide("isDisabled", isDisabled);

onMounted(async () => {
  await getModuleListConf();
  const { id, type, version_no } = route.query;

  if (id) {
    pageStatus.value = type as string;
    getDetails({ id, version_no });
  }

  if (pageStatus.value === "add") {
    setVersionList();
  }
});
</script>
<style lang="scss" scoped>
.config-wrap {
  display: flex;
  height: 500px;
  overflow: hidden;
  box-sizing: border-box;

  .l {
    width: 10%;
    height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;
  }

  .r {
    width: 90%;
    height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;
    border-left: 1px solid #ccc;
  }
}

.item-single {
  width: 100%;
  line-height: 40px;
  text-align: center;
  border: 1px solid #e5e4e9;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
}

.item-draggable-icon {
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  cursor: move;
}

.item-single:hover {
  background-color: #e9ecef;
}

.item-single:active {
  background-color: #ced4da;
}
</style>
