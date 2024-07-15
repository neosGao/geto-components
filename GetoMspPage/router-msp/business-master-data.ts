const Layout = () => import("@/layout/index.vue");

export default {
  path: "/business-master-data",
  component: Layout,
  redirect: "/public-setting",
  meta: {
    icon: "mostlyCloudy",
    title: "业务主数据",
    rank: 998
  },
  children: [
    {
      path: "/business-master-data/index",
      name: "business_master_data",
      component: () =>
        import("@/geto-components/GetoMspPage/views/menu-page/index.vue"),
      meta: {
        title: "业务主数据",
        module: "business_master_data",
        roles: ["business_master_data"]
      }
    }
  ]
} as RouteConfigsTable;
