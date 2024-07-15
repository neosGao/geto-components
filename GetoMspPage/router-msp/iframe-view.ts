/*
 * @Author: 邱永健 qyj@geto.com.cn
 * @Date: 2024-06-11 16:43:02
 * @LastEditors: 邱永健 qyj@geto.com.cn
 * @LastEditTime: 2024-06-21 16:34:28
 * @FilePath: \approval-process-service-web2\src\geto-components\GetoMspPage\router-msp\iframe-view.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  path: "/iframeList",
  name: "iframePageList",
  meta: {
    keepAlive: true,
    icon: "platform",
    title: "",
    rank: 0,
    showLink: false
  },
  children: [
    {
      path: "/iframeView",
      name: "iframeView",
      component: () => import("@/geto-components/GetoMspPage/views/iframeView/index.vue"),
      meta: {
        keepAlive: true,
        title: "iframe"
      }
    }
  ]
} as RouteConfigsTable;
