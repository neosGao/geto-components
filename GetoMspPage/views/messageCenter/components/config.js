// 消息列表（详情）
export const messageListDetail = [
  {
    type: "text",
    prop: "receive_time",
    label: "接收时间",
    display:true,
    span: 24
  },
  {
    type: "text",
    prop: "title",
    label: "标题",
    disabled: false,
    display:true,
    span: 24
  },
  {
    type: "slot",
    prop: "content",
    label: "内容",
    display:true,
    span: 24
  }
];
// 埋点库表单（头）
export const trackingPointListFormConfig = [
  {
    type: "input",
    prop: "code",
    label: "埋点ID",
    disabled: false,
    span: 6,
    half: false
  },
  {
    type: "input",
    prop: "name",
    label: "埋点名称",
    disabled: false,
    span: 6,
    half: false
  },
  {
    type: "cascader",
    prop: "menu_id",
    label: "所属模块象",
    options: [],
    props: { checkStrictly: true, emitPath: false, value: "id" },
    span: 6,
    half: false
  },
  {
    type: "input",
    prop: "remark",
    label: "描述",
    span: 6,
    half: false
  }
];
// 消息配置表单（头）
export const formItemConfig = [
  {
    type: "input",
    prop: "code",
    label: "消息配置ID",
    disabled: true,
    span: 6,
    half: false,
    maxlength: 25
  },
  {
    type: "input",
    prop: "name",
    label: "消息配置名称",
    span: 6,
    half: false
  },
  {
    type: "cascader",
    prop: "menu_id",
    label: "所属模块项",
    props: { checkStrictly: true, emitPath: false, value: "id" },
    options: [],
    span: 6,
    half: false
  },
  {
    type: "select",
    prop: "tracking_point_id",
    label: "触发操作",
    options: [],
    span: 6,
    half: false
  },
  {
    type: "select",
    prop: "trigger_type",
    label: "触发时机",
    options: [],
    span: 6,
    half: false
  },
  {
    type: "inputNumber",
    prop: "delay_minute",
    label: "延时时间",
    itemVisible: false,
    controls: false,
    append: "分钟",
    options: [],
    span: 6,
    half: false
  },
  {
    type: "select",
    prop: "channel_ids",
    label: "发布渠道",
    multiple: true,
    options: [],
    span: 12,
    half: false
  },
  {
    type: "select",
    prop: "send_type",
    label: "发送方式",
    options: [
      { value: 1, label: "群体发送" },
      { value: 2, label: "单个发送" }
    ],
    span: 5,
    half: false
  },
  {
    // 启用插槽
    type: "slot",
    prop: "tip",
    label: "",
    span: 1,
    half: false
  },
  {
    type: "input",
    prop: "remark",
    label: "描述",
    textType: "textarea",
    span: 6,
    half: false
  },
  {
    // 启用插槽
    type: "slot",
    prop: "wxqy_robot",
    label: "群聊机器人链接",
    itemVisible: false,
    span: 12,
    half: false
  }
];
const validatePass = (rule, value, callback) => {
  if (value.length && value[0].id === undefined) callback();
  for (const item of value) {
    if (!item.id || !item.remark) {
      callback(new Error("群聊机器人链接未填完整！"));
    }
  }
  callback();
};
// 消息配置表单（头校验）
export const formItemConfigRules = {
  wxqy_robot: [{ validator: validatePass, trigger: "blur" }]
};
// 消息配置表单（站内信）
export const mailFormConfig = [
  {
    type: "input",
    prop: "title",
    label: "标题",
    span: 12,
    maxlength: 100,
    half: true
  },
  {
    type: "input",
    prop: "content",
    label: "内容",
    textType: "textarea",
    itemVisible: false,
    span: 12,
    maxlength: 5000,
    half: false
  },
  {
    // 启用插槽
    type: "slot",
    prop: "tip",
    label: "内容",
    span: 18,
    half: false
  }
];
// 消息配置表单（邮箱）
export const mailboxFormConfig = [
  {
    type: "input",
    prop: "title",
    label: "邮箱标题",
    span: 12,
    maxlength: 100,
    half: true
  },
  {
    type: "input",
    prop: "content",
    label: "邮箱内容",
    textType: "textarea",
    itemVisible: false,
    span: 12,
    maxlength: 5000,
    half: false
  },
  {
    // 启用插槽
    type: "slot",
    prop: "tip",
    label: "邮箱内容",
    span: 18,
    half: false
  }
];
// 消息配置表单（企微应用）
export const wecomFormConfig = [
  {
    type: "input",
    prop: "content",
    label: "消息内容",
    textType: "textarea",
    span: 12,
    maxlength: 500,
    half: false
  }
  // {
  //   // 启用插槽
  //   type: "slot",
  //   prop: "tip",
  //   label: "消息内容",
  //   span: 18,
  //   half: false
  // }
];
// 消息配置表单（发送条件表单）
export const conditionForm = [
  {
    type: "select",
    prop: "left_parentheses",
    label: "左括号",
    options: [],
    span: 3
  },
  {
    type: "select",
    prop: "condition_fields",
    label: "字段",
    span: 3,
    options: []
  },
  {
    type: "select",
    prop: "compare",
    label: "比较",
    span: 3,
    options: []
  },
  {
    type: "select",
    typeId: "0",
    prop: "value",
    label: "值",
    remote: true,
    itemVisible: false,
    options: [],
    span: 3
  },
  {
    type: "input",
    typeId: "1",
    prop: "value",
    itemVisible: true,
    label: "值",
    span: 3
  },
  {
    type: "inputNumber",
    typeId: "2",
    prop: "value",
    itemVisible: false,
    controls: false,
    label: "值",
    span: 3
  },
  {
    type: "datetime",
    typeId: "3",
    prop: "value",
    itemVisible: false,
    label: "值",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    format: "YYYY-MM-DD HH:mm:ss",
    span: 3
  },
  {
    type: "date",
    typeId: "4",
    prop: "value",
    itemVisible: false,
    label: "值",
    span: 3
  },
  {
    type: "select",
    prop: "right_parentheses",
    label: "右括号",
    span: 3,
    options: []
  },
  {
    type: "select",
    prop: "connect",
    label: "连接",
    span: 3,
    options: []
  },
  {
    type: "slot",
    span: 3
  }
];
// 消息配置表单（发送条件表单 验证规则）
export const conditionFormRules = {
  condition_fields: [
    {
      required: true,
      message: "请选择字段",
      trigger: "change"
    }
  ],
  compare: [
    {
      required: true,
      message: "请选择",
      trigger: "change"
    }
  ],
  value: [
    {
      required: true,
      message: "请选择/输入",
      trigger: "blur"
    }
  ]
};
// 消息配置表单（接收人设置表单）
export const receiverForm = [
  {
    type: "slot",
    prop: "user",
    label: "用户",
    span: 24
  },
  {
    type: "select",
    prop: "job",
    label: "岗位",
    span: 24,
    multiple: true,
    options: []
  },
  {
    type: "select",
    prop: "department",
    label: "部门",
    span: 24,
    multiple: true,
    options: []
  },
  {
    type: "select",
    prop: "role",
    label: "角色",
    multiple: true,
    options: [],
    span: 24
  },
  {
    type: "select",
    prop: "variable",
    label: "变量接收人",
    span: 24,
    multiple: true,
    options: []
  }
];
// 消息配置表单（屏蔽用户设置表单）
export const shieldForm = [
  {
    type: "select",
    prop: "user",
    label: "用户",
    multiple: true,
    options: [],
    span: 24
  }
];
// 消息配置表单（头）
export const formRules = {
  field: [
    {
      required: true,
      message: "请选择字段",
      trigger: "change"
    }
  ],
  compare: [
    {
      required: true,
      message: "请选择",
      trigger: "change"
    }
  ],
  value: [
    {
      required: true,
      message: "请选择/输入",
      trigger: "change"
    }
  ]
};
