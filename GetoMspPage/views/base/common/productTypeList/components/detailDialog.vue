<template>
  <div>
    <el-drawer
      v-if="detailForm.visible"
      width="40%"
      v-model="detailForm.visible"
      :with-header="false"
      v-loading="detailForm.loading"
    >
      <div class="flex justify-between pb-5">
        <h4>{{ detailForm.title }}</h4>
        <IconifyIconOffline
          class="cursor-pointer"
          :icon="Close"
          @click="detailForm.visible = false"
        />
      </div>
      <GetoForm
        ref="getoForm"
        v-loading="detailForm.loading"
        :formItemConfig="detailForm.formFrame"
        :formInitial="detailForm.formData"
        :rules="detailForm.formRules"
        @remoteMethod="remoteMethod"
      />
      <div class="geto-step-footer-button">
        <el-button type="primary" @click="submitIndicator">保存</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import GetoForm from "@/geto-components/GetoForm/index.vue";
import {
  editProductType,
  productTypeInfo
} from "@/api/productTypeList.ts";
import {
  defaultForm,
  assignFormFrame,
} from "@/geto-components/GetoUtils/assign.ts";
import { message } from "@/utils/message";
import Close from "@iconify-icons/ep/close";

const getoForm = ref(null);

const detailForm = ref({
  ...defaultForm(
    assignFormFrame(
      [
        {
          prop: "name",
          label: "名称",
          required: true,
          maxlength: 100
        },
        {
          prop: "remark",
          label: "备注",
          textType:'textarea',
          rows: 4,
          maxlength: 200
        }
      ],
    )
  ),
  conf: [],
  resData: {},
  title: "编辑",
  visible: false,
  loading: false
});

const show = async (type = "add", editData = {}) => {
  const data = detailForm.value;
  data.visible = true;
  data.resData = editData;
  data.loading = true;
  console.log(editData.id+"###");
  const res = await productTypeInfo({ id: editData.id });
  data.loading = false;
  if (res.code == 0) {
    getoForm.value.setForm({
      name: res.data.name,
      remark: res.data.remark,
    });
  }
};

const submitIndicator = async () => {
  const data = detailForm.value;
  const form = await getoForm.value.submitForm();
  if (form) {
    console.log(form);
    const param ={
      ...form.value,
      id: data.resData.id
    };
    data.loading = true;
    const res = await editProductType(param);
    data.loading = false;
    if (res.code == 0) {
      message(res.message, { type: "success" });
      data.visible = false;
      emits("refreshData");
    }
  }
};

onMounted(() => {});

// 暴露出子组件方法
defineExpose({
  show
});
const emits = defineEmits(["refreshData"]); // 定义发射给父组件的事件
</script>
