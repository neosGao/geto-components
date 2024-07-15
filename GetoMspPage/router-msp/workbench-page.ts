const Layout = () => import("@/layout/index.vue");

export default {
  path: "/workbench",
  component: Layout,
  meta: {
    title: "工作台",
    rank: 0,
    showLink: false
  },
  children: [
    {
      path: "/workbench/my-task",
      name: "my_task",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/workbench/my-task/index.vue"
        ),
      meta: {
        title: "我的任务",
        activePath: "/workbench"
      }
    },
    {
      path: "/workbench/system-announcement",
      name: "my_system_announcement",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/workbench/system-announcement/index.vue"
        ),
      meta: {
        title: "系统公告",
        activePath: "/workbench"
      }
    }
  ]
} as RouteConfigsTable;
