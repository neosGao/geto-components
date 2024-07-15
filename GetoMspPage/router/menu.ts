const { VITE_HIDE_HOME } = import.meta.env;

export default {
  path: "/menu/service",
  name: "menu_service",
  component: () =>
    import("@/geto-components/GetoMspPage/views/menu-page/index.vue"),
  meta: {
    title: "子菜单",
    showLink: VITE_HIDE_HOME === "true" ? false : true,
    rank: 0
  }
} as RouteConfigsTable;
