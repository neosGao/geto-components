import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export type UserResult = {
  code: string;
  message: string;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    access_token: string;
    /** 用于调用刷新`access_token`的接口时所需的`token` */
    refresh_token: string;
    /** `access_token`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: number;
  };
};

export const getUcLoginUrl = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/uc/login-url", {
    params: data
  });
};

/** UC 登录 */
export const getUcOauthLogin = (data?: object) => {
  return http.request<UserResult>("post", "/api/msp-helper/uc/oauth-login", {
    data
  });
};

/** 登出 */
export const getLogout = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/uc/logout", {
    data
  });
};

/** 登出 */
export const getSystemList = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/uc/system/list", {
    params: data
  });
};
