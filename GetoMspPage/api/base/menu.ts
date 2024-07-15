import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getModuleMenu = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/permission/menu-manage/module-menu",
    { params: data }
  );
};
