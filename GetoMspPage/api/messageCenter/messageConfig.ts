import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

// 新增消息配置
export const create = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/message/config/create", {
    data: data
  });
};

// 编辑消息配置
export const edit = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/message/config/edit", {
    data: data
  });
};

// 删除消息配置
export const del = (data?: object) => {
  return http.request<Result>(
    "delete",
    "/api/msp-helper/message/config/delete",
    {
      data: data
    }
  );
};
// 埋点 详情
export const info = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/message/config/info", {
    params: data
  });
};

// 设置状态
export const setStatus = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/config/set-status",
    {
      data: data
    }
  );
};

// 条件字段的枚举值
export const getEnumValues = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/config/enum-values",
    {
      params: data
    }
  );
};

// 条件字段列表
export const getEnumList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/config/enum-list",
    {
      params: data
    }
  );
};

// 获取埋点下拉配置
export const getTrackingPointList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/config/tracking-point-list",
    {
      params: data
    }
  );
};

// 所属模块 配置
export const menuTree = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/menu/tree", {
    params: data
  });
};

// 获取用户下拉配置
export const getUserList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/config/user-list",
    {
      params: data
    }
  );
};

// 获取下拉配置
export const getSelectOptions = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/config/select-options",
    {
      params: data
    }
  );
};

// 列表配置
export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/config/list-page-conf",
    {
      params: data
    }
  );
};

export const list = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/message/config/list", {
    data: data
  });
};

// 用户列表
export const UserList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/user/cross-app/user-list",
    {
      params: data
    }
  );
};

// 行政组织树
export const AdminOrgTree = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/user/cross-app/admin-org-tree",
    {
      params: data
    }
  );
};

// 角色列表
export const roleList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/user/cross-app/role-list",
    {
      params: data
    }
  );
};

// 岗位列表
export const positionList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/user/cross-app/position-list",
    {
      params: data
    }
  );
};

// 行政组织列表
export const adminOrgList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/user/cross-app/admin-org-list",
    {
      params: data
    }
  );
};

// 行政组织树
export const adminOrgTree = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/user/cross-app/admin-org-tree",
    {
      params: data
    }
  );
};

// 业务组织列表
export const businessOrgList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/user/cross-app/business-org-list",
    {
      params: data
    }
  );
};

// 业务组织树
export const businessOrgTree = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/user/cross-app/business-org-tree",
    {
      params: data
    }
  );
};
