<template>
  <div class="dark:text-white" style="padding-left: 10px; margin-bottom: 20px">
    <GetoBackBar title="消息配置表单" :routeName="routeName">
      <template #extra>
        <el-button
          type="primary"
          @click="operateHandle('edit')"
          v-if="formConfig.disabled"
          >编辑</el-button
        >
        <el-button
          type="primary"
          v-if="!formConfig.disabled"
          @click="operateHandle('save')"
          >保存</el-button
        >
        <!-- <el-button @click="operateHandle('exit')">退出</el-button> -->
      </template>
    </GetoBackBar>
    <GetoForm
      ref="getoForm"
      style="margin-top: 10px"
      :formItemConfig="initFormItemConfig"
      :formInitial="formData"
      :rules="formItemConfigRules"
      :formConfig="formConfig"
      @onFormChange="onFormChange"
    >
      <template #formItem="{ form, item }">
        <span v-if="item.prop === 'tip'">
          <el-tooltip
            class="box-item"
            effect="light"
            content="Bottom Right prompts info"
            placement="bottom-end"
          >
            <template #content>
              <div class="tipStyle">
                “单个发送”为对接收人一个一个的发送消息；<br />“群体发送”为多个接收人一起发送。<br />
                注意事项：当标题和内容内出现“接收人名字”变量时，建议选择“单个发送”，否则会出现所有接收人收到的事同一个人的名字的情况。
              </div>
            </template>
            <el-button link type="warning" :icon="QuestionFilled" />
          </el-tooltip>
        </span>
        <span v-if="item.prop === 'wxqy_robot'">
            <el-button
              v-if="!formConfig.disabled"
              link
              type="primary"
              @click="add_wxqy_robot(form, item)"
            >添加</el-button
            >
          <div v-for="(item, index) in form.wxqy_robot" :key="index">
            <el-input
              v-model="item.id"
              placeholder="请输入机器人id"
              style="width: 400px"
              :disabled="formConfig.disabled"
            />
            <el-input
              v-model="item.remark"
              class="input-with-select"
              placeholder="请输入机器人备注"
              style="width: 200px"
              :disabled="formConfig.disabled"
            />
            <el-button
              link
              v-if="!formConfig.disabled"
              type="primary"
              @click="del_wxqy_robot(form, index)"
              v-show="index != 0"
              >删除</el-button
            >
          </div>
        </span>
      </template>
    </GetoForm>
    <!-------------------------------------------------------  渠道信息 ------------------------------------------------------------------------>

    <el-tabs v-model="activeKey" class="dropdown-tabs">
      <div v-for="item in tabsData" :key="item.id">
        <el-tab-pane :label="item.label" :name="item.id" v-if="item.show">
          <el-card class="box-card">
            <el-form class="demo-form-inline">
              <el-form-item :label="item.formLabel1">
                <el-input
                  :maxlength="item.maxlength"
                  :show-word-limit="item.maxlength"
                  :type="item.textType"
                  :placeholder="item.label"
                  v-model="item.title"
                  rows="10"
                  :disabled="formConfig.disabled"
                />
              </el-form-item>
              <el-form-item
                :label="item.formLabel1"
                v-if="item.refText === 'mailboxTinymce'"
              >
                <GetoTinymce
                  ref="mailboxTinymce"
                  :id="item.refText"
                  :tinyVal="item.content"
                  @beforeUnmount="beforeUnmount"
                />
              </el-form-item>
              <el-form-item
                :label="item.formLabel1"
                v-if="item.refText === 'mailTinymce'"
              >
                <GetoTinymce
                  ref="mailTinymce"
                  :id="item.refText"
                  :tinyVal="item.content"
                  @beforeUnmount="beforeUnmount"
                />
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
    <!-------------------------------------------------------  发送条件/接收人设置 ------------------------------------------------------------------------>
    <div>
      <div class="title">
        发送条件/接收人设置
        <el-button
          type="primary"
          v-if="!pageDisabled"
          @click="click_add_condition()"
          >新增</el-button
        >
      </div>
      <div>
        <ConditionItem
          ref="conditionItem"
          :optionsAll="optionsAll"
          :var_users_list="var_users_list"
          :conditionDatas="conditionData"
          :formConfig="formConfig"
          @getdata="getdata"
        />
      </div>
    </div>
    <div>
      <div class="title">
        屏蔽用户设置
        <el-button type="primary" v-if="!pageDisabled" @click="openDrawer()"
          >设置</el-button
        >
      </div>
      <el-table border :data="shieldTableData" style="width: 90%">
        <el-table-column type="index" align="center" width="100" label="序号" />
        <el-table-column align="center" prop="app_name"  width="150" label="应用系统" />
        <el-table-column align="center" prop="label" label="用户"/>
        <el-table-column align="center" label="操作" width="100"  v-if="!pageDisabled">
          <template #default="scope">
            <el-button
              type="text"
              v-model="scope.row"
              @click="editBlockedUser(scope.$index)"
            >编辑</el-button>
            <el-button
              type="text"
              v-model="scope.row"
              @click="deleteBlockedUser(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="设置屏蔽用户" v-model="shieldFormView" width="40%">
        <el-form
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="应用系统" required>
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
        </el-form>
        <template #footer>
        <span class="dialog-footer">
          <el-button type="primary"  @click="toAddUser()"> 去设置 </el-button>
        </span>
        </template>
      </el-dialog>

    </div>

    <selectUser
      @getSelectUser="onConfirmUser"
      ref="selectUserRef"
    />
  </div>
