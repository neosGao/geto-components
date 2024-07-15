<!--
 * @Author: Junxu
 * @Date: 2023-11-07 17:08:07
 * @LastEditors: 高文进 gwj@geto.com.cn
 * @LastEditTime: 2024-06-26 16:10:08
 * @Description:
-->
<template>
  <div class="geto-form">
    <el-form
      v-bind="$attrs"
      :model="form"
      :label-width="props.formConfig?.labelWidth ?? 'auto'"
      :label-position="props.formConfig?.labelPosition ?? 'right'"
      :rules="props.rules || defaultRules"
      ref="getoForm"
    >
      <el-row>
        <template v-for="(item, index) in formItemConfig" :key="index">
          <el-col
            :span="24"
            :style="item.style"
            class="mb-4"
            v-if="item.type === 'title' && !item.hidden"
          >
            <div>
              <slot
                v-if="item.title_slot"
                name="titleSlot"
                :item="item"
                :form="form"
              />
              <h3 v-else>{{ item.title }}</h3>
              <el-divider style="margin: 10px 0" />
            </div>
          </el-col>
          <el-col
            :span="item.span"
            :style="item.style"
            class="mb-4"
            v-show="item.itemVisible ?? true"
            v-else-if="item.type !== 'title' && !item.hidden"
          >
            <el-form-item
              :label="item.label"
              :prop="item.prop"
              style="padding-right: 10px"
              :required="item.required"
              :class="item.class"
            >
              <template #label v-if="item.labelSlot">
                <slot name="labelSlot" :item="item" :form="form" />
              </template>
              <!-- 使用插槽 -->
              <slot
                v-if="item.type === 'slot'"
                name="formItem"
                :item="item"
                :form="form"
                :ref="item.ref"
              />
              <el-input
                v-if="item.type === 'input'"
                v-show="item.visible ?? true"
                :maxlength="item.maxlength"
                :show-word-limit="
                  item.maxlength && item.maxlength > 0 ? true : false
                "
                :type="item.textType"
                :placeholder="item?.placeholder ?? item?.label"
                v-model="form[item.prop]"
                @change="onFormChange(item)"
                @input="onFormInputChange(item)"
                @blur="onFormBlur(item)"
                :rows="item.rows"
                :disabled="props?.formConfig?.disabled || item?.disabled"
                :readonly="item.readonly ?? false"
              >
                <template v-if="item.appendSearch ?? false" #append>
                  <el-button :icon="Search" @click="onSearchInput(item)" />
                </template>
              </el-input>
              <el-input
                v-if="item.type === 'textarea'"
                v-show="item.visible ?? true"
                :maxlength="item.maxlength"
                :show-word-limit="
                  item.maxlength && item.maxlength > 0 ? true : false
                "
                type="textarea"
                :placeholder="item?.placeholder || item?.label"
                v-model="form[item.prop]"
                @change="onFormChange(item)"
                @blur="onFormBlur(item)"
                :rows="item.rows"
                :disabled="props?.formConfig?.disabled || item?.disabled"
                :readonly="item.readonly ?? false"
              >
                <template v-if="item.appendSearch ?? false" #append>
                  <el-button :icon="Search" @click="onSearchInput(item)" />
                </template>
              </el-input>
              <el-select
                v-if="item.type === 'select'"
                v-show="item.visible ?? true"
                style="width: 100%"
                v-model="form[item.prop]"
                :placeholder="item?.placeholder || item?.label"
                @change="onFormChange(item)"
                @visible-change="visible => onVisibleChange(visible, item)"
                :disabled="props?.formConfig?.disabled || item?.disabled"
                :multiple="item.multiple ?? false"
                :remote="item.remote ?? false"
                :loading="item.remoteLoading ?? false"
                :remote-method="query => remoteMethod(query, item)"
                :clearable="item.clearable ?? true"
                :allow-create="item.allowCreate ?? false"
                filterable
              >
                <el-option
                  v-for="k in item.options"
                  :key="k.value"
                  :label="k.label"
                  :value="k.value"
                  :disabled="k.disabled"
                />
              </el-select>
              <!-- 虚拟选择器 用于渲染大量数据 -->
              <el-select-v2
                v-if="item.type === 'select-v2'"
                v-show="item.visible ?? true"
                style="width: 100%"
                v-model="form[item.prop]"
                :placeholder="item?.placeholder || item?.label"
                @change="onFormChange(item)"
                @visible-change="visible => onVisibleChange(visible, item)"
                :disabled="props?.formConfig?.disabled || item?.disabled"
                :multiple="item.multiple ?? false"
                :remote="item.remote ?? false"
                :loading="item.remoteLoading ?? false"
                :remote-method="query => remoteMethod(query, item)"
                :clearable="item.clearable ?? true"
                :allow-create="item.allowCreate ?? false"
                filterable
              >
                <el-option
                  v-for="k in item.options"
                  :key="k.value"
                  :label="k.label"
                  :value="k.value"
                  :disabled="k.disabled"
                />
              </el-select-v2>
              <el-date-picker
                v-if="
                  item.type === 'year' ||
                  item.type === 'month' ||
                  item.type === 'week' ||
                  item.type === 'date' ||
                  item.type === 'daterange' ||
                  item.type === 'datetimerange' ||
                  item.type === 'datetime'
                "
                v-show="item.visible ?? true"
                style="width: 100%"
                v-model="form[item.prop]"
                :type="item.type"
                :placeholder="item?.placeholder || item?.label"
                :default-time="item.defaultTime"
                @change="onFormChange(item)"
                :value-format="item.valueFormat ?? 'YYYY-MM-DD'"
                :format="item.format ?? 'YYYY-MM-DD'"
                :disabled="props?.formConfig?.disabled || item?.disabled"
                :disabled-date="item.disabledDate"
              />
              <el-checkbox-group
                v-model="form[item.prop]"
                v-if="item.type === 'checkbox'"
                v-show="item.visible ?? true"
                @change="onFormChange(item)"
              >
                <el-checkbox
                  v-for="(j, k) in item.checkboxOption"
                  :key="k"
                  :label="j.value"
                  :name="j.name"
                  :disabled="
                    props?.formConfig?.disabled || item?.disabled || j.disabled
                  "
                  >{{ j.label }}</el-checkbox
                >
              </el-checkbox-group>
              <el-radio-group
                v-model="form[item.prop]"
                v-if="item.type === 'radio'"
                v-show="item.visible ?? true"
                @change="onFormChange(item)"
                :disabled="props?.formConfig?.disabled || item?.disabled"
              >
                <el-radio
                  v-for="(j, k) in item.radioOption"
                  :key="k"
                  :label="j.value"
                  :disabled="props?.formConfig?.disabled || j?.disabled"
                  v-show="j.visible ?? true"
                  >{{ j.label }}</el-radio
                >
                <el-tooltip
                  v-if="item.radioTool"
                  class="box-item"
                  effect="light"
                  :content="item.radioTool"
                  placement="right"
                >
                  <IconifyIconOffline
                    class="text-slate-600 relative top-[-8px] left-[-30px]"
                    width="15px"
                    height="15px"
                    :icon="questionFilled"
                  />
                </el-tooltip>
              </el-radio-group>
              <el-switch
                v-if="item.type === 'switch'"
                v-show="item.visible ?? true"
                v-model="form[item.prop]"
                @change="onFormChange(item)"
                :disabled="props?.formConfig?.disabled || item?.disabled"
                :active-value="item.activeValue ?? true"
                :inactive-value="item.inactiveValue ?? false"
              />
              <template v-if="item.type === 'inputNumber'">
                <span class="mr-2">{{ item.header }}</span>
                <el-input-number
                  v-show="item.visible ?? true"
                  controls-position="right"
                  v-model="form[item.prop]"
                  :min="item.min"
                  :max="item.max"
                  :controls="item.controls"
                  :precision="item.precision"
                  @change="onFormChange(item)"
                  @blur="onFormBlur(item)"
                  :disabled="props?.formConfig?.disabled || item?.disabled"
                />
                <span class="ml-2">{{ item.append }}</span>
              </template>
              <el-time-picker
                v-if="item.type === 'timePicke'"
                v-show="item.visible ?? true"
                v-model="form[item.prop]"
                :disabled-hours="item.disabledHours"
                :disabled-minutes="item.disabledMinutes"
                :disabled-seconds="item.disabledSeconds"
                :format="item.valueFormat ?? 'HH:mm:ss'"
                placeholder="选择时间"
                :disabled="props?.formConfig?.disabled || item?.disabled"
              />
              <el-time-select
                v-if="item.type === 'timeSelect'"
                v-show="item.visible ?? true"
                v-model="form[item.prop]"
                :start="item.start ?? '08:00:00'"
                :step="item.step ?? '01:00:00'"
                :end="item.end ?? '20:30:00'"
                placeholder="选择时间"
                :format="item.valueFormat ?? 'HH:mm:ss'"
                :disabled="props?.formConfig?.disabled || item?.disabled"
              />
              <upload-file
                v-if="item.type === 'upload'"
                class="ml-1 upload-demo"
                :configs="{
                  accept: ['*'],
                  button: {
                    name: item.buttonName ?? '上传文件'
                  },
                  isDrop: false,
                  isShowList: false
                }"
                @success="
                  (res, file_item) =>
                    handleUploadSuccess(res, file_item, item, form)
                "
              />
              <GetoUploadImg
                v-if="item.type === 'uploadImg'"
                :fileConfig="item.fileConfig"
                :fileList="form[item.prop]"
                @handleUploadImgSuccess="
                  (res, file_item) =>
                    handleUploadImgSuccess(res, file_item, item, form)
                "
                @handleDeleteImg="
                  fileIndex => handleDeleteImg(fileIndex, item, form)
                "
              />
              <GetoUploadFileList
                v-if="item.type === 'uploadFile'"
                :fileConfig="item.fileConfig"
                :fileList="form[item.prop]"
                @handleUploadFileSuccess="
                  (res, file_item) =>
                    handleUploadFileSuccess(res, file_item, item, form)
                "
                @handleDeleteFile="
                  fileIndex => handleDeleteFile(fileIndex, item, form)
                "
              >
                <template #tableItem="{ fileRow, fileRindex, fileitem }">
                  <slot
                    name="fileTableItem"
                    :fileRow="fileRow"
                    :fileRindex="fileRindex"
                    :fileitem="fileitem"
                    :item="item"
                    :form="form"
                  />
                </template>
              </GetoUploadFileList>
              <template
                v-if="item.type === 'cascader' && (item.visible ?? true)"
              >
                <el-cascader
                  style="width: 100%"
                  v-model="form[item.prop]"
                  :options="item.options"
                  :props="item.props"
                  :disabled="props?.formConfig?.disabled || item?.disabled"
                  :clearable="item?.clearable || false"
                  @change="onFormChange(item)"
              /></template>

              <el-rate
                v-if="item.type === 'rate'"
                v-show="item.visible ?? true"
                v-model="form[item.prop]"
                allow-half
                :disabled="props?.formConfig?.disabled || item?.disabled"
              />
              <el-slider
                v-if="item.type === 'slider'"
                :max="item.max"
                :min="item.min"
                v-show="item.visible ?? true"
                v-model="form[item.prop]"
                :disabled="props?.formConfig?.disabled || item?.disabled"
              />
              <el-tree-select
                class="w-[100%]"
                v-if="item.type === 'treeSelect'"
                v-show="item.visible ?? true"
                v-model="form[item.prop]"
                :data="item.options"
                :render-after-expand="false"
                :multiple="item.multiple"
                :props="item.treeProps"
                :value-key="item?.treeProps?.valueKey ?? 'value'"
                :disabled="props?.formConfig?.disabled || item?.disabled"
                :check-strictly="item.checkStrictly"
              />
              <el-select
                v-if="item.type === 'geto-staff'"
                v-show="item.visible ?? true"
                class="w-[100%] geto-staff"
                ref="selectRef"
                v-model="form[item.prop]"
                placeholder="请选择"
                clearable
                multiple
                @clear="resetCustom(item)"
                @visible-change="clearUserList"
                :disabled="props?.formConfig?.disabled || item?.disabled"
              >
                <template #empty>
                  <el-row class="min-h-100 max-h-400">
                    <el-col :span="12">
                      <el-scrollbar height="400px">
                        <GetoTree
                          :data="item.staffTree"
                          :config="treeConfig"
                          @handleNodeClick="data => getoTreeClick(data, item)"
                          ref="getoTreeBox"
                        />
                      </el-scrollbar>
                    </el-col>
                    <el-col :span="12">
                      <div class="h-[100%] pt-4 pb-12 px-2">
                        <div
                          class="box-title text-sm font-bold pr-2 cursor-pointer mb-2"
                        >
                          已选择 {{ userTitle }}
                        </div>
                        <el-scrollbar class="relative" height="300px">
                          <div class="custom-list">
                            <!-- 单选部分 -->
                            <el-radio-group
                              v-model="radioUserId"
                              class="!block"
                              v-if="item.radio"
                            >
                              <div
                                class="box-title text-sm cursor-pointer"
                                v-for="ul in userList"
                                :key="ul.id"
                              >
                                <el-radio :label="ul.user_id">{{
                                  ul.name
                                }}</el-radio>
                              </div>
                            </el-radio-group>
                            <!-- 多选部分 -->
                            <div
                              v-else
                              class="box-title text-sm cursor-pointer"
                              v-for="ul in userList"
                              :key="ul.id"
                            >
                              <el-checkbox
                                v-model="ul.check"
                                :label="ul.name"
                              />
                            </div>
                          </div>
                        </el-scrollbar>
                        <div class="absolute bottom-3 right-5">
                          <el-button
                            size="small"
                            type="primary"
                            @click="treeClick(form, item)"
                            >确定</el-button
                          >
                          <el-button size="small" @click="cancelTree"
                            >取消</el-button
                          >
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 满足单边col -->
          <el-col :span="12" v-if="item.half" />
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import GetoTree from "@/geto-components/GetoTree/index.vue";
import UploadFile from "@/geto-components/GetoUploadFile/index.vue";
import GetoUploadImg from "@/geto-components/GetoUploadImg/index.vue";
import GetoUploadFileList from "@/geto-components/GetoUploadFileList/index.vue";
import questionFilled from "@iconify-icons/ep/question-filled";
import { message } from "@/utils/message";
import { Search } from "@element-plus/icons-vue";
defineOptions({
  name: "GetoForm",
  inheritAttrs: false // 防止父组件的属性被默认继承
});
const emits = defineEmits([
  "onFormChange",
  "onFormInputChange",
  "onFormBlur",
  "onSearchInput",
  "uploadSuccess",
  "beforeUpload",
  "remoteMethod",
  "handleUploadFileSuccess",
  "handleDeleteFile",
  "handleUploadImgSuccess",
  "handleDeleteImgFile"
]); // 定义发射给父组件的事件

