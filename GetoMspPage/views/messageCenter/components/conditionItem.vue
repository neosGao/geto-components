<template>
  <div class="dark:text-white">
    <el-card v-for="(item, indexItem) in props.conditionDatas" :key="indexItem">
      <h3 v-if="!formConfig.disabled">
        条件 {{ indexItem + 1 }}
        <el-button type="text" @click="copy_condition(indexItem)"
          >复制</el-button
        >
        <el-button type="text" @click="del_condition(indexItem)"
          >删除</el-button
        >
      </h3>
      <div style="padding-left: 40px">
        <div>
          <h4>判断条件</h4>
          <GetoForm
            ref="conditionGetoForm"
            :formItemConfig="item.config"
            :formInitial="item.data"
            :rules="conditionFormRules"
            :formConfig="formConfig"
            @onFormChange="(item, form) => onFormChange(item, form, indexItem)"
            @remoteMethod="
              (query, data, form) => remoteMethod1(query, data, form)
            "
          >
            <template #formItem>
              <el-button
                v-if="!formConfig.disabled"
                type="primary"
                @click="click_condition_button(indexItem, 'add_condition')"
                >添加</el-button
              >
            </template>
          </GetoForm>
          <el-form :inline="false">
            <el-form-item
              label="条件公式"
              label-width="80px"
              style="width: 100%"
            >
              <div class="condition-box">
                <div
                  v-for="(line, index) in item.condition"
                  class="line"
                  :class="{ active: index === item.curLine }"
                  :key="index"
                  @click="click_line(indexItem, index)"
                >
                  <span
                    v-for="(subItem, index) in line"
                    :key="index"
                    :style="lineStyle(subItem.type)"
                    >{{ subItem.name }}&ensp;</span
                  >
                </div>
              </div>
            </el-form-item>
            <el-form-item style="width: 100%">
              <div v-if="!formConfig.disabled">
                <el-button
                  type="danger"
                  size="small"
                  @click="click_condition_button(indexItem, 'remove')"
                  >删行
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  @click="click_condition_button(indexItem, 'clear')"
                  >清空
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <h4>
            接收人
            <el-button
              v-if="!formConfig.disabled"
              type="text"
              @click="openDrawer(indexItem)"
              >添加接收人</el-button
            >
          </h4>
          <el-table border :data="item.target" style="width: 90%">
            <el-table-column
              type="index"
              align="center"
              width="100"
              label="序号"
            />
            <el-table-column
              align="center"
              prop="app_name"
              label="应用系统"
              width="150"
            />
            <el-table-column
              align="center"
              prop="type_name"
              label="类型"
              width="100"
            />
            <el-table-column align="center" prop="label" label="接收对象" />
            <el-table-column align="center" prop="label" label="操作"  width="100" v-if="!formConfig.disabled">
              <template #default="scope">
                <el-button
                  type="text"
                  v-model="scope.row"
                  @click="editTargetUser(scope.$index, indexItem)"
                >编辑</el-button>
                <el-button
                  type="text"
                  v-model="scope.row"
                  @click="deleteTargetUser(scope.$index, indexItem)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog title="接收人设置" v-model="receiverFormView" width="40%">
        <el-form
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="应用系统">
            <el-select
              v-model="curAppCode"
              placeholder="请选择"
              class="w-full"
              clearable
              filterable
            >
              <el-option
                v-for="item in appList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="接收人类型">
            <el-select
              v-model="curUserType"
              placeholder="请选择"
              class="w-full"
              clearable
              filterable
            >
              <el-option
                v-for="item in user_type_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary"  @click="toAddUser()"> 去设置 </el-button>
        </span>
      </template>
    </el-dialog>

    <selectUser
      @getSelectUser="onConfirmUser"
      ref="selectUserRef"
    />
    <selectPosition
      @getSelectPosition="onConfirmUser"
      ref="selectPositionRef"
    />
    <selectOrganization
      @getSelectOrganization="onConfirmUser"
      ref="selectOrganizationRef"
    />
    <selectRole
      @getRole="onConfirmUser"
      ref="selectRoleRef"
    />
    <selectVarUser
      :var_users_list="props.var_users_list"
      @getVarUser="onConfirmUser"
      ref="selectVarRef"
    />

  </div>
</template>

