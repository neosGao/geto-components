<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      width="70%"
      :title="
        type == 'warehouse'
          ? '仓库物料列表'
          : type === 'project'
          ? '项目物料列表'
          : '设计物料列表'
      "
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="wrap">
        <splitpane :splitSet="settingLR">
          <template #paneL>
            <el-select
              v-model="category"
              class="w-full"
              @change="handleCategoryChange"
              filterable
              placeholder="物料分类标准"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <div class="filter-tree-div">
              <GetoTree
                :data="treeData"
                :expand-on-click-node="false"
                :config="tree_config"
                :default-expanded-keys="[0]"
                @handleNodeClick="handleNodeClick"
              />
            </div>
          </template>
          <template #paneR>
            <el-form :model="search" :inline="true" label-width="60px">
              <el-row :gutter="24">
                <el-col :span="20">
                  <el-form-item label="名称">
                    <el-input v-model="search.simple_code" clearable />
                  </el-form-item>
                  <el-form-item label="代码">
                    <el-input v-model="search.code_new" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <BaseTable
              ref="baseTbaleRef"
              :data="tableData"
              :columns="tableColumns"
              :page="pageConf.currentPage"
              :page-size="pageConf.pageSize"
              :total="pageConf.total"
              selection
              pagination
              @page-change="handleBaseTablePageChange"
            />
          </template>
        </splitpane>
      </div>
      <template #footer>
        <div class="dialog-footer" style="margin-top: 40px">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm()">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import BaseTable from "@/geto-components/GetoBaseTable/index.vue";
import {
  getCategoryStandardOptions,
  getCategoryTree,
  list as materialList
} from "./api";
import { cloneDeep } from "@pureadmin/utils";
import splitpane, { ContextProps } from "@/components/ReSplitPane";
import GetoTree from "@/geto-components/GetoTree/index.vue";

const props = defineProps({
  type: {
    type: String,
    default: "warehouse"
  }
});
const tree_config = ref({
  expandAll: false,
  expandOnClickNode: false,
  nodeKey: "value"
});
defineOptions({
  name: "MaterialSelection"
});
const search = reactive({
  simple_code: "",
  code_new: ""
});
const settingLR: ContextProps = reactive({
  minPercent: 10,
  defaultPercent: 30,
  split: "vertical"
});
const emits = defineEmits(["confirm", "cancel"]);

const dialogVisible = ref(false);
const show = () => {
  dialogVisible.value = true;
  let business_type = 0;
  if (props.type == "design") {
    business_type = 1;
  } else if (props.type == "warehouse") {
    business_type = 3;
  } else {
    business_type = 4;
  }
  getTreeData({
    category_standard_id: 1,
    material_business_type: business_type
  });
  getCategory();
  getMaterialList();
};
const close = () => {
  dialogVisible.value = false;
};
const onSearch = () => {
  getMaterialList(search);
};
const full_path = ref("");
const handleNodeClick = data => {
  full_path.value = data.full_path;
  getMaterialList();
};

const treeData = ref([]);
const getTreeData = async (params = {}) => {
  const reuslt: any = await getCategoryTree(params);
  if (reuslt.code === "0") {
    treeData.value = reuslt.data;
  }
};
const category = ref(1);

const categoryOptions = ref([]);

const getCategory = async (params = {}) => {
  const reuslt: any = await getCategoryStandardOptions(params);
  categoryOptions.value = reuslt.data;
};
const handleCategoryChange = e => {
  getTreeData({ category_standard_id: e });
  onSearch();
};

const baseTbaleRef = ref<InstanceType<typeof BaseTable>>();
const pageConf = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});
const tableColumns = [
  {
    prop: "code_new",
    label: "物料代码"
  },
  {
    prop: "name",
    label: "物料名称"
  },
  {
    prop: "spec",
    label: "物料规格"
  },
  {
    prop: "simple_code",
    label: "物料助记码"
  },
  {
    prop: "unit_name",
    label: "基本单位"
  }
];
const tableData = ref([]);

const getMaterialList = async (params = {}) => {
  const { currentPage, pageSize } = pageConf;
  params = {
    ...params,
    category_standard_id: category.value,
    full_path: full_path.value,
    currentPage,
    pageSize,
    type: props.type
  };
  const result: any = await materialList(params);
  pageConf.total = result.data.total;
  tableData.value = result.data.data;
};

const handleConfirm = () => {
  const selectedIndex = baseTbaleRef.value?.getSelectionValue();
  const row = cloneDeep(tableData.value[selectedIndex]);
  emits("confirm", row, selectedIndex);
  close();
};

const handleCancel = () => {
  emits("cancel");
  close();
};

const handleBaseTablePageChange = page => {
  pageConf.currentPage = page.currentPage;
  pageConf.pageSize = page.pageSize;
  baseTbaleRef.value?.clearSelectionValue();
  getMaterialList();
};

onMounted(async () => {});

defineExpose({
  show,
  close
});
</script>
<style lang="scss" scoped>
.wrap {
  height: 50vh;
}
.filter-tree-div {
  height: 46vh;
  /* border: 1px solid #dcdfe6; */
  min-width: 100%;
  display: inline-block;
  // overflow: auto;
}
::v-deep(.geto-tree) {
  padding: 0;
}

::v-deep(.splitter-pane-resizer.vertical) {
  background: #fff;
}
</style>
