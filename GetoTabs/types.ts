import type { PropType } from "vue";
export interface searchConfig {
  label?: string;
  value?: string;
}
interface conditionsList {
  default_operator?: string;
  is_default?: Boolean;
  is_remote?: Boolean;
  label?: string;
  query?: string;
  query_type?: string;
  type?: string;
  value?: string;
}

interface interfaceConfig {
  border_left?: Array<searchConfig>;
  border_right?: Array<searchConfig>;
  conditions?: Array<conditionsList>;
  joint?: Array<searchConfig>;
  label_width?: Number;
}

interface confList {
  list_columns?: Array<confListColumns>;
  search?: PropType<interfaceConfig>;
}

interface confListColumns {
  display?: Boolean;
  is_format_to_thousands?: Boolean;
  use_slot?: Boolean;
  link?: Boolean;
  fixed?: string;
  label?: string;
  value?: string;
  width?: string;
  sort?: number;
}

export type tabsType = {
  name?: string;
  icon?: string;
  list_key?: string;
  conf?: confType;
  is_default?: Boolean;
};

export type confType = {
  page_key?: string;
  name?: string;
  list_key?: string;
  is_default?: Boolean;
  id?: Number;
  icon?: string;
  conf?: confList;
  is_global_view?: Boolean;
};