<script setup lang="ts">
import GetoForm from "@/geto-components/GetoForm/index.vue";
import selectUser from "@/geto-components/GetoMspPage/views/messageCenter/components/selectUser.vue";
import selectPosition from "@/geto-components/GetoMspPage/views/messageCenter/components/selectPosition.vue";
import selectOrganization from "@/geto-components/GetoMspPage/views/messageCenter/components/selectOrganization.vue";
import selectRole from "@/geto-components/GetoMspPage/views/messageCenter/components/selectRole.vue";
import selectVarUser from "@/geto-components/GetoMspPage/views/messageCenter/components/selectVarUser.vue";
import { conditionForm, conditionFormRules } from "./config.js";
import { getEnumValues } from "@/geto-components/GetoMspPage/api/messageCenter/messageConfig";
import { getAppList } from "@/geto-components/GetoMspPage/api/userManage/app-list";
import { ref, onMounted } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessageBox, ElMessage } from "element-plus";
import {message} from "@/utils/message";
const props = defineProps({
  index: {
    type: Number,
    default: () => 0
  },
  conditionDatas: {
    type: Object,
    default: () => {}
  },
  formConfig: {
    type: Object,
    default: () => {}
  },
  optionsAll: {
    type: Object,
    default: () => {}
  },
  var_users_list: {
    type: Array,
    default: () => []
  }
});
const emits = defineEmits(["getdata", "delCondition", "copyCondition"]); // 定义发射给父组件的事件
// ------------------------------------------------------- 常量 -------------------------------------------------------
interface res {
  code?: string;
  data?: any;
  message?: string;
}

const formConfig = ref(props.formConfig);
const receiverFormView = ref(false);
const selectUserRef = ref();
const selectPositionRef = ref();
const selectRoleRef = ref();
const selectVarRef = ref();
const selectOrganizationRef = ref();
const conditionGetoForm = ref();
const formItemConfig = ref(cloneDeep(conditionForm));
const optionsAlls = ref(props.optionsAll);
const curAppCode = ref('');
const curUserType = ref('');
const appList = ref([]);
const tracking_point_id = ref();
const setOption = id => {
  tracking_point_id.value = id;
  formItemConfig.value.forEach(item => {
    if (item.type === "select") {
      item.options = optionsAlls.value[item.prop];
    }
  });
  props.conditionDatas.forEach(item => {
    item.config = cloneDeep(formItemConfig.value);
    item.data = {};
  });

  console.log(props.conditionDatas);
};
const click_condition_button = async (indexItem, strType) => {
  try {
    switch (strType) {
      case "clear":
        await ElMessageBox.confirm("确定清空当前？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            props.conditionDatas[indexItem].condition = [];
          })
          .catch(() => {});
        break;
      case "remove":
        if (props.conditionDatas[indexItem].curLine === "") {
          ElMessage({
            type: "error",
            message: "请先选择一行！",
            showClose: true
          });
        } else {
          ElMessageBox.confirm("确定删除当前选中行？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              props.conditionDatas[indexItem].condition.splice(
                props.conditionDatas[indexItem].curLine,
                1
              );
              props.conditionDatas[indexItem].curLine = "";
            })
            .catch(() => {});
        }
        break;
      case "(":
        // conditionBox.insertLeftBracket();
        break;
      case ")":
        // conditionBox.insertRightBracket();
        break;
      case "add_condition":
        conditionGetoForm.value[indexItem]
          .submitForm()
          .then(formData => {
            add(indexItem, formData);
          })
          .catch(() => {});
        break;
    }
  } catch (e) {
    switch (e.name) {
      case "TypeError":
        console.error(e);
        throw e;
      default:
        ElMessage({
          type: "error",
          message: e,
          showClose: true
        });
    }
  }
};
interface valueObj {
  id: any;
  name: string;
  type: string;
}
const add = (indexItem, formData) => {
  const left_parentheses = formData.value.left_parentheses || ""; // 左括号  选填
  const field = formData.value.condition_fields; // 字段  必填
  const compare = formData.value.compare; // 比较  必填
  const type = formData.value.type; // 值  必填
  const value = formData.value.value; // 值  必填
  const right_parentheses = formData.value.right_parentheses || ""; // 右括号  选填
  const connect = formData.value.connect || ""; // 连接  第一条不填 第二条起必填
  if (indexItem && !connect) {
    ElMessage({
      type: "warning",
      message: "请选择连接符"
    });
  }
  const left_parenthesesObj: valueObj = getConditionsObj(
    left_parentheses,
    optionsAlls.value.left_parentheses,
    "bracket"
  );
  const fieldObj: valueObj = getConditionsObj(
    field,
    optionsAlls.value.condition_fields,
    "variable"
  );
  const conditionObj: valueObj = getConditionsObj(
    compare,
    optionsAlls.value.compare,
    "compare"
  );
  let valueObj: valueObj = { id: "", name: "", type: "" };
  if (type == 0) {
    console.log(props.conditionDatas[indexItem]);
    valueObj = getConditionsObj(
      value,
      props.conditionDatas[indexItem].config[3].options,
      "value"
    );
  } else {
    valueObj = {
      id: value,
      name: value,
      type: "value"
    };
  }
  const right_parenthesesObj: valueObj = getConditionsObj(
    right_parentheses,
    optionsAlls.value.right_parentheses,
    "bracket"
  );
  const connectObj: valueObj = getConditionsObj(
    connect,
    optionsAlls.value.connect,
    "connect"
  );
  const item = [
    left_parenthesesObj,
    fieldObj,
    conditionObj,
    valueObj,
    right_parenthesesObj,
    connectObj
  ].filter(item => item.name);
  props.conditionDatas[indexItem].condition.push(item);
  emits("getdata");
};
const copy_condition = index => {
  if (index || index === 0) {
    props.conditionDatas.push(cloneDeep(props.conditionDatas[index]));
  } else {
    props.conditionDatas.push({
      condition: [],
      target: [],
      curLine: "",
      config: cloneDeep(formItemConfig.value),
      data: {}
    });
  }
};
const del_condition = index => {
  props.conditionDatas.splice(index, 1);
  conditionGetoForm.value.forEach(item => {
    item.setForm(props.conditionDatas[index].data);
  });
};

