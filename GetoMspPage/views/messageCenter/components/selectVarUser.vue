<template>
  <div>
    <el-dialog title="选择变量接收人" v-model="dialogVisible" width="40%">
      <el-form
        v-model="formData"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="接收人" required>
          <el-select
            v-model="formData.id"
            placeholder="请选择"
            class="w-full"
            clearable
            filterable
            multiple
          >
            <el-option
              v-for="item in props.var_users_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
import {message} from "@/utils/message";
const dialogVisible = ref(false)
const formData = ref({
  id:[]
});
const emits = defineEmits(["getVarUser"]); // 定义发射给父组件的事件
const onConfirm = () => {
  if (formData.value.id.length === 0) {
    message('请选择接收人', {type:"warning"});
    return
  }
  dialogVisible.value = false;
  const list = props.var_users_list.filter(item => formData.value.id.includes(item.value))

  emits("getVarUser", list);
}

const show = async (app_code, targetObject = null) => {
  console.log('select var-user show: ', app_code, targetObject)

  if (targetObject) {
    formData.value.id = targetObject.values.map(item=>item.value)
  }

  dialogVisible.value = true;
}

onMounted(() => {

});

const props = defineProps({
  var_users_list: {
    type: Array,
    default: () => []
  }
});

// 暴露出子组件方法
defineExpose({
  show
});
</script>
