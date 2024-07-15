<template>
  <div>
    <el-dialog
      :title="selectUser.title"
      v-model="selectUser.visible"
      :destroy-on-close="true"
      width="85%"
      top="8vh"
    >
      <div class="common-layout">
        <el-container>
          <el-aside width="25%">
            <el-card>
              <div class="mb-1">
                <el-input
                  placeholder="输入关键字进行过滤"
                  @input="filterInputHandle"
                  v-model="treeList.filterText"
                />
              </div>
              <el-scrollbar height="507px">
                <el-tree
                  :ref="el => (treeList.elRef = el)"
                  :data="treeList.data"
                  :props="treeList.defaultProps"
                  :filter-node-method="filterNode"
                  @node-click="handleNodeClick"
                />
              </el-scrollbar>
              <el-checkbox
                v-model="treeList.include_next_level"
                label="包含下级"
                size="large"
              />
            </el-card>
          </el-aside>
          <el-main style="padding: 0 !important">
            <el-card>
              <GetoFormTableList
                ref="listRef"
                @onSearch="getTableData"
                @resetForm="onResetForm"
                @tableSelectChange="tableSelectChange"
              />
            </el-card>
          </el-main>
          <el-aside width="15%">
            <el-card>
              <div class="mb-3 flex justify-between">
                <span>已选（{{ curSelect.data.length }}）</span>
                <span
                  style="color: #409eff; cursor: pointer"
                  @click="cleanCurSel"
                  >清空</span
                >
              </div>
              <el-scrollbar height="557px">
                <el-tree :data="curSelect.data" :props="curSelect.defaultProps">
                  <template v-slot="{ data }">
                    <div class="flex justify-between" style="width: 100%">
                      <div style="line-height: 32px">{{ data.label }}</div>
                      <el-button
                        type="text"
                        style="color: red"
                        size="mini"
                        @click.stop="() => deleteCurItem(data)"
                      >
                        删除
                      </el-button>
                    </div>
                  </template>
                </el-tree>
              </el-scrollbar>
            </el-card>
          </el-aside>
        </el-container>
      </div>
      <div class="geto-step-footer-button flex justify-center pt-5">
        <el-button type="" @click="selectUser.visible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import GetoFormTableList from "@/geto-components/GetoFormTableList/index.vue";
import { message } from "@/utils/message";
import { cloneDeep } from "@pureadmin/utils";
import {
  defaultForm,
  assignFormFrame
} from "@/geto-components/GetoUtils/assign.ts";

import {
  positionList,
  businessOrgTree
} from "@/geto-components/GetoMspPage/api/messageCenter/messageConfig";

const listRef = ref(null);
const appCodeRef =ref('');

const treeList = ref({
  filterText: "",
  include_next_level: false,
  data: [],
  elRef: null,
  organization_id: "",
  defaultProps: {
    children: "children",
    label: "label"
  }
});

const curSelect = ref({
  data: [],
  isClean: false,
  defaultProps: {
    children: "children",
    label: "label"
  }
});

const tableConf = {
  ...defaultForm(
    assignFormFrame([
      {
        prop: "keyword",
        label: "名称",
        span: 12
      }
    ])
  ),
  cols: [
    { prop: "name", label: "名称", width: "100" },
    { prop: "department_name", label: "部门", width: "100" },
  ],
  options: {
    isIndex: true,
    tableHeight: "415px"
  }
};

const selectUser = ref({
  ...defaultForm(
    assignFormFrame([
      {
        prop: "client_id",
        label: "开发商名称",
        type: "select",
        options: [],
        maxlength: 25,
        span: 24,
        required: true,
        remote: true,
        remoteLoading: false
      }
    ])
  ),
  conf: [],
  resData: {},
  title: "岗位选择",
  visible: false,
  loading: false
});

const filterNode = (value, data) => {
  console.log(value, data);
  if (!value) return true;
  return data.label.includes(value);
};

