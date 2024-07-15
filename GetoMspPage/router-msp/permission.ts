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
      path: "/public-setting/permission-manage/menu-list",
      name: "menu_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/menu-list/index.vue"
        ),
      meta: {
        keepAlive: true,
        title: "菜单列表",
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/permission-manage/role-list",
      name: "role_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/role-list/index.vue"
        ),
      meta: {
        title: "角色列表",
        keepAlive: true,
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/permission-manage/resource-permission-setting",
      name: "resource_permission_setting",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/resource-permission-setting/index.vue"
        ),
      meta: {
        title: "资源权限配置",
        keepAlive: true,
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/permission-manage/data-permission-setting",
      name: "data_permission_setting",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/data-permission-setting/index.vue"
        ),
      meta: {
        title: "数据权限配置",
        keepAlive: true,
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/permission-manage/role-field-permission-setting",
      name: "role_field_permission_setting",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/role-field-permission-setting/index.vue"
        ),
      meta: {
        title: " 角色字段权限配置",
        keepAlive: true,
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/permission-manage/form-field-permission-setting",
      name: "form_field_permission_setting",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/form-field-permission-setting/index.vue"
        ),
      meta: {
        title: "表单字段权限配置",
        keepAlive: true,
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/permission-manage/page-manage",
      name: "page_permission",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/page-manage/index.vue"
        ),
      meta: {
        title: "页面权限",
        keepAlive: true,
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/permission-manage/list-manage",
      name: "list_permission",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/list-manage/index.vue"
        ),
      meta: {
        title: "列表权限",
        keepAlive: true,
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/permission-manage/operate-manage",
      name: "operate_permission",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/operate-manage/index.vue"
        ),
      meta: {
        title: "操作权限",
        keepAlive: true,
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/permission-manage/user-permission-statement",
      name: "user_permission_statement",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/user-permission-statement/index.vue"
        ),
      meta: {
        title: "用户权限报表",
        keepAlive: true,
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/permission-manage/role-permission-statement",
      name: "role_permission_statement",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/permission-manage/role-permission-statement/index.vue"
        ),
      meta: {
        title: "角色权限报表",
        keepAlive: true,
        activePath: "/public-setting"
      }
    }
  ]
} as RouteConfigsTable;