</template>

<script setup lang="ts">
import GetoForm from "@/geto-components/GetoForm/index.vue";
import GetoBackBar from "@/geto-components/GetoBackBar/index.vue";
import GetoTinymce from "@/geto-components/GetoTinymce/index.vue";
import ConditionItem from "./conditionItem.vue";
import { cloneDeep } from "@pureadmin/utils";
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  info,
  create,
  edit,
  menuTree,
  getTrackingPointList,
  getSelectOptions
} from "@/geto-components/GetoMspPage/api/messageCenter/messageConfig";
import {
  formItemConfigRules,
  formItemConfig,
  mailFormConfig,
  mailboxFormConfig,
  wecomFormConfig
} from "./config.js";
import { QuestionFilled } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { handleAliveRoute } from "@/router/utils";
import { nextTick } from "process";
import {getAppList} from "@/geto-components/GetoMspPage/api/userManage/app-list";
import {message} from "@/utils/message";
import selectUser from "@/geto-components/GetoMspPage/views/messageCenter/components/selectUser.vue";

defineOptions({
  name: "management_message_message_config_form"
});

const selectUserRef = ref();

interface res {
  code?: string;
  data?: any;
  message?: string;
}

const formConfig = ref({
  labelPosition: "right",
  disabled: false
});

const var_users_list = ref([]);

const optionsAll = ref({
  point: [],
  receive_users: [],
  blocked_users: [],
  blocked_user: [],
  condition_fields: [], //字段
  trigger_types: [], //字段
  message_channels: [], //字段
  compare: [
    // 比较
    { value: "=", label: "=" },
    { value: ">", label: ">" },
    { value: "<", label: "<" },
    { value: "≥", label: "≥" },
    { value: "≤", label: "≤" },
    { value: "≠", label: "不等于" },
    { value: "⛻", label: "包含" },
    { value: "⊄", label: "不包含" },
    { value: "☽", label: "左包含" },
    { value: "☾", label: "右包含" }
  ],
  left_parentheses: [
    { value: "(", label: "(" },
    { value: "((", label: "((" },
    { value: "(((", label: "(((" },
    { value: "((((", label: "((((" }
  ],
  right_parentheses: [
    { value: ")", label: ")" },
    { value: "))", label: "))" },
    { value: ")))", label: ")))" },
    { value: "))))", label: "))))" }
  ],
  connect: [
    { value: "|", label: "或者" },
    { value: "&", label: "并且" }
  ],
  value: []
});

const getoForm = ref();
const activeKey = ref(1);
const formData = ref({
  wxqy_robot: [{
    id: "",
    remark: ""
  }],
  delay_minute: Number,
  tracking_point_id: ""
});
const add_wxqy_robot = form => {
  form.wxqy_robot.push({
    id: "",
    remark: ""
  });
};
const del_wxqy_robot = (form, index) => {
  form.wxqy_robot.splice(index, 1);
};