const filterInputHandle = value => {
  treeList.value.elRef.filter(value);
};

const handleItem = (list, fn) => {
  list.forEach((item, index) => {
    fn(item, list, index);
    if (item.children) {
      handleItem(item.children, fn);
    }
  });
};

const handleNodeClick = data => {
  treeList.value.organization_id = data.id;
  getTableData(null);
};

const show = async (app_code, targetObject = null) => {
  appCodeRef.value = app_code
  treeList.value.organization_id = "";
  curSelect.value.data = [];
  const data = selectUser.value;
  data.visible = true;

  if (targetObject) {
    curSelect.value.data = targetObject.values.map(i => ({id:i.id, name:i.name, label:i.name}))
  }

  const res = await businessOrgTree({app_code:app_code});
  if (res.code == "0") {
    const result = cloneDeep(res.data);
    handleItem(result, function (item) {
      item.label = item.name;
      item.value = item.id;
    });
    treeList.value.data = result;
    nextTick(() => {
      listRef.value.setTableConf(tableConf);
      getTableData(null);
    });
  }
};

const tableSelectChange = (sels, oldSels) => {
  console.log(sels, oldSels);
  // 查询清空选择
  if (
    curSelect.value.isClean == true &&
    sels.length <= oldSels.length &&
    sels.length == 0
  ) {
    console.log(222);
    curSelect.value.isClean = false;
    return;
  }
  // 删除
  if (sels.length < oldSels.length) {
    const deleteArr = oldSels.filter(i => !sels.map(j => j.id).includes(i.id));
    curSelect.value.data = curSelect.value.data.filter(
      i => !deleteArr.map(j => j.id).includes(i.id)
    );
  }
  // 新增
  else {
    // 数组去重
    curSelect.value.data = [...curSelect.value.data, ...sels]
      .filter((item, index, arr) => {
        return arr.map(i => i.id).indexOf(item.id) === index;
      })
      .map(i => {
        return {
          ...i,
          label: i.name,
          value: i.id
        };
      });
  }
};

const deleteCurItem = data => {
  curSelect.value.data = curSelect.value.data.filter(i => i.id !== data.id);
  nextTick(() => {
    const listData = listRef.value;
    for (const item of listData._table.datas) {
      if (data.id == item.id) {
        listData.tableSelectSet(item, false);
      }
    }
  });
};

const cleanCurSel = () => {
  curSelect.value.data = [];
  nextTick(() => {
    const listData = listRef.value;
    for (const item of listData._table.datas) {
      listData.tableSelectSet(item, false);
    }
  });
};

const onResetForm = () => {
  treeList.value.include_next_level = 0
  treeList.value.organization_id = 0
}

const getTableData = async filter => {
  console.log('filter')
  console.log(filter)
  const data = listRef.value;
  data._table.options.loading = true;

  //  用户列表
  const res = await positionList({
    ...filter,
    app_code:appCodeRef.value,
    is_display_lower_level: treeList.value.include_next_level ? 1 : 0,
    pid: treeList.value.organization_id,
  });
  data._table.options.loading = false;

  if (res.code == 0) {
    data._table.datas = res.data.data;
    data._table.options.total = res.data.total;
    curSelect.value.isClean = true;
    nextTick(() => {
      for (const item of data._table.datas) {
        if (curSelect.value.data.map(i => i.id).includes(item.id)) {
          data.tableSelectSet(item);
        }
      }
    });
  }
};

const confirmAdd = () => {
  if (curSelect.value.data.length === 0) {
    return message("请选择岗位", { type: "error" });
  }

  console.log('getSelectPosition', curSelect.value.data);
  console.log(curSelect.value.data);

  selectUser.value.visible = false;
  emits("getSelectPosition", curSelect.value.data);
};

onMounted(() => {});

// 暴露出子组件方法
defineExpose({
  show,
  curSelect
});
const emits = defineEmits(["getSelectPosition"]); // 定义发射给父组件的事件
</script>
