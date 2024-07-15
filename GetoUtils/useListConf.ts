import { reactive, toRefs } from "vue";
import { http } from "@/utils/http";

interface Options {
  immediate: boolean;
}

function getConf(api: string, params?: object): Promise<{ data: any; code: string }> {
  return http.request("get", api, { params });
}

export function useConfig(api: string, options: Options) {
  const conf = reactive({
    view_conf: [],
    table_conf: [],
    page_conf: {},
    tabName: ""
  });

  const getPageConf = async (params?: object) => {
    const { code, data } = await getConf(api, params);
    if (code === "0") {
      conf.view_conf = data.page_conf.view_conf;

      let defaultView: any = {};

      defaultView = conf.view_conf.find(item => item.is_default);
      conf.tabName = defaultView.name;

      conf.table_conf = defaultView?.conf.list_columns;
    }
  };

  options.immediate && getPageConf();

  return { ...toRefs(conf), getPageConf };
}