const indexItemSet = ref();
const isEditReceiver = ref(false);
const curReceiverTableIndex = ref(0);
const openDrawer = index => {
  indexItemSet.value = index;
  receiverFormView.value = true;
};

const deleteTargetUser = async (tableIndex, groupIndex) => {
  console.log('deleteTargetUser', tableIndex, groupIndex)
  await ElMessageBox.confirm('确定删除？', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    props.conditionDatas[groupIndex].target.splice(tableIndex, 1)
  })
}

const editTargetUser = async (tableIndex, groupIndex) => {
  curReceiverTableIndex.value = tableIndex
  indexItemSet.value = groupIndex
  isEditReceiver.value = true

  const target = cloneDeep(props.conditionDatas[groupIndex].target[tableIndex])
  console.log('editTargetUser', tableIndex, groupIndex, target)
  const conf = getUserTypeConf(target.type)
  curAppCode.value = target.app_code
  curUserType.value = target.type
  conf.ref.value.show(target.app_code, target)
}

const remoteMethod1 = async (query, data, form) => {
  if (data.prop == "value" && query) {
    const param = {
      tracking_point_id: tracking_point_id.value,
      field_id: form.condition_fields,
      keyword: query
    };
    const res: res = await getEnumValues(param);
    data.options = res.data;
  }
};

const user_type_list = [
  {
    value: 'user',
    label: '用户',
    ref:selectUserRef,
  },
  {
    value: 'organization',
    label: '业务组织',
    ref:selectOrganizationRef,
  },
  {
    value: 'position',
    label: '岗位',
    ref:selectPositionRef,
  },
  {
    value: 'role',
    label: '角色',
    ref:selectRoleRef,
  },
  {
    value: 'variable',
    label: '变量接收人',
    ref:selectVarRef,
  }
];