// 站内信 邮箱 企微应用
const tabsData = ref([
  {
    ref: "mailGetoForm",
    refText: "mailTinymce",
    show: true,
    id: 2,
    label: "站内信",
    formLabel1: "站内信标题",
    formLabel2: "站内信内容",
    content: "",
    title: "",
    maxlength: "100",
    textType: "input",
    formConfig: mailFormConfig,
    formData: {}
  },
  {
    ref: "mailboxGetoForm",
    refText: "mailboxTinymce",
    show: true,
    id: 1,
    label: "邮箱",
    formLabel1: "邮箱标题",
    formLabel2: "邮箱内容",
    content: "",
    title: "",
    maxlength: "100",
    textType: "input",
    formConfig: mailboxFormConfig,
    formData: {}
  },
  {
    ref: "wecomGetoForm",
    refText: "wecomTinymce",
    show: true,
    id: 3,
    label: "企微应用",
    formLabel1: "消息内容",
    content: "",
    title: "",
    maxlength: "500",
    textType: "textarea",
    formConfig: wecomFormConfig,
    formData: {}
  }
]);
const mailTinymce = ref();
const mailboxTinymce = ref();
// const wecomTinymce = ref();
// 发送条件/接收人设置
const conditionItem = ref();
const conditionData = ref([]);

const click_add_condition = () => {
  conditionItem.value.copy_condition();
};

const onConfirmUser = (users) => {
  console.log('onConfirmUser', users)
  let label = users.map(item => item.name + '(' + item.work_id + ')')
  let values = users.map(i => {
    return {id:i.id, main_code:i.main_code, name:i.name, work_id:i.work_id, email:i.email}
  })

  const app_name = appList.value.find(item => item.code == curAppCode.value)?.name || ''

  const data =  {
    app_code: curAppCode.value,
    app_name: app_name,
    label: label.join('、'),
    values: values,
  }

  if (isEditReceiver.value) {
    shieldTableData.value[curShieldTableIndex.value] = data
  }else {
    shieldTableData.value.push(data)
  }
}

// 屏蔽用户设置
const shieldFormView = ref(false);
const curAppCode = ref('');
const isEditReceiver = ref(false);
const shieldTableData = ref([]);
const curShieldTableIndex = ref(0);

const id = ref("");
const routeName = ref("management_message_tracking_point");

const initFormItemConfig = ref(cloneDeep(formItemConfig));
const router = useRouter();
const useroute = useRoute();
const onFormChange = async (data, form, notClear = false) => {
  if (data.prop === "tracking_point_id") {
    if (!notClear) {
      conditionData.value = [];
    }
    if (form.tracking_point_id) {
      await setSelectOptions(form);
      conditionItem.value.setOption(form.tracking_point_id);
    }
  }
  if (data.prop === "channel_ids") {
    let channel_types = [];
    if (form.channel_ids) {
      tabsData.value.forEach((item, index) => {
        channel_types = optionsAll.value.message_channels.map(item => {
          if (form.channel_ids.includes(item.value)) {
            if (item.channel_type == 4) item.channel_type = [3, 4];
            return item.channel_type;
          }
        });
        channel_types = channel_types.flat(2);
        item.show = channel_types.includes(item.id);
        if (item.show) {
          activeKey.value = item.id;
        }
        tabsData.value[index]= item;
      });
    }

    if (channel_types.includes(4)){
      if (!form.wxqy_robot || form.wxqy_robot.length == 0) {
        form.wxqy_robot = [{id:"", remark:""}];
      }
    } else {
      form.wxqy_robot = [];
    }

    initFormItemConfig.value.forEach(item => {
      if (item.prop === "wxqy_robot") {
        item.itemVisible = channel_types.includes(4);
      }
    });
  }
  if (data.prop === "trigger_type") {
    initFormItemConfig.value.forEach(item => {
      if (item.prop === "delay_minute") {
        item.itemVisible = form.trigger_type == 3;
      }
    });
  }
};
const getdata = () => {};
const openDrawer = () => {
  shieldFormView.value = true;
};

const deleteBlockedUser = async (tableIndex) => {
  await ElMessageBox.confirm('确定删除？', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    shieldTableData.value.splice(tableIndex, 1)
  })
}

const editBlockedUser = (tableIndex) => {
  isEditReceiver.value = true
  curShieldTableIndex.value = tableIndex

  const blockedUser = shieldTableData.value[tableIndex]
  curAppCode.value = blockedUser.app_code
  selectUserRef.value.show(curAppCode.value, blockedUser)
}

