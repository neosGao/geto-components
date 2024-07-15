<template>
  <el-dialog
    v-model="dialogVisible"
    title="用户任职情况"
    width="70%"
    :close-on-click-modal="false"
  >
    <div style="height: 500px">
      <el-table
        height="100%"
        border
        :data="pageListData"
      >
        <el-table-column
          prop="user_name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="work_id"
          label="工号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="job_type"
          label="任职类型"
          width="100">
        </el-table-column>
        <el-table-column
          prop="organization_long_name"
          label="任职组织">
        </el-table-column>
        <el-table-column
          prop="position_name"
          label="任职岗位"
        >
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>


<script lang="ts" setup>
import {ref, reactive, defineEmits} from "vue";
import {message} from "@/utils/message";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import {
  getPosition
} from "@/geto-components/GetoMspPage/api/userManage/user-list";
import {getTokenStr} from "@/utils/auth";

const getoTableRef = ref(null);
const dialogVisible = ref(false);
const pageListData = ref([]);


const show = async (ids) => {
  const res: any = await getPosition({ids: ids});
  if (res.code != '0') {
    message("获取组织树失败", {type: "warning"});
    return;
  }
  pageListData.value = res.data

  dialogVisible.value = true;
};

// 暴露出子组件方法
defineExpose({
  show
});
</script>