const getUserTypeConf = (type) => {
  return user_type_list.find(item => item.value == type)
}
const onConfirmUser = (users) => {
  console.log('onConfirmUser', users);
  let label = [];
  let values = [];

  if (curUserType.value == 'user') {
    label = users.map(item => item.name + '(' + item.work_id + ')')
    values = users.map(i => {
      return {id:i.id, main_code:i.main_code, name:i.name, work_id:i.work_id, email:i.email}
    })
  } else if (curUserType.value == 'position') {
    label = users.map(item => item.name);
    values = users.map(i => {
      return {id:i.id, name:i.name}
    })
  } else if (curUserType.value == 'organization') {
    label = users.map(item => item.name)
    values = users.map(i => {
      return {id:i.id, name:i.name, main_code:i.main_code}
    })
  } else if (curUserType.value == 'role') {
    label = users.map(item => item.name)
    values = users.map(i => {
      return {id:i.id, name:i.name}
    })
  } else if (curUserType.value == 'variable') {
    label = users.map(item => item.label)
    values = users
  } else {
    return;
  }

  const app_name = appList.value.find(item => item.code == curAppCode.value)?.name || ''
  let userType = getUserTypeConf(curUserType.value)

  const data =  {
    app_code: curAppCode.value,
    app_name: app_name,
    type: userType.value,
    type_name: userType.label,
    label: label.join('、'),
    values: values,
  }

  if (isEditReceiver.value) {
    props.conditionDatas[indexItemSet.value].target[curReceiverTableIndex.value] = data
  }else {
    props.conditionDatas[indexItemSet.value].target.push(data)
  }
}

// 跳转到接收人设置弹窗
const toAddUser = () => {
  isEditReceiver.value = false
  const user_type = curUserType.value
  if (user_type == 'variable') {
    curAppCode.value = ''
  } else {
    if (!curAppCode.value) {
      message('请选择应用系统！', {type: 'warning'})
      return
    }

    if (!user_type) {
      message('请选择接收人类型！', {type: 'warning'})
      return
    }
  }

  const app_code  = curAppCode.value
  const userType = getUserTypeConf(user_type)

  let isExist = props.conditionDatas[indexItemSet.value].target.find(item => item.type === user_type && item.app_code == app_code)
  if (isExist) {
    message(isExist.app_name + userType.label + '已设置，请进行编辑');
    return;
  }

  let ref = getUserTypeConf(user_type).ref
  ref.value.show(app_code);
  receiverFormView.value = false;
};
const onFormChange = async (data, form, indexItem) => {
  if (data.prop === "condition_fields") {
    form.value = "";
    const selecter = data.options.find(
      item => item.value == form.condition_fields
    );
    if (selecter.is_remote) {
      form.type = 0;
      props.conditionDatas[indexItem].config.forEach(item => {
        if (item.prop === "value") {
          item.itemVisible = item.typeId == "0" ? true : false;
        }
      });
      const param = {
        tracking_point_id: tracking_point_id.value,
        field_id: form.condition_fields,
        keyword: ""
      };
      const res: res = await getEnumValues(param);
      props.conditionDatas[indexItem].config[3].options = res.data;
      return;
    } else {
      form.type = selecter.type;
      props.conditionDatas[indexItem].config.forEach(item => {
        if (item.prop === "value") {
          item.itemVisible = item.typeId == selecter.type ? true : false;
        }
      });
    }
  }
};
const click_line = (indexItem, index) => {
  props.conditionDatas[indexItem].curLine = index;
};
function lineStyle(type) {
  let style;
  switch (type) {
    case "variable":
      return (style = { color: "#1e88e5" });
      break;
    case "compare":
      return (style = { color: "#00953a" });
      break;
    case "value":
      return (style = { color: "#dc4e41" });
      break;
    case "connect":
      return (style = { color: "#dc4e41" });
      break;
    default:
      return (style = { color: "#1e88e5" });
  }
}
function getConditionsObj(id: any, list: any, type: string) {
  console.log(id);
  if (!id && id !== 0) {
    return {
      id: "",
      name: "",
      type: type
    };
  }
  for (const item of list) {
    if (id === item.value) {
      return {
        id: id,
        name: item.label,
        type: type
      };
    }
  }
}
// 挂载
onMounted(async () => {
  console.log('onMounted------------------------------------------------')
  console.log(props.optionsAll)

  const res:any = await getAppList()
  if (res.code == 0) {
    appList.value = res.data
  }

});
defineExpose({ setOption, copy_condition });
</script>

<style lang="scss" scoped>
.condition-box {
  overflow: auto;
  width: 100%;
  height: 150px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.line {
  cursor: pointer;
  padding-left: 14px;
}
.line:hover {
  background-color: #99ccff;
}
.active {
  background-color: #99ccff;
}
</style>
