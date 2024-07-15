const Layout = () => import("@/layout/index.vue");

export default {
  path: "/public-system-setting",
  name: "public_system_setting",
  component: Layout,
  meta: {
    title: "公共系统配置",
    rank: 0,
    showLink: false
  },
  children: [
    {
      path: "/public-system-setting/message-center/message-list",
      name: "management_message_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/messageCenter/messageList.vue"
        ),
      meta: {
        title: "消息列表",
        activePath: "/public-system-setting"
      }
    },
    {
      path: "/public-system-setting/message-center/tracking-point",
      name: "management_message_tracking_point",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/messageCenter/trackingPointList.vue"
        ),
      meta: {
        title: "埋点库",
        activePath: "/public-system-setting"
      }
    },
    {
      path: "/public-system-setting/message-center/tracking-point-form",
      name: "management_message_tracking_point_form",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/messageCenter/components/trackingPointListForm.vue"
        ),
      meta: {
        title: "埋点库表单",
        keepAlive: true,
        activePath: "/public-system-setting"
      }
    },
    {
      path: "/public-system-setting/message-center/message-config",
      name: "management_message_message_config",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/messageCenter/messageConfig.vue"
        ),
      meta: {
        title: "消息配置",
        activePath: "/public-system-setting"
      }
    },
    {
      path: "/public-system-setting/message-center/message-config-form",
      name: "management_message_message_config_form",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/messageCenter/components/messageConfigForm.vue"
        ),
      meta: {
        title: "消息配置表单",
        // keepAlive: true,
        activePath: "/public-system-setting"
      }
    },
    {
      path: "/public-system-setting/message-center/execution-record-list",
      name: "management_execution_record_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/messageCenter/executionRecordList.vue"
        ),
      meta: {
        title: "执行记录",
        activePath: "/public-system-setting"
      }
    },
    {
      path: "/public-system-setting/message-center/send-record-list",
      name: "management_send_record_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/messageCenter/components/sendRecordList.vue"
        ),
      meta: {
        title: "发送记录",
        activePath: "/public-system-setting"
      }
    }
  ]
} as RouteConfigsTable;
