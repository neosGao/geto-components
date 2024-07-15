<template>
  <el-drawer
    size="40%"
    v-model="visible"
    :title="form.id > 0 ? '编辑税率' : '新增税率'"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="名称" required>
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="税收制度" required>
        <el-select
          v-model="form.tax_system_name"
          filterable
          remote
          reserve-keyword
          placeholder="请输入搜索关键字"
          :remote-method="remoteSystemSearch"
          :loading="tax_system_loading"
          @change="handleSystemIdChange"
        >
          <el-option
            v-for="item in tax_system_options"
            :key="item.id"
            :label="item.tax_system_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="国家或地区" required>
        <el-input v-model="form.country_name" disabled />
      </el-form-item>
      <el-form-item label="税种">
        <el-select
          v-model="form.tax_types_name"
          filterable
          remote
          reserve-keyword
          placeholder="请输入搜索关键字"
          :remote-method="remoteTypesSearch"
          :loading="tax_types_loading"
          @change="handleTypesChange"
        >
          <el-option
            v-for="item in types_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="税率类型">
        <el-select v-model="form.type" remote>
          <el-option
            v-for="item in type_conf"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="值类型">
        <el-select v-model="form.value_type" remote>
          <el-option
            v-for="item in value_type_conf"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="值">
        <el-input v-model="form.value" />
      </el-form-item>
      <el-form-item label="计税单位">
        <el-select
          v-model="form.tax_unit_id"
          filterable
          remote
          reserve-keyword
          placeholder="请输入搜索关键字"
          :remote-method="remoteTaxUnitSearch"
          :loading="tax_unit_loading"
        >
          <el-option
            v-for="item in tax_unit_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生效日期" required>
        <el-date-picker
          v-model="form.effective_date"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="失效日期" required>
        <el-date-picker
          v-model="form.expiring_date"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="选择日期"
        />
      </el-form-item>
      <span class="footer">
        <el-button @click="visible = false" size="large">取消</el-button>
        <el-button
          type="primary"
          v-auth="
            form.id > 0
              ? 'OPERATE_BASIC_TAX_RATE_EDIT'
              : 'OPERATE_BASIC_TAX_RATE_STORE'
          "
          v-loading="submitLoading"
          @click="handleSubmit"
          size="large"
        >
          确定
        </el-button>
      </span>
    </el-form>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  taxRateInfo,
  getTaxSystem,
  getTaxTypes,
  getStoreConf,
  taxRateEdit,
  taxRateStore,
  getMeasureUnit
} from "@/geto-components/GetoMspPage/api/base/taxRateList";
import { ElMessage } from "element-plus";
const form = ref({
  name: "",
  country_name: "",
  effective_date: "",
  expiring_date: "",
  id: 0,
  tax_system_id: 0,
  tax_types_id: 0,
  tax_types_name: "",
  tax_system_name: "",
  type: "",
  value_type: "",
  value: "",
  tax_unit_id: ""
});
const visible = ref(false);
const submitLoading = ref(false);
interface ListItem {
  value: number;
  label: string;
}
const types_options = ref<ListItem[]>([]);
const tax_types_loading = ref(false);
const remoteTypesSearch = async (query: string) => {
  if (query) {
    tax_types_loading.value = true;
    const res = await getTaxTypes({ name: query });
    types_options.value = res.data;
    tax_types_loading.value = false;
  } else {
    types_options.value = [];
  }
};
interface taxSystemOptionsItem {
  country_name: string;
  id: number;
  tax_system_name: string;
}
const tax_unit_options = ref<ListItem[]>([]);
const tax_unit_loading = ref(false);
const remoteTaxUnitSearch = async (query: string) => {
  if (query) {
    tax_unit_loading.value = true;
    const res = await getMeasureUnit({ name: query });
    tax_unit_options.value = res.data;
    tax_unit_loading.value = false;
  } else {
    tax_unit_options.value = [];
  }
};
const tax_system_options = ref<taxSystemOptionsItem[]>([]);
const tax_system_loading = ref(false);
const remoteSystemSearch = async (query: string) => {
  if (query) {
    tax_system_loading.value = true;
    const res = await getTaxSystem({ name: query });
    tax_system_options.value = res.data;
    tax_system_loading.value = false;
  } else {
    tax_system_options.value = [];
  }
};
const type_conf = ref<ListItem[]>([]);
const value_type_conf = ref<ListItem[]>([]);
const show = async (id: number) => {
  const conf: any = await getStoreConf();
  type_conf.value = conf.data.type_conf;
  value_type_conf.value = conf.data.value_type;
  if (id > 0) {
    const res: any = await taxRateInfo({ id });
    form.value.name = res.data.name;
    form.value.tax_system_id = res.data.tax_system_id;
    form.value.tax_system_name = res.data.tax_system_name;
    form.value.country_name = res.data.country_name;
    form.value.tax_types_name = res.data.tax_types_name;
    form.value.tax_types_id = res.data.tax_types_id;
    form.value.type = res.data.type;
    form.value.value_type = res.data.value_type;
    form.value.value = res.data.value;
    form.value.tax_unit_id = res.data.tax_unit_id;
    form.value.effective_date = res.data.effective_date;
    form.value.expiring_date = res.data.expiring_date;
    form.value.id = id;
    remoteTaxUnitSearch(res.data.tax_unit_name);
  } else {
    form.value = {
      name: "",
      country_name: "",
      effective_date: "",
      expiring_date: "",
      id: 0,
      tax_system_id: 0,
      tax_types_id: 0,
      tax_types_name: "",
      tax_system_name: "",
      type: "",
      value_type: "",
      tax_unit_id: "",
      value: ""
    };
  }
  visible.value = true;
};
const handleSubmit = async () => {
  const res = ref(null);
  const msg = ref("");
  submitLoading.value = true;
  if (form.value.id > 0) {
    res.value = await taxRateEdit(form.value);
    msg.value = "编辑成功";
  } else {
    res.value = await taxRateStore(form.value);
    msg.value = "新增成功";
  }
  if (res.value.code == "0") {
    ElMessage({
      showClose: true,
      message: msg.value,
      type: "success"
    });
    afterSubmit();
  }
  submitLoading.value = false;
};
const handleTypesChange = (value: any) => {
  for (const i in types_options.value) {
    if (types_options.value[i].value == value) {
      form.value.tax_types_name = types_options.value[i].label;
      form.value.tax_types_id = types_options.value[i].value;
    }
  }
};
const handleSystemIdChange = (value: any) => {
  for (const i in tax_system_options.value) {
    if (tax_system_options.value[i].id == value) {
      form.value.country_name = tax_system_options.value[i].country_name;
      form.value.tax_system_id = tax_system_options.value[i].id;
      form.value.tax_system_name = tax_system_options.value[i].tax_system_name;
    }
  }
};
const emit = defineEmits(["afterSubmit"]);
const afterSubmit = () => {
  visible.value = false;
  emit("afterSubmit");
};
defineExpose({
  // 暴露出子组件方法
  show
});
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  right: 10px;
}
</style>
