<template>
  <div>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>成员详情</h4>
      </template>
      <template #default>
        <div>
          <el-input
            v-model="keywork"
            style="width: 300px"
            placeholder="搜索成员姓名、工号、手机号、邮箱"
            @change="searchData"
          >
            <template #append>
              <el-button :icon="Search" />
            </template>
          </el-input>
        </div>
        <div style="margin: 10px 0">
          <el-tooltip class="box-item" effect="dark" placement="left-start">
            <template #content>
              <span v-for="(item, index) in selectionData" :key="item.work_id"
                >{{ item.name }}，&nbsp;&nbsp;
                <br v-if="(index + 1) % 3 === 0" />
              </span>
            </template>
            <el-button>已选择{{ selectionData.length }}条数据</el-button>
          </el-tooltip>
        </div>
        <div v-loading="loading">
          <el-table
            ref="multipleTableRef"
            :data="tableData"
            style="width: 100%"
            row-key="user_id"
            @select="handleSelectChange"
            @select-All="handleSelecAll"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column property="name" label="姓名" width="120" />
            <el-table-column property="work_id" label="工号" width="120" />
            <el-table-column property="mobile" label="手机号" width="120" />
            <el-table-column
              property="job_type_name"
              label="任职类型"
              show-overflow-tooltip
            />
          </el-table>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick"> 关闭</el-button>
          <el-button type="primary" @click="confirmClick"> 取消绑定 </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  getBindUser,
  unbindUser
} from "@/geto-components/GetoMspPage/api/userManage/position-list";
import { message } from "@/utils/message";
import { hasAuth } from "@/router/utils";
import { number } from "vue-types";
import { cloneDeep } from "@pureadmin/utils";
import { Search } from "@element-plus/icons-vue";
import { ElTable } from "element-plus";
import { nextTick } from "process";
const emit = defineEmits(["onSearch", "updateOrgTree"]);
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const tableOriginalData = ref([]);
const tableData = ref([]);
const selectionData = ref([]);
const drawer = ref(false);
const is_edit = ref(false);
const loading = ref(false);
const keywork = ref("");
const position_id = ref();

// 打开抽屉
const show = async (id = 0) => {
  selectionData.value = [];
  drawer.value = true;
  position_id.value = id;
  const res: any = await getBindUser({
    position_id: id
  });
  tableOriginalData.value = cloneDeep(res.data);
  tableData.value = res.data;
};
// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};
// 筛选数据
const searchData = value => {
  if (value) {
    tableData.value = tableData.value.filter(item => {
      if (
        item.name.includes(value) ||
        item.work_id.includes(value) ||
        item.mobile.includes(value) ||
        item.job_type_name.includes(value)
      ) {
        return item;
      }
    });
  } else {
    tableData.value = tableOriginalData.value;
  }
  nextTick(() => {
    tableData.value.forEach(item => {
      if (
        selectionData.value.findIndex(titem => titem.user_id === item.user_id) >
        -1
      ) {
        multipleTableRef.value!.toggleRowSelection(item, undefined);
      }
    });
  });
};
// 单选
const handleSelectChange = selection => {
  selectionData.value = cloneDeep(selection);
};
// 全选
const handleSelecAll = selection => {
  selectionData.value = cloneDeep(selection);
};
// 确认
const confirmClick = async () => {
  // loading.value = true;
  const params = {
    position_id: position_id.value,
    data: selectionData.value
  };
  const res: any = await unbindUser(params);
  message(res.data.msg, { type: "success" });
  onSearch(res);
  drawer.value = false;
};

// 重置form
const resetForm = async () => {
  is_edit.value = false;
};

// 搜索事件
const onSearch = res => {
  if (res.code != "0") return;
  emit("onSearch");
  emit("updateOrgTree");
};

defineExpose({
  show
});
</script>

<style lang="scss" scoped>
.hidden-input {
  display: none;
}
</style>
