const Layout = () => import("@/layout/index.vue");

export default {
  path: "/field-form-manage",
  name: "field-form-manage",
  component: Layout,
  meta: {
    title: "字段和表单管理",
    rank: 0,
    showLink: false
  },
  children: [
    {
      path: "/field-form-manage/field-list",
      name: "field_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/field-form-manage/field-list/index.vue"
        ),
      meta: {
        title: "字段列表",
        keepAlive: true,
        activePath: "/field-list"
      }
    },
    {
      path: "/field-form-manage/form-template",
      name: "form_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/field-form-manage/form-template/index.vue"
        ),
      meta: {
        title: "表单列表",
        keepAlive: true,
        activePath: "/form-template"
      }
    },
    {
      path: "/field-form-manage/form-template/edit",
      name: "form-template-edit",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/field-form-manage/form-template/templateEdit.vue"
        ),
      meta: {
        title: "表单模板配置编辑",
        keepAlive: true,
        activePath: "/form-template/edit"
      }
    },
    {
      path: "/field-form-manage/form-template-modules",
      name: "module_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/field-form-manage/form-template-modules/index.vue"
        ),
      meta: {
        title: "模块列表",
        keepAlive: true,
        activePath: "/form-template-modules"
      }
    }
  ]
} as RouteConfigsTable;
