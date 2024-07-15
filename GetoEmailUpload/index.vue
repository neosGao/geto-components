<template>
  <el-dialog v-model="dialogVisible" title="邮件上传" width="70%" draggable>
    <el-form :model="form">
      <div class="flex pb-4">
        <el-form-item label="邮件标题" label-width="90px">
          <el-input clearable v-model="form.subject" />
        </el-form-item>
        <el-form-item label="发送者邮箱" label-width="90px">
          <el-input clearable v-model="form.from_email" />
        </el-form-item>
        <el-form-item label="附件名称" label-width="90px">
          <el-input clearable v-model="form.name" />
        </el-form-item>
        <el-form-item label="附件状态" label-width="90px">
          <el-select clearable v-model="form.status">
            <el-option :value="0" label="排队中" />
            <el-option :value="1" label="下载中" />
            <el-option :value="2" label="成功" />
            <el-option :value="-1" label="已过期" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getData" class="ml-2">搜索</el-button>
      </div>
    </el-form>

    <el-alert
      title="邮件上传使用方法：企业邮箱转发附件到 fs@geto.com.cn ，然后登录志特系统，点击“邮件上传”按钮，选择对应文件即可。（注：邮件的发件人必须和登录志特系统账号一致。）"
      type="info"
      :closable="false"
    />

    <el-table
      class="py-2"
      :data="tableData"
      v-loading="loading"
      height="220"
      fit
      highlight-current-row
      header-cell-class-name="table-header"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="序号" width="55">
        <template v-slot="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="contact_way_name"
        label="邮件标题"
      />
      <el-table-column align="center" prop="demand" label="发送者邮箱" />
      <el-table-column align="center" prop="result" label="邮件名称" />
      <el-table-column align="center" prop="follow_time" label="附件大小" />

      <el-table-column
        align="center"
        prop="follow_user_name"
        label="附件状态"
      />
      <el-table-column align="center" prop="create_time" label="附加类型" />
      <el-table-column align="center" prop="create_time" label="邮件发送时间" />
      <el-table-column align="center" prop="create_time" label="开始下载时间" />
      <el-table-column align="center" prop="create_time" label="下载还需时间" />
      <el-table-column align="center" prop="create_time" label="进度" />
    </el-table>
    <div class="mt-3 float-right">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        small
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          v-loading="submitLoading"
          @click="handleSubmit"
        >
          上传
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  searchFunction: {
    type: Function,
    default: () => {}
  },
  searchParams: {
    type: Object,
    default: () => {}
  }
});

const dialogVisible = ref(false);
const submitLoading = ref(false);
const form: any = ref({});

const tableData = ref([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const selected = ref([]);
const ids = ref([]);

const show = () => {
  form.value = {};
  dialogVisible.value = true;
};
const handleCurrentChange = val => {
  currentPage.value = val;
  getData();
};
const getData = async () => {
  loading.value = true;
  const params = {
    ...form.value,
    ...props.searchParams,
    page: 1,
    page_size: 10
  };
  const res = await props.searchFunction(params);
  loading.value = false;
  if (res.code === "0") {
    console.log("Res", res);
  }
};
const handleSelectionChange = selection => {
  selected.value = selection;
  ids.value = selection.map(item => item.id);
};
const handleSubmit = async () => {
  console.log("selected.value", selected.value);
  if (selected.value.length == 0) {
    ElMessage({
      showClose: true,
      message: "请先选择要上传的数据！",
      type: "error"
    });
    return;
  }
  afterSubmit();
};

const emit = defineEmits(["afterSubmit"]);
const afterSubmit = () => {
  dialogVisible.value = false;
  emit("afterSubmit");
};
defineExpose({
  // 暴露出子组件方法
  show
});
</script>

<style scoped lang="scss">
.dialog-footer {
  margin-top: 10px;
  text-align: center;
}
</style>
