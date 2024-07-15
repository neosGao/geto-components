<template>
  <el-drawer
    size="40%"
    v-model="visible"
    :title="form.id > 0 ? '编辑税收制度' : '新增税收制度'"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="名称" required>
        <el-input v-model="form.name" clearable />
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
      <el-form-item label="国家或地区">
        <el-select
          v-model="form.country_name"
          filterable
          remote
          reserve-keyword
          placeholder="请输入搜索关键字"
          :remote-method="remoteSearch"
          :loading="loading"
          @change="handleChange"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <span class="footer">
        <el-button @click="visible.value = false" size="large">取消</el-button>
        <el-button
          type="primary"
          v-auth="
            form.id > 0
              ? 'OPERATE_BASIC_TAX_SYSTEM_EDIT'
              : 'OPERATE_BASIC_TAX_SYSTEM_STORE'
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
  taxSystemInfo,
  getCountry,
  taxSystemEdit,
  taxSystemStore
} from "@/geto-components/GetoMspPage/api/base/taxSystemList.ts";
import { ElMessage } from "element-plus";
const form = ref({
  name: "",
  country_id: "",
  effective_date: "",
  expiring_date: "",
  id: 0,
  country_name: ""
});
const visible = ref(false);
const loading = ref(false);
interface ListItem {
  value: number;
  label: string;
}
const options = ref<ListItem[]>([]);
const remoteSearch = async (query: string) => {
  if (query) {
    loading.value = true;
    const res = await getCountry({ name: query });
    options.value = res.data;
    loading.value = false;
  } else {
    options.value = [];
  }
};
const show = async (id: number) => {
  if (id > 0) {
    const res = await taxSystemInfo({ id });
    form.value.name = res.data.name;
    form.value.country_id = res.data.country_id;
    form.value.country_name = res.data.country_name;
    form.value.effective_date = res.data.effective_date;
    form.value.expiring_date = res.data.expiring_date;
    form.value.id = id;
  } else {
    form.value = {
      name: "",
      country_id: "",
      effective_date: "",
      expiring_date: "",
      id: 0,
      country_name: ""
    };
  }
  visible.value = true;
};
const handleSubmit = async () => {
  const res = ref(null);
  const msg = ref("");
  if (form.value.id > 0) {
    res.value = await taxSystemEdit(form.value);
    msg.value = "编辑成功";
  } else {
    res.value = await taxSystemStore(form.value);
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
};
const handleChange = (value: any) => {
  for (const i in options.value) {
    if (options.value[i].value == value) {
      form.value.country_name = options.value[i].label;
      form.value.country_id = options.value[i].value;
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
