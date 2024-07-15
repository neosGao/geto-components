const Layout = () => import("@/layout/index.vue");

export default {
  path: "/public-setting",
  name: "public_setting",
  component: Layout,
  meta: {
    title: "公共系统配置",
    rank: 0,
    showLink: false
  },
  children: [
    {
      path: "/public-setting/public-service/system-log",
      name: "system_log",
      component: () =>
        import("@/geto-components/GetoMspPage/views/error/building.vue"),
      meta: {
        title: "系统日志",
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/public-service/message-center",
      name: "message_center",
      component: () =>
        import("@/geto-components/GetoMspPage/views/error/building.vue"),
      meta: {
        title: "消息中心",
        activePath: "/public-setting"
      }
    }
  ]
} as RouteConfigsTable;
