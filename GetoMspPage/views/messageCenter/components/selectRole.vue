<template>
  <div>
    <el-dialog title="选择角色" v-model="dialogVisible" width="40%">
      <el-form
        v-model="formData"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="角色" required>
          <el-select
            v-model="formData.id"
            placeholder="请选择"
            class="w-full"
            clearable
            filterable
            multiple
            remote
            remote-method="search"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary"  @click="onConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {
  roleList as roleListApi
} from "@/geto-components/GetoMspPage/api/messageCenter/messageConfig";
const dialogVisible = ref(false)
const roleList = ref([]);
const formData = ref({
  id:[]
});
const emits = defineEmits(["getRole"]); // 定义发射给父组件的事件

const onConfirm = () => {
  const roles = roleList.value.filter(item => formData.value.id.includes(item.id)).map(i=> ({
    id:i.id,name:i.name
  }))

  console.log('getRole roles:', roles)

  emits("getRole", roles);
  dialogVisible.value = false;
}

const show = async (app_code, targetObject = {}) => {

  console.log('select role show: ', app_code, targetObject)

  dialogVisible.value = true;
  const values = targetObject.values || []
  formData.value.id = values.map(i=>i.id)
  const res = await roleListApi({
    app_code:app_code,
    page_size:1000,
    page:1
  })
  if (res.code == 0) {
    roleList.value = res.data
  }
}

onMounted(() => {

});

// 暴露出子组件方法
defineExpose({
  show
});
</script>
