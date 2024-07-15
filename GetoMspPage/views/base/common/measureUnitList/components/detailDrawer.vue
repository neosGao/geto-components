<template>
  <el-drawer v-model="drawerVisible" :title="title" size="45%" draggable>
    <el-form :model="form" label-width="100px">
      <el-form-item label="编码" required>
        <el-input
          v-model="form.code"
          clearable
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="名称" required>
        <el-input
          v-model="form.name"
          clearable
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="基准计量单位">
        <el-switch
          v-model="form.is_base_unit"
          :inactive-value="0"
          :active-value="1"
          @change="handleBaseUnitChange"
        />
      </el-form-item>
      <el-form-item label="精度处理" required>
        <el-select v-model="form.dispose" clearable class="w-full">
          <el-option
            v-for="(item, index) in disposeList"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单位精度">
        <el-input-number
          v-model="form.precision"
          :precision="0"
          :step="1"
          :min="0"
          :max="9"
        />
      </el-form-item>
      <el-form-item label="单位分组" required>
        <el-select
          v-model="form.measure_unit_group_id"
          clearable
          class="w-full"
          @change="handleMeasureUnitGroupChange"
        >
          <el-option
            v-for="(item, index) in groupList"
            :key="index"
            :value="item.id"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="换算关系"
        style="font-weight: 700"
        v-if="form.is_base_unit == 0"
      >
        <span style="font-weight: 400"
          >当前单位换算系数 * 当前单位 = 基准单位换算系数 * 基准单位</span
        >
        <el-row :gutter="23">
          <el-col :span="6">
            <el-input
              type="number"
              v-model="form.current_unit_conversion_factor"
              clearable
            />
          </el-col>
          <el-col :span="1">*</el-col>
          <el-col :span="4">
            <el-input v-model="form.name" disabled />
          </el-col>
          <el-col :span="1">=</el-col>
          <el-col :span="6">
            <el-input
              type="number"
              v-model="form.base_unit_conversion_factor"
              clearable
          /></el-col>
          <el-col :span="1">*</el-col>
          <el-col :span="4"
            ><el-input v-model="form.base_unit_name" disabled
          /></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          v-model="form.remark"
          clearable
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button
          v-if="formType == 'add' || formType == 'copy'"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_MEASURE_UNIT_STORE'"
          @click="handleSubmit"
        >
          确定
        </el-button>
        <el-button
          v-if="formType == 'edit'"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_MEASURE_UNIT_EDIT'"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { storeUnit, editUnit } from "@/geto-components/GetoMspPage/api/base/measureUnitList.ts";
import { ElMessage } from "element-plus";
const drawerVisible = ref(false);
const formType = ref("add");
const title = ref("");
const form: any = ref({
  // id: 0,
  code: "",
  name: "",
  is_base_unit: 0,
  precision: "",
  dispose: "",
  measure_unit_group_id: "",
  current_unit_conversion_factor: "",
  base_unit_conversion_factor: "",
  remark: ""
});
const measureUnitGroupId = ref("");
const submitLoading = ref(false);

const groupList = ref([]);
const disposeList = ref([]);
const isBaseUnitConf = ref([]);
const selectedItem: any = ref({});

// 基准计量单位 值变化回调
const handleBaseUnitChange = (value: number) => {
  console.log(value);
  form.value.current_unit_conversion_factor = "";
  form.value.base_unit_conversion_factor = "";
};
// 单位分组 下拉值变化回调
const handleMeasureUnitGroupChange = (value: any) => {
  selectedItem.value = {};
  groupList.value.forEach(item => {
    if (value == item.id) {
      selectedItem.value = item;
    }
  });
  // 根据单位分组赋值对应的基准单位
  form.value.base_unit_name = selectedItem.value.base_unit_name;
};
const handleSubmit = async () => {
  let callFunction = storeUnit;
  let msg = "新增成功";
  if (formType.value == "edit") {
    callFunction = editUnit;
    msg = "编辑成功";
  }
  submitLoading.value = true;
  const res = await callFunction(form.value);
  submitLoading.value = false;
  if (res.code == "0") {
    ElMessage({
      showClose: true,
      message: msg,
      type: "success"
    });
    afterSubmit();
  }
};
const show = (row: any, type: string) => {
  formType.value = type;
  // 兼容编辑和复制新增 数据赋值
  if (type == "edit" || type == "copy") {
    title.value = "计量单位新增";
    if (type == "edit") {
      form.value.id = row?.id;
      title.value = "计量单位编辑";
    }
    form.value.code = row?.code;
    form.value.name = row?.name;
    form.value.is_base_unit = row?.is_base_unit;
    form.value.precision = row?.precision;
    form.value.dispose = row?.dispose;
    form.value.measure_unit_group_id = row?.measure_unit_group_id;
    form.value.current_unit_conversion_factor =
      row?.current_unit_conversion_factor;
    form.value.base_unit_conversion_factor = row?.base_unit_conversion_factor;
    form.value.remark = row?.remark;
  } else {
    title.value = "计量单位新增";
    form.value.code = "";
    form.value.name = "";
    form.value.is_base_unit = 0;
    form.value.precision = "";
    form.value.dispose = "";
    form.value.measure_unit_group_id = measureUnitGroupId.value;
    form.value.current_unit_conversion_factor = "";
    form.value.base_unit_conversion_factor = "";
    form.value.remark = "";
  }
  drawerVisible.value = true;
};
const emit = defineEmits(["afterSubmit"]);
const afterSubmit = () => {
  drawerVisible.value = false;
  emit("afterSubmit");
};
defineExpose({
  // 暴露出子组件方法
  show,
  groupList,
  disposeList,
  isBaseUnitConf,
  measureUnitGroupId
});
</script>

<style scoped></style>
