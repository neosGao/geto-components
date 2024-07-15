const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/permission-manage",
  name: "permission_manage",
  component: Layout,
  redirect: "/permission-manage/role-list",
  meta: {
    title: "权限管理",
    rank: 0
  },
  children: [
    {
      path: "/permission-manage/menu-list",
      name: "menu_list",
      component: () =>
        import("@/geto-components/GetoMspPage/views/menu-list/index.vue"),
      meta: {
        title: "菜单列表",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    },
    {
      path: "/permission-manage/role-list",
      name: "role_list",
      component: () =>
        import("@/geto-components/GetoMspPage/views/role-list/index.vue"),
      meta: {
        title: "角色列表",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    },
    {
      path: "/permission-manage/role-baind-permission",
      name: "role_bind_permssion",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/role-list/bindPermissionPage.vue"
        ),
      meta: {
        title: "角色绑定权限",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    },
    {
      path: "/permission-manage/role-baind-data-permission",
      name: "role_bind_data_permssion",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/role-list/bindDataPage.vue"
        ),
      meta: {
        title: "绑定数据权限",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    },
    {
      path: "/permission-manage/page-manage",
      name: "page_manage",
      component: () =>
        import("@/geto-components/GetoMspPage/views/page-manage/index.vue"),
      meta: {
        title: "页面管理",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    },
    {
      path: "/permission-manage/list-manage",
      name: "list_manage",
      component: () =>
        import("@/geto-components/GetoMspPage/views/list-manage/index.vue"),
      meta: {
        title: "列表管理",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    },
    {
      path: "/permission-manage/operate-manage",
      name: "operate_manage",
      component: () =>
        import("@/geto-components/GetoMspPage/views/operate-manage/index.vue"),
      meta: {
        title: "操作管理",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} as RouteConfigsTable;
