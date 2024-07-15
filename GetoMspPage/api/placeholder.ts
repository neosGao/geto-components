import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/dictionarymanage/placeholder/list-page-conf",
    {
      params: data
    }
  );
};

export const getList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/dictionarymanage/placeholder/list",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/dictionarymanage/placeholder/export",
    {
      data
    }
  );
};

export const info = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/dictionarymanage/placeholder/info",
    {
      params: data
    }
  );
};

export const deleteData = (data?: object) => {
  return http.request<Result>(
    "delete",
    "/api/msp-helper/dictionarymanage/placeholder/delete",
    {
      data
    }
  );
};

export const store = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/dictionarymanage/placeholder/store",
    {
      data
    }
  );
};

export const edit = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/dictionarymanage/placeholder/edit",
    {
      data
    }
  );
};

export const storeConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/dictionarymanage/placeholder/store-conf",
    {
      params: data
    }
  );
};

export const enableUnable = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/dictionarymanage/placeholder/enable-unable",
    {
      data
    }
  );
};

export const importData = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/dictionarymanage/placeholder/import",
    {
      data
    }
  );
};

export const publish = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/dictionarymanage/placeholder/publish",
    {
      data
    }
  );
};