// 跳转到接收人设置弹窗
const toAddUser = () => {
  isEditReceiver.value = false
    if (!curAppCode.value) {
      message('请选择应用系统！', {type: 'warning'})
      return
    }

  shieldFormView.value = false
  selectUserRef.value.show(curAppCode.value)
};

const operateHandle = async type => {
  if (type === "edit") {
    pageType.value = "edit";
    pageDisabled.value = false;
    formConfig.value.disabled = false;
    if (tabsData.value[0].show) {
      mailTinymce?.value[0]?.setDesign();
    }
    if (tabsData.value[1].show) {
      mailboxTinymce?.value[0]?.setDesign();
    }
  }
  if (type === "save") {
    let param;
    getFormData(true)
      .then(res => {
        param = res;
      })
      .finally(async () => {
        if (param === false) {
          return;
        }
        if (pageType.value == "edit") {
          const res: res = await edit(param);
          if (res.code == "0") {
            ElMessage({
              type: "success",
              message: "编辑成功"
            });
            toTableList();
          }
        } else {
          const res: res = await create(param);
          if (res.code == "0") {
            ElMessage({
              type: "success",
              message: "新增成功"
            });
            toTableList();
          }
        }
      })
  }
};
const getFormData = async (validate = false) => {
  const templates = [];
  let form = null;

  // 根据设置的规则校验表单，如果校验不通过，获取到的内容是false
  if (validate) {
    form = await getoForm.value.submitAsyncForm();
    if (form === false) {
      return false;
    }
    form = form.value;
  } else {
    // 不校验表单，直接获取一天填写的内容
    form = await getoForm.value.getForm();
  }

  if (tabsData.value[0].show && mailTinymce?.value && mailTinymce?.value[0]) {
    templates.push({
      title: tabsData.value[0].title,
      content: mailTinymce.value[0].getData(),
      channel_type: 2
    });
  }
  if (tabsData.value[1].show && mailboxTinymce?.value && mailboxTinymce.value[0]) {
    templates.push({
      title: tabsData.value[1].title,
      content: mailboxTinymce.value[0].getData(),
      channel_type: 1
    });
  }
  if (tabsData.value[2].show) {
    templates.push({
      title: "",
      content: tabsData.value[2].title,
      channel_type: 3
    });
  }
  if (form.trigger_type != 3 && form.trigger_type) {
    form.delay_minute = 0;
  }
  const param = {
    ...form,
    extra: {
      wxqy_robot: form.wxqy_robot,
      delay_minute: form.delay_minute || 0
    },
    templates,
    send_config: conditionData.value,
    blocked_users: shieldTableData.value
  };
  console.log("paramparamparam", param);
  return param;
};
const templatesData = ref([]);
const userList = ref([]);
const beforeUnmount = (id, content) => {
  const form = {
    title: "",
    content: "",
    channel_type: 0
  };
  if (id === "mailTinymce") {
    form.title = tabsData.value[0].title;
    form.content = content;
    form.channel_type = 2;
  }
  if (id === "mailboxTinymce") {
    form.title = tabsData.value[1].title;
    form.content = content;
    form.channel_type = 1;
  }
  templatesData.value.push(cloneDeep(form));
};
onBeforeUnmount(() => {
  getFormData().then(res => {
    if (res && !res.templates) {
      res.templates = [];
    }
    res.templates = templatesData.value;
    sessionStorage.setItem("messageConfigForm", JSON.stringify(res));
  });
});
const pageType = ref("");
const pageDisabled = ref(false);
const appList = ref([]);

