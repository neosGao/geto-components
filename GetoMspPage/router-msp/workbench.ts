const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "workbench",
  component: Layout,
  redirect: "/workbench",
  meta: {
    icon: "platform",
    title: "工作台",
    rank: 0
  },
  children: [
    {
      path: "/workbench",
      name: "workbench",
      component: () =>
        import("@/geto-components/GetoMspPage/views/workbench/index.vue"),
      meta: {
        title: "工作台",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} as RouteConfigsTable;
