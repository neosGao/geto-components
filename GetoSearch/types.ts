interface valueKeys {
  value?: String;
  label?: String;
}

interface conditionsList {
  default_operator?: String;
  is_default?: Boolean;
  is_remote?: Boolean;
  label?: String;
  query?: String;
  query_type?: String;
  type?: String;
  value?: String;
}

export interface interfaceConfig {
  border_left?: Array<valueKeys>;
  border_right?: Array<valueKeys>;
  conditions?: Array<conditionsList>;
  joint?: Array<valueKeys>;
  label_width?: Number;
  value?: Array<any>;
}
