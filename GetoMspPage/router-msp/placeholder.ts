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
      path: "/public-setting/dictionary-manage/placeholder",
      name: "placeholder",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/dictionary-manage/placeholder/index.vue"
        ),
      meta: {
        keepAlive: true,
        title: "占位符",
        activePath: "/public-setting"
      }
    }
  ]
} as RouteConfigsTable;
