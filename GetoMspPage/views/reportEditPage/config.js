/*
 * @Author: 高文进 gwj@geto.com.cn
 * @Date: 2023-11-15 16:43:37
 * @LastEditors: 高文进 gwj@geto.com.cn
 * @LastEditTime: 2023-11-28 09:57:27
 * @FilePath: \sys-web\src\views\report\config.js
 * @Description:
 *
 * Copyright (c) gwj, All Rights Reserved.
 */

export const initFormItemConfig = [
  {
    type: "input",
    prop: "sn",
    label: "编号",
    disabled: true,
    itemVisible: false
  },
  {
    type: "input",
    prop: "name",
    label: "名称"
  },
  {
    type: "radio",
    prop: "source_type",
    optionsKeys: "source_type_list",
    label: "数据源类型",
    radioOption: []
  },
  {
    type: "select",
    prop: "target_system",
    optionsKeys: "system_list",
    label: "适用系统",
    multiple: true,
    options: [],
    itemVisible: false
  },
  {
    type: "slot",
    prop: "file_id",
    label: "导入文件",
    options: [],
    itemVisible: false
  },
  {
    type: "slot",
    prop: "file_list",
    label: "导入历史",
    itemVisible: false
  },
  {
    type: "input",
    prop: "unique_field",
    label: "唯一性字段",
    itemVisible: false
  },
  {
    type: "input",
    prop: "remark",
    label: "备注",
    rows: 5,
    textType: "textarea"
  }
];
export const formItemConfig = [
  {
    type: "input",
    prop: "name",
    label: "报表名称",
    span: 12,
    maxlength: 25
  },
  {
    type: "select",
    prop: "data_source_sn",
    label: "数据源",
    span: 12,
    options: []
  },
  {
    type: "slot",
    prop: "view_rule",
    label: "报表查看权限",
    span: 12,
    maxlength: 25
  },
  {
    type: "radio",
    prop: "chart_type",
    label: "图表类型",
    span: 12,
    radioOption: [
      // { value: 1, label: "明细表" },
      // { value: 2, label: "条形图" },
      // { value: 3, label: "柱状图" },
      // { value: 4, label: "折线图" },
      // { value: 5, label: "雷达图" },
      // { value: 6, label: "饼状图" },
      // { value: 7, label: "漏斗图" }
    ]
  },
  {
    type: "slot",
    prop: "edit_rule",
    label: "报表编辑权限",
    span: 12
  },
  {
    type: "select",
    prop: "aggregate_type",
    label: "列汇总",
    span: 12,
    hidden: false
  },
  {
    type: "select",
    prop: "group_by_field",
    label: "图表维度",
    multiple: true,
    span: 12
  },
  {
    type: "select",
    prop: "statistic_field",
    label: "图表数值",
    multiple: true,
    span: 12
  }
];

export const formRules = {
  name: [
    {
      required: true,
      message: "请输入名称",
      trigger: "blur"
    }
  ],
  source_type: [
    {
      required: true,
      message: "请选择数据源类型",
      trigger: "blur"
    }
  ],
  target_system: [
    {
      required: true,
      message: "请选择适用系统",
      trigger: "blur"
    }
  ],
  unique_field: [
    {
      required: true,
      message: "请输入唯一性字段",
      trigger: "blur"
    }
  ],
  file_id: [
    {
      required: true,
      message: "请导入文件",
      trigger: "blur"
    }
  ]
};
