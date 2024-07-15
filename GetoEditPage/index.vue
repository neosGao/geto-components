<template>
  <div class="geto-form">
    <el-form
      v-bind="$attrs"
      :model="form"
      :label-width="props.formConfig?.labelWidth ?? '120px'"
      :label-position="props.formConfig?.labelPosition ?? 'right'"
      :rules="props.rules"
      ref="getoForm"
    >
      <el-row>
        <template v-for="(item, index) in props.formItemConfig" :key="index">
          <el-col :span="24" v-if="item.type === 'title'">
            <div>
              <h3>{{ item.title }}</h3>
              <el-divider style="margin: 10px 0" />
            </div>
          </el-col>
          <el-col :span="item.span" v-else>
            <el-form-item
              :label="item.label"
              :prop="item.prop"
              style="padding-right: 10px"
            >
              <!-- 使用插槽 -->
              <slot
                v-if="item.type === 'slot'"
                name="formItem"
                :item="item"
                :form="form"
              />
              <el-input
                v-if="item.type === 'input'"
                :maxlength="item.maxlength"
                :show-word-limit="item.maxlength"
                :type="item.textType"
                v-model="form[item.prop]"
                @change="onFormChange(item)"
              />
              <el-select
                v-if="item.type === 'select'"
                style="width: 100%"
                v-model="form[item.prop]"
                :placeholder="item.label"
                @change="onFormChange(item)"
              >
                <el-option
                  v-for="k in item.options"
                  :key="k.value"
                  :label="k.label"
                  :value="k.value"
                />
              </el-select>
              <el-date-picker
                v-if="item.type === 'date' || item.type === 'daterange'"
                style="width: 100%"
                v-model="form[item.prop]"
                :type="item.type"
                :placeholder="item.label"
                :default-time="item.defaultTime"
                @change="onFormChange(item)"
              />
              <el-checkbox-group
                v-model="form[item.prop]"
                v-if="item.type === 'checkbox'"
              >
                <el-checkbox
                  v-for="(j, k) in item.checkboxOption"
                  :key="k"
                  :label="j.label"
                  :name="j.name"
                />
              </el-checkbox-group>
              <el-radio-group
                v-model="form[item.prop]"
                v-if="item.type === 'radio'"
                @change="onFormChange(item)"
              >
                <el-radio
                  v-for="(j, k) in item.radioOption"
                  :key="k"
                  :label="j.label"
                />
              </el-radio-group>
              <el-switch
                v-if="item.type === 'switch'"
                v-model="form[item.prop]"
                @change="onFormChange(item)"
              />
              <el-input-number
                v-if="item.type === 'inputNumber'"
                controls-position="right"
                v-model="form[item.prop]"
                :min="item.min"
                :max="item.max"
                :controls="item.controls"
                @change="onFormChange(item)"
              />
              <el-upload
                v-if="item.type === 'uploadImg'"
                class="avatar-uploader"
                :action="item.action"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <IconifyIconOffline :icon="plus" />
                </el-icon>
              </el-upload>
              <el-cascader
                v-if="item.type === 'cascader'"
                style="width: 100%"
                v-model="form[item.prop]"
                :options="item.options"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import plus from "@iconify-icons/ep/plus"; //ep:plus

defineOptions({
  name: "GetoEditPage",
  inheritAttrs: false // 防止父组件的属性被默认继承
});

const emits = defineEmits(["onFormChange", "uploadSuccess", "beforeUpload"]); // 定义发射给父组件的事件

const props = defineProps({
  rules: {
    type: Object,
    default: () => {}
  },
  formItemConfig: {
    type: Object,
    default: () => {}
  },
  formInitial: {
    type: Object,
    default: () => {}
  },
  formConfig: {
    type: Object,
    default: () => {}
  }
});

const form = ref(cloneDeep(props.formInitial || {}));

const getoForm = ref();
const submitForm = async () => {
  if (!getoForm.value) return;
  const valid = await getoForm.value.validate();
  // 成功校验后返回form内容
  if (valid) return form;
};
// 表单变动时的方法，可用于联动
const onFormChange = item => {
  emits("onFormChange", item, form.value);
};
const handleAvatarSuccess = (response, uploadFile) => {
  emits("uploadSuccess", response, uploadFile);
};
const beforeAvatarUpload = rawFile => {
  emits("beforeUpload", rawFile);
};
defineExpose({
  // 暴露出子组件方法
  submitForm
});
</script>

<style lang="scss" scoped>
.geto-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  flex: 1;
}
.avatar-uploader {
  border: 1px dashed #8c939d;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: block;
  width: 100px;
  height: 100px;
}
.el-icon.avatar-uploader-icon {
  font-size: 16px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
:deep(.el-form-item__label) {
  font-weight: 700;
  cursor: pointer;
}
</style>