onMounted(async () => {

  const res:any = await getAppList()
  if (res.code == 0) {
    appList.value = res.data
  }

  pageType.value = router.currentRoute.value.query.type as string;
  if (["view","copy"].includes(pageType.value)) {
    if (pageType.value === 'view'){
      pageDisabled.value = true;
      formConfig.value.disabled = true;
    }

    id.value = router.currentRoute.value.query.id as string;
    const res: res = await info({ id: id.value });
    if (res.code == "0") {
      let resData = res.data;
      if (pageType.value ==='copy') {
        resData.id = 0
        resData.code = ""
      }
      await setDataForm(resData);
    }
  } else {
    if (
      sessionStorage.getItem("messageConfigForm") &&
      sessionStorage.getItem("messageConfigForm") !== "undefined"
    ) {
      const messageConfigFormData = JSON.parse(
        sessionStorage.getItem("messageConfigForm")
      );
      await setDataForm(messageConfigFormData);
    }
  }

  await setMenuTree();
  await setUserList();
  await setTrackingPointList();
});
const setDataForm = async dataForm => {
  const getoFormData = {
    id: dataForm.id || "",
    code: dataForm.code || "",
    name: dataForm.name || "",
    menu_id: dataForm.menu_id || "",
    tracking_point_id: dataForm.tracking_point_id || "",
    trigger_type: dataForm.trigger_type || "",
    delay_minute: dataForm.extra.delay_minute || "",
    channel_ids: dataForm.channel_ids || [],
    send_type: dataForm.send_type || "",
    remark: dataForm.remark || "",
    wxqy_robot: dataForm.extra.wxqy_robot || ""
  };
  getoForm.value.setForm(getoFormData);
  await onFormChange(
    {prop: "trigger_type"},
    {trigger_type: dataForm.trigger_type}
  );
  conditionData.value = dataForm.send_config;
  await onFormChange(
    { prop: "tracking_point_id" },
    { tracking_point_id: dataForm.tracking_point_id },
    true
  );
  shieldTableData.value = dataForm.blocked_users || [];
  await onFormChange({prop: "channel_ids"}, {channel_ids: dataForm.channel_ids});
  nextTick(() => {
    if (dataForm.templates.length) {
      dataForm.templates.forEach(item => {
        if (item.channel_type == 1) {
          tabsData.value[1].title = item.title;
          mailboxTinymce.value[0].setData(item.content);
          if (pageType.value === "view") {
            mailboxTinymce.value[0].setReadonly();
          }
        }
        if (item.channel_type == 2) {
          tabsData.value[0].title = item.title;
          mailTinymce.value[0].setData(item.content);
          if (pageType.value === "view") {
            mailTinymce.value[0].setReadonly();
          }
        }
        if (item.channel_type == 3) {
          tabsData.value[2].title = item.content;
        }
      });
    }
  });
};
const setMenuTree = async () => {
  const res: res = await menuTree();
  initFormItemConfig.value.forEach(item => {
    if (item.prop === "menu_id") {
      item.options = res.data;
    }
  });
};
const setUserList = async () => {
    await getFormData()
}

const setTrackingPointList = async () => {
  const res: res = await getTrackingPointList();
  initFormItemConfig.value.forEach(item => {
    if (item.prop === "tracking_point_id") {
      item.options = res.data;
    }
  });
}

const setSelectOptions = async form => {

  const res: any = await getSelectOptions({
    tracking_point_id: form.tracking_point_id
  });

  var_users_list.value = res.data.receiver_variables

  console.log('var_users_list',var_users_list.value)

  optionsAll.value = Object.assign(optionsAll.value, res.data);
  initFormItemConfig.value.forEach(item => {
    if (item.prop === "trigger_type") {
      item.options = optionsAll.value.trigger_types;
    }
    if (item.prop === "channel_ids") {
      item.options = optionsAll.value.message_channels;
    }
  });
};

const env = import.meta.env;
const toTableList = () => {
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    useMultiTagsStoreHook().handleTags(
      "splice",
      router.currentRoute.value.path
    );
    handleAliveRoute(useroute as ToRouteType);
    router.push({
      name: "management_message_message_config"
    });
    return;
  }
  // ms架构的跳转''
  const routes = router.getRoutes();
  const route = routes.find(
    item => item.name == "management_message_message_config"
  );
  const host = env.VITE_PUBLIC_PATH + "#";
  const title = route.meta.title;
  const url = host + route.path;
  const params = [
    {
      name: title,
      path: url,
      url: url
    }
  ];
  window.parent.postMessage({ flag: "tab", data: params }, "*"); //解决跨域
  window.parent.postMessage({ flag: "loading", data: { loading: false } }, "*");
};
</script>
<style lang="scss" scoped>
.tipStyle {
  width: 250px;
  color: rgb(226, 156, 65);
}
.title {
  font-size: 20px;
  font-weight: 600;
  margin: 15px 0;
}
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

:deep(.el-tabs__header) {
  margin: 0;
}
</style>
