import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/division-code/conf"
  );
};

export const getDateInfo = (params?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/division-code/info",
    {
      params
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/division-code/export",
    {
      data
    }
  );
};

export const enable = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/division-code/enable",
    {
      data
    }
  );
};

export const unable = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/division-code/unable",
    {
      data
    }
  );
};

export const edit = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/division-code/edit",
    {
      data
    }
  );
};
