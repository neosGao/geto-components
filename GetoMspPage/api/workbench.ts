/*
 * @Author: 邱永健 qyj@geto.com.cn
 * @Date: 2024-06-27 17:00:56
 * @LastEditors: 邱永健 qyj@geto.com.cn
 * @LastEditTime: 2024-06-27 17:24:28
 * @FilePath: \approval-process-service-web\src\geto-components\GetoMspPage\api\workbench.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getPageConf = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/workbench/page-conf", {
    params: data
  });
};

export const getIframeHost = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/uc/system/web-host", {
    params: data
  });
};

export const save = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/workbench/save", {
    data
  });
};

export const getComponentData = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/workbench/component-data",
    {
      params: data
    }
  );
};

export const approvalflowHost = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/approvalflow/host", {
    params: data
  });
};

export const getAuditUrl = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/approvalflow/approval-todo/access-url",
    {
      params: data
    }
  );
};

export const getComponentConfig = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/workbench/component-config",
    {
      params: data
    }
  );
};

export const getAnnouncementList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/announcement/workbench/list",
    {
      params: data
    }
  );
};

export const announcementRead = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/announcement/workbench/read",
    {
      data
    }
  );
};

export const getMoreUrl = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/approvalflow/host", {
    params: data
  });
};
