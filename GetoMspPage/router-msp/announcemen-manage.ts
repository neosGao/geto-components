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
      path: "/public-setting/announcement-manage/system-announcement",
      name: "system_announcement",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/announcement-manage/system-announcement/index.vue"
        ),
      meta: {
        keepAlive: true,
        title: "系统公告",
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/announcement-manage/system-announcement-info",
      name: "system_announcement_info",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/announcement-manage/system-announcement/info.vue"
        ),
      meta: {
        keepAlive: true,
        title: "公告详情",
        activePath: "/public-setting"
      }
    },
    {
      path: "/file/view",
      name: "file_view",
      component: () =>
        import("@/geto-components/GetoMspPage/views/view/view.vue"),
      meta: {
        keepAlive: true,
        title: "文件预览",
        activePath: "/public-setting"
      }
    }
  ]
} as RouteConfigsTable;
