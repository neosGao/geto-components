export default {
  path: "/auditList",
  name: "auditPageList",
  meta: {
    keepAlive: true,
    icon: "platform",
    title: "审核",
    rank: 0,
    showLink: false
  },
  children: [
    {
      path: "/auditView",
      name: "auditView",
      component: () =>
        import("@/geto-components/GetoMspPage/views/auditView/index.vue"),
      meta: {
        keepAlive: true,
        title: "审核"
      }
    }
  ]
} as RouteConfigsTable;
