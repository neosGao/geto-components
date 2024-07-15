import {http} from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};
// 岗位
export const getListPageConf = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/position/list-page-conf", {
    params: data
  })
}
// 组织
export const getOrgListPageConf = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/organization-business/list-page-conf", {
    params: data
  })
}

export const getList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/position/list", {
    data
  });
};

export const getInfo = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/position/info", {
    params: data
  });
};

export const store = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/position/store", {
    data
  });
};

export const edit = (data?: object) => {
  return http.request<Result>("put", "/api/msp-helper/user/position/edit", {
    data
  });
};

export const remove = (data?: object) => {
  return http.request<Result>("delete", "/api/msp-helper/user/position/remove", {
    data
  });
};

export const enable = (data?: object) => {
  return http.request<Result>("put", "/api/msp-helper/user/position/enable", {
    data
  });
};

export const disable = (data?: object) => {
  return http.request<Result>("put", "/api/msp-helper/user/position/disable", {
    data
  });
};
// 绑定用户
export const bindUser = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/position/bind-user", {
    data
  });
};
// 取消绑定用户
export const unbindUser = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/position/unbind-user", {
    data
  });
};

export const importList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/position/import", {
    data
  });
};

export const exportList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/position/export", {
    data
  });
};

export const getBindUser = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/position/get-bind-user", {
    params: data
  });
};

export const getUser = (data?: object) => {
  return http.request<Result>("get", "api/msp-helper/user/position/get-user", {
    params: data
  });
};






