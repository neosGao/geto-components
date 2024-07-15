import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};
/************************************************ 消息中心 ************************************************/
//  未读消息数据
export const unreadList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/user-message/unread-list",
    { params: data }
  );
};

// 未读消息数量
export const unreadCount = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/user-message/unread-count",
    { params: data }
  );
};

// 获取最新一条 未读消息数量
export const atestUnread = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/user-message/latest-unread",
    { params: data }
  );
};

// 全部标记已读
export const readAll = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/user-message/read-all",
    { data }
  );
};

// 设置 是否推送桌面开关 状态
export const setPushStatus = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/user-message/set-push-status",
    { data }
  );
};

// 获取 是否推送桌面开关 状态
export const getPushStatus = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/user-message/get-push-status",
    { params: data }
  );
};

/************************************************  ************************************************/