const props = defineProps({
  rules: {
    type: Object,
    default: () => {}
  },
  formItemConfig: {
    type: Array,
    default: () => []
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
const formItemConfig = ref(props.formItemConfig);
const radioUserId = ref(0);
const defaultRules = ref([]);
const form = ref(cloneDeep(props.formInitial || {}));

const getoForm = ref();
// 表单提交校验方法,不通过则直接校验报错
const submitForm = async () => {
  if (!getoForm.value) return;
  const valid = await getoForm.value.validate();
  // 成功校验后返回form内容
  if (valid) return form;
};
// 表单提交校验方法,不通过则直接校验返回false,可以用与逻辑判断处理
const submitAsyncForm = async () => {
  if (!getoForm.value) return;
  try {
    const valid = await getoForm.value.validate();
    // 成功校验后返回form内容
    if (valid) return form;
  } catch (error) {
    return false;
  }
};

// 表单变动时的方法，可用于联动
const onFormChange = item => {
  emits("onFormChange", item, form.value);
  // 验证方法
  // 和自定义规则trigger冲突，暂时注释
  // getoForm?.value?.validateField(item.prop);
};
// 下拉选项显示/隐藏时的方法
const onVisibleChange = (visible, item) => {
  emits("onVisibleChange", visible, item, form.value);
};
const onFormInputChange = item => {
  emits("onFormInputChange", item, form.value);
  // 验证方法
  // 和自定义规则trigger冲突，暂时注释
  // getoForm?.value?.validateField(item.prop);
};
// 表单失焦时的方法
const onFormBlur = item => {
  emits("onFormBlur", item, form.value);
  // 验证方法
  // 和自定义规则trigger冲突，暂时注释
  // getoForm?.value?.validateField(item.prop);
};

// 表单点击查询按钮时的方法
const onSearchInput = item => {
  // 禁用时不执行方法
  if (props?.formConfig?.disabled || item?.disabled) return;
  emits("onSearchInput", item, form.value);
};
// 表单变动时的方法，可用于联动
const remoteMethod = (query, item) => {
  emits("remoteMethod", query, item, form.value);
};
const handleAvatarSuccess = (response, uploadFile) => {
  emits("uploadSuccess", response, uploadFile);
};
const beforeAvatarUpload = rawFile => {
  emits("beforeUpload", rawFile);
};
const resetForm = () => {
  form.value = {};
};
const setForm = (data, key) => {
  if (key) {
    form.value[key] = data;
    return;
  }
  form.value = data;
};
const updataForm = obj => {
  for (const key in obj) {
    form.value[key] = obj[key];
  }
};
// -----------------------------------------------------------人员选择器部分开始
const treeConfig = {
  showCheckbox: false,
  treePropsLabel: "name"
};
const userList = ref([]);
const userTitle = ref("");
const getoTreeBox = ref(null); // tree由于是循环生成的，所以ref会是个数组
const selectRef = ref(null);
const getoTreeClick = async (data, item) => {
  userList.value = [];
  userTitle.value = data.name;
  const res = await item.orgFunction({ org_id: data.id });
  if (res.code != "0") return;
  userList.value = res.data;
};
const treeClick = (from, item) => {
  if (item.radio) {
    const arr = userList.value
      .map(mitem => {
        const obj = {
          organization_id: mitem.organization_id,
          user_id: mitem.user_id,
          label: mitem.name
        };
        if (mitem.user_id === radioUserId.value) return obj;
      })
      .filter(fitem => !!fitem);
    from[item.prop] = arr;
    cancelTree();
  } else {
    const arr = userList.value
      .filter(fitem => fitem.check)
      .map(mitem => {
        const obj = {
          organization_id: mitem.organization_id,
          user_id: mitem.user_id,
          label: mitem.name
        };
        return obj;
      });
    // 自定义去重逻辑，基于 user_id 进行去重
    from[item.prop] = from[item.prop] || [];
    arr.forEach(newItem => {
      const exists = from[item.prop].some(
        existingItem => existingItem.user_id === newItem.user_id
      );
      if (!exists) {
        from[item.prop].push(newItem);
      }
    });
    userList.value.forEach(item => {
      item.check = false;
    });
  }
  onFormChange(item);
  // selectRef.value[item.treeId ?? 0].blur();
};

const setFormRules = formItemConfig => {
  const rules = {};
  formItemConfig.forEach(item => {
    if (item.required) {
      rules[item.prop] = [
        {
          required: true,
          message: `${
            item.type === "input" || item.type === "inputNumber"
              ? "请输入"
              : "请选择"
          }${item.label}`,
          trigger:
            item.type === "input" || item.type === "inputNumber"
              ? "blur"
              : "change"
        }
      ];
    }
  });
  return rules;
};
onMounted(() => {
  const rules = setFormRules(props.formItemConfig);
  defaultRules.value = rules;
});
const resetCustom = formItem => {
  // 重置列表
  userList.value = [];
  getoTreeBox.value[formItem.treeId ?? 0].resetTree();
};
const getForm = () => {
  return form.value;
};
const cancelTree = () => {
  if (Array.isArray(selectRef.value)) {
    selectRef.value.forEach(item => {
      item.blur();
    });
  } else {
    selectRef.value.blur();
  }
};
const clearUserList = () => {
  userTitle.value = "";
  userList.value = [];
};
// -----------------------------------------------------------人员选择器部分结束
// -----------------------------------------------------------上传成功方法
const handleUploadSuccess = (res, file_item, item, form) => {
  message("上传成功！", { type: "success" });
  if (Array.isArray(form[item.prop])) {
    form[item.prop].push({
      file_id: file_item.file_id,
      file_name: file_item.file_name,
      file_ext: file_item.file_ext
    });
  } else {
    form[item.prop] = [
      {
        file_id: file_item.file_id,
        file_name: file_item.file_name,
        file_ext: file_item.file_ext
      }
    ];
  }
  emits("handleUploadFileSuccess", res, file_item, item, form);
};

// 文件上传成功的回调
const handleUploadFileSuccess = (res, file_item, item, form) => {
  emits("handleUploadFileSuccess", res, file_item, item, form);
};
// 文件删除的回调
const handleDeleteFile = (fileIndex, item, form) => {
  if (Array.isArray(form[item.prop])) {
    form[item.prop].splice(fileIndex, 1);
  } else {
    form[item.prop] = [];
  }
  emits("handleDeleteFile", fileIndex, item, form);
};
// 图片上传成功的回调
const handleUploadImgSuccess = (res, file_item, item, form) => {
  emits("handleUploadImgSuccess", res, file_item, item, form);
};
// 图片删除的回调
const handleDeleteImg = (fileIndex, item, form) => {
  if (Array.isArray(form[item.prop])) {
    form[item.prop].splice(fileIndex, 1);
  } else {
    form[item.prop] = [];
  }
  emits("handleDeleteImg", fileIndex, item, form);
};
watch(
  () => props.formItemConfig,
  newVal => {
    formItemConfig.value = newVal;
  },
  {
    deep: true
    // immediate: true
  }
);
defineExpose({
  // 暴露出子组件方法
  submitForm,
  submitAsyncForm,
  resetForm,
  setForm,
  getForm,
  getoForm,
  formItemConfig,
  updataForm
});
</script>

<style lang="scss" scoped>
.geto-form {
  background-color: #fff;
  // padding: 20px;
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
