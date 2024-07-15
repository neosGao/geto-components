<template>
  <el-dialog
    v-model="dialogVisible"
    title="菜单收藏"
    class="dialog"
    width="35%"
    append-to-body
  >
    <div class="body">
      <el-input v-model="filter_text" placeholder="搜索" class="mb-1" />
      <el-tree
        ref="treeRef"
        :data="menu_tree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        show-checkbox
        node-key="id"
        :default-checked-keys="collected"
        :filter-node-method="filterNode"
        highlight-current
      />
    </div>
    <template #footer>
      <div class="footer">
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineOptions, ref, defineEmits, onMounted, watch } from "vue";
import { getComponentConfig } from "@/geto-components/GetoMspPage/api/workbench";
import { workbenchCollect } from "@/geto-components/GetoMspPage/api/menu";
import { ElTree } from "element-plus";
import { message } from "@/utils/message";
interface Tree {
  [key: string]: any;
}

defineOptions({
  name: "AddDialog"
});
const emits = defineEmits(["collect"]); // 定义发射给父组件的事件

const dialogVisible = ref(false);
const loading = ref(false);
const defaultProps = {
  children: "children",
  label: "label"
};
const menu_tree = ref([]);
const collected = ref([]);
const filter_text = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();

watch(filter_text, val => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

const show = () => {
  dialogVisible.value = true;
};
const handleNodeClick = (data: any) => {
  console.log(data);
};
const handleConfirm = () => {
  loading.value = true;
  const checkedKeys = treeRef.value!.getCheckedKeys();
  workbenchCollect({
    keys: checkedKeys
  })
    .then((res: any) => {
      message(res.data.msg, {
        type: "success"
      });
      dialogVisible.value = false;
      emits("collect");
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  loading.value = true;
  getComponentConfig({
    component: "Collect"
  })
    .then((res: any) => {
      menu_tree.value = res.data.menu_tree;
      collected.value = res.data.collected;
    })
    .finally(() => {
      loading.value = false;
    });
});

defineExpose({
  show
});
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px;
  height: 5px;
  background-color: #ffffff;
}

::-webkit-scrollbar-thumb {
  background: #c9c9cf;
  border-radius: 6px;
}

.dialog {
  .body {
    padding: 2px;
    height: 350px;
    overflow-y: scroll;
  }
}
</style>
