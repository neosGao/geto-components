import { http } from "@/utils/http";
import { useRouter } from "vue-router";
type Result = {
  success: boolean;
  data: Array<any>;
};
export const getListPageConf = (data?: object) => {
  const md = useRouter().currentRoute.value.path.split("/").pop();
  return http.request<Result>(
    "get",
    "/api/msp-helper/businessmasterdata/esm/" + md + "/list-page-conf",
    {
      params: data
    }
  );
};
export const getList = (data?: object) => {
  const md = useRouter().currentRoute.value.path.split("/").pop();
  return http.request<Result>(
    "post",
    "/api/msp-helper/businessmasterdata/esm/" + md + "/list",
    {
      data
    }
  );
};
export const exportList = (data?: any) => {
  const md = data.path;
  return http.request<Result>(
    "post",
    "/api/msp-helper/businessmasterdata/esm/" + md + "/export",
    {
      data
    }
  );
};
export const sync = (data?: any) => {
  const md = data.path;
  return http.request<Result>(
    "post",
    "/api/msp-helper/businessmasterdata/esm/" + md + "/sync",
    {
      data
    }
  );
};
export const getMdConf = (data?: any) => {
  const md = data.path;
  return http.request<Result>(
    "get",
    "/api/msp-helper/businessmasterdata/esm/" + md + "/md-conf",
    {
      params: data
    }
  );
};
