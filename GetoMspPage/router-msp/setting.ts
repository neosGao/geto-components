const Layout = () => import("@/layout/index.vue");

export default {
  path: "/public",
  name: "public",
  component: Layout,
  redirect: "/public-setting",
  meta: {
    icon: "setting",
    title: "公共配置",
    rank: 999
  },
  children: [
    {
      path: "/public-setting",
      name: "public_setting",
      component: () =>
        import("@/geto-components/GetoMspPage/views/menu-page/index.vue"),
      meta: {
        title: "公共配置",
        module: "public_setting",
        roles: ["public_setting"]
      }
    }
  ]
} as RouteConfigsTable;
