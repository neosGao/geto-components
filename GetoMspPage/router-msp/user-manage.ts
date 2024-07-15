const Layout = () => import("@/layout/index.vue");

export default {
  path: "/public-setting",
  name: "public_setting",
  component: Layout,
  meta: {
    title: "用户管理",
    rank: 0,
    showLink: false
  },
  children: [
    {
      path: "/public-setting/user-manage/user-type-list",
      name: "user_type_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/user-manage/user-type-list/index.vue"
          ),
      meta: {
        title: "用户类型",
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/user-manage/user-list",
      name: "user_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/user-manage/user-list/index.vue"
        ),
      meta: {
        title: "用户列表",
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/user-manage/position-list",
      name: "position_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/user-manage/position-list/index.vue"
        ),
      meta: {
        title: "岗位列表",
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/user-manage/administrative-org-list",
      name: "organization_administration_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/user-manage/organization-administration-list/index.vue"
        ),
      meta: {
        title: "行政组织列表",
        activePath: "/public-setting"
      }
    },
    {
      path: "/public-setting/user-manage/business-org-list",
      name: "organization_business_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/user-manage/organization-business-list/index.vue"
        ),
      meta: {
        title: "业务组织列表",
        activePath: "/public-setting"
      }
    }
  ]
} as RouteConfigsTable;
