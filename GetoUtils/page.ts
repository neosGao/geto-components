import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useRouter, useRoute } from "vue-router";
import { computed, unref } from "vue";
import { handleAliveRoute } from "@/router/utils";

export function usePage() {
  // -----------------------------------------------变量-----------------------------------------------
  const router = useRouter();
  const route = useRoute();
  const routes = router.getRoutes();
  const multiTags = computed(() => {
    return useMultiTagsStoreHook()?.multiTags;
  });
  // -----------------------------------------------方法-----------------------------------------------
  /**
   * 跳转至持续标签 - 使用query传参的方式跳转
   *
   * @param {string} routeName - 目标路由名称
   * @param {object} parameter - query参数
   * @param {string} routeTitle - 标签名称
   * @param {boolean} tagsClose - 是否关闭当前标签页
   */
  const addPageByQuery = (routeName, parameter, routeTitle = "", tagsClose = false) => {
    const multiTagsData = multiTags.value as any;
    if (multiTagsData.map(i => i.name).includes(routeName)) {
      const path = multiTagsData.find(i => i.name == routeName).path;
      useMultiTagsStoreHook().handleTags("splice", path);
    }
    if (tagsClose) {
      // 关闭当前页
      closeTagsByPathNoJump(router.currentRoute.value.path);
    }
    const route = routes.find(item => item.name == routeName);
    const title = routeTitle ? routeTitle : route.meta.title;
    route.meta.title = title as string;
    useMultiTagsStoreHook().handleTags("push", {
      path: route.path,
      name: routeName,
      query: parameter,
      meta: route.meta
    });
    router.push({
      name: routeName,
      query: parameter
    });
    return;
  };
  /**
   * 关闭目标标签页，并返回到上一页（一般用于当前页面）
   *
   * @param {string} routeName - 目标路由地址 "/base_data/factory_gather_list"
   */
  const closeTagsByPathNoJump = currentPath => {
    // 删除tag方法
    useMultiTagsStoreHook().handleTags("splice", currentPath);
  };
  /**
   * 关闭目标标签页，并返回到上一页（一般用于当前页面）
   *
   * @param {string} routeName - 目标路由地址 "/base_data/factory_gather_list"
   */
  const closeTagsByPath = currentPath => {
    // 删除tag方法
    useMultiTagsStoreHook().handleTags("splice", currentPath);
    // 跳转回上一页方法
    router.push({
      path: multiTags.value[(multiTags as any).value.length - 1].path
    });
  };
  /**
   * 跳转至持续标签 - 使用query传参的方式跳转 - 不关闭原标签
   *
   * @param {string} routeName - 目标路由名称
   * @param {object} parameter - query参数
   */
  const addPageByAudit = (routeTitle, parameter) => {
    const routeInstance = routes.find(item => item.name == "auditView");
    const auditRoute = {
      ...routeInstance,
      name: `auditView${routeTitle}`,
      path: `/auditView${routeTitle}`,
      meta: {
        ...routeInstance.meta,
        title: routeTitle
      }
    };

    if (routes.filter(item => item.name == auditRoute.name).length > 0) {
      const multiTagsData = multiTags.value as any;
      if (multiTagsData.map(i => i.name).includes(auditRoute.name)) {
        const path = multiTagsData.find(i => i.name == auditRoute.name).path;
        useMultiTagsStoreHook().handleTags("splice", path);
      }
    } else {
      router.addRoute("auditPageList", auditRoute);
    }
    useMultiTagsStoreHook().handleTags("push", {
      path: auditRoute.path,
      name: auditRoute.name,
      query: parameter,
      meta: {
        ...auditRoute.meta,
        title: routeTitle
      }
    });
    router.push({
      name: auditRoute.name,
      query: parameter
    });
  };

  const addIframePage = (routeTitle, parameter) => {
    console.log(routeTitle, parameter);
    const routeInstance = routes.find(item => item.name == "iframeView");
    const iframeRoute = {
      ...routeInstance,
      name: `iframeView${routeTitle}`,
      path: `/iframeView${routeTitle}`,
      meta: {
        ...routeInstance.meta,
        title: routeTitle
      }
    };

    if (routes.filter(item => item.name == iframeRoute.name).length > 0) {
      const multiTagsData = multiTags.value as any;
      if (multiTagsData.map(i => i.name).includes(iframeRoute.name)) {
        const path = multiTagsData.find(i => i.name == iframeRoute.name).path;
        useMultiTagsStoreHook().handleTags("splice", path);
      }
    } else {
      router.addRoute("iframePageList", iframeRoute);
    }
    useMultiTagsStoreHook().handleTags("push", {
      path: iframeRoute.path,
      name: iframeRoute.name,
      query: parameter,
      meta: {
        ...iframeRoute.meta,
        title: routeTitle
      }
    });
    router.push({
      name: iframeRoute.name,
      query: parameter
    });
  };

  /** 刷新当前路由 */
  const onFreshRoute = () => {
    const { fullPath, query } = unref(route);
    router.replace({
      path: "/redirect" + fullPath,
      query
    });
    handleAliveRoute(route as ToRouteType, "refresh");
  };

  return {
    route,
    router,
    routes,
    multiTags,
    addPageByQuery,
    addIframePage,
    addPageByAudit,
    closeTagsByPath,
    closeTagsByPathNoJump,
    onFreshRoute
  };
}

export function getUrlParam(sUrl, sKey) {
  let result = {};
  const sParam = {};
  sUrl.replace(/(\?|&)(\w+)=(\w+)/g, function (k0, k3, k1, k2) {
    sParam[k1] === void 0 ? (sParam[k1] = k2) : (sParam[k1] = [].concat(sParam[k1], k2));
  });
  sKey === void 0 || sKey === "" ? (result = sParam) : (result = sParam[sKey] || "");

  return result;
}
