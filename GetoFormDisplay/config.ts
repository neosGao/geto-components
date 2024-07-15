import { FormItemType, Options } from "@/geto-components/GetoMspPage/components/MspForm/types";
import { buildUUID, getCurrentDate } from "@pureadmin/utils";

// 字段类型
export enum FieldType {
  input = 1,
  select = 2,
  inputNumber = 3,
  date = 4,
  daterange = 5,
  textarea = 6,
  radio = 7,
  checkbox = 8,
  custom = 9
}

export type FieldTypeKey = keyof typeof FieldType;

// 字段状态
export enum FieldStatus {
  normal = 0,
  required = 1,
  disabled = 2
}

export interface DisplayConfig {
  moduleKey: string;
  moduleName: string;
  moduleId: number;
  form: DisplayFormConfig;
  table: {
    columns: FormItemOptions[];
    data: any[];
    config: any;
  };
  is_sum: number;
  sum_fields: string[];
  sort?: number;
  after?: boolean;
  before?: boolean;
  customSlotTable?: boolean;
  customSlotForm?: boolean;
  showModule?: boolean;
}

export interface FieldInfo {
  field_id: number;
  field_name: string;
  field_type: number;
  field_type_name: string;
  placeholder: string;
  option_value: Options[];
  default_value: any;
  display_switch: number;
  required_when_save: number; // 保存时是否必填
  field_option_relations: FieldOptionRelations[]; //选项显隐条件
  field_show_relations: OptionsFieldInfo[]; //字段显隐条件
  option_interactive_mode: number; // 选项交互方式
  table_field: string; // 英文键名
  custom_disable?: boolean; // 自定义设置禁用
}

export interface FieldOptionRelations {
  relations: OptionsFieldInfo[];
  is_show: number;
  select_option: string;
}
export interface FormItemOptions extends FormItemType {
  id?: number;
  remote_data?: object;
  display_switch?: number;
  field_show_relations?: OptionsFieldInfo[];
  field_option_relations?: FieldOptionRelations[];
}

export interface OptionsFieldInfo extends FieldInfo {
  id: number;
  module_id: number;
  choose_value_type: number;
  choose_value: string[] | number[];
  connection_relation: string;
  left_parenthesis: string;
  right_parenthesis: string;
  char_max_length: number;
  max_decimal_place: number;
  is_remote: number;
  can_fuzzy_search: number;
  status: number;
  type: "form_fields" | "table_fields";
  remote_data?: object;
  custom_disable?: boolean; // 自定义设置禁用
}

export interface DisplayFormConfig {
  options: FormItemOptions[];
  data: {
    [key: string]: any;
  };
}

// 数组格式化
export function ArrayObjectFormat<T, R extends object>(data: T[], fn?: (item: T) => R): (T & R)[] {
  return data.map(item => ({ ...item, ...fn?.(item) }));
}

/**
 * @description 格式化默认值
 * @param type
 * @param value
 * @param mode 选项交互方式1单选 2多选
 */
export function formatDefaultValue(
  type: number,
  value?: any,
  mode?: 1 | 2
): any[] | string | number {
  const isValueEmpty = value === null || value === undefined;
  // 是否为多选框
  const isSelectMultiple = type === FieldType.select && mode === 2;

  if (isSelectMultiple || type === FieldType.checkbox) {
    return isValueEmpty ? [] : value.split(",");
  }

  if (type === FieldType.inputNumber) {
    return isValueEmpty ? null : Number(value);
  }

  return isValueEmpty ? "" : value;
}

export function formatDefaultValueDetails(
  type: number,
  value?: any,
  mode?: 1 | 2
): any[] | string | number {
  const isValueEmpty = value === null || value === undefined;
  // 是否为多选框
  const isSelectMultiple = type === FieldType.select && mode === 2;

  if (isSelectMultiple || type === FieldType.checkbox) {
    return isValueEmpty ? [] : value.split(",");
  }

  if (type === FieldType.inputNumber) {
    return isValueEmpty ? 0 : Number(value);
  }

  if (type === FieldType.date) {
    return value === 0 ? getCurrentDate({ type: 2 }).ymd : value ?? "";
  }

  if (type === FieldType.daterange) {
    return Number(value) === 0
      ? [getCurrentDate({ type: 2 }).ymd, getCurrentDate({ type: 2 }).ymd]
      : value
      ? value.split(",")
      : [];
  }

  return isValueEmpty ? "" : value;
}

export function submitFormatDefaultValue(
  value: any,
  type: number | string,
  mode?: 1 | 2
): string | null {
  const isSelectMultiple = type === FieldType.select && mode === 2;
  const isCheckbox = type === FieldType.checkbox;
  const isDateRange = type === FieldType.daterange;

  if (isSelectMultiple || isCheckbox) {
    return value.length === 0 ? null : value.join(",");
  }
  if (isDateRange) {
    if (value == 0) {
      return value;
    }
    return value === null ? null : value.join(",");
  }
  return value === "" ? null : value;
}

const triggerType = (type: number) =>
  [FieldType.input, FieldType.inputNumber, FieldType.textarea].includes(type) ? "blur" : "change";

// 预览表单数据格式
export function displayFormOptions(data: OptionsFieldInfo[]): DisplayFormConfig | null {
  if (data.length === 0) return null;

  const options = [];
  const formData = {};

  for (const item of data) {
    if (item.field_id === null) {
      continue;
    }

    const rules = [];
    const isRequired = item.required_when_save === 1 || item.status === FieldStatus.required;
    rules.push({
      required: isRequired,
      message: item.placeholder || `${item.field_name}必填`,
      trigger: triggerType(item.field_type)
    });

    const selectOptions = [];
    if (item.option_value && Array.isArray(item.option_value)) {
      item.option_value.forEach(e => {
        selectOptions.push({
          value: e.value,
          label: e.label,
          show: getOptionShow(e.label, item.field_option_relations)
        });
      });
    }

    // 兼容key 使用英文键名
    const key = item.table_field || item.field_name;
    const id = item.table_field || item.field_id;

    const show = !!item.display_switch;
    // custom_disable为自定义禁用扩展设置
    const disabled = item.status === FieldStatus.disabled || item.custom_disable;

    options.push({
      id,
      key,
      show,
      type: FieldType[item.field_type],
      prop: item.table_field,
      label: item.field_name,
      value: item.default_value,
      placeholder: item.placeholder,
      display_switch: item.display_switch,
      field_option_relations: item.field_option_relations,
      field_show_relations: item.field_show_relations,
      is_remote: item.is_remote,
      remote_data: item.remote_data,
      attrs: handleAttrs(item),
      options: selectOptions,
      required: item.status === FieldStatus.required,
      disabled: disabled,
      rules
    });
    formData[key] = item.default_value;
  }
  return {
    options,
    data: formData
  };
}

function handleAttrs(item: OptionsFieldInfo) {
  let attrs = {};
  switch (item.field_type) {
    case FieldType.input:
      attrs = {
        maxlength: item.char_max_length
      };
      break;
    case FieldType.inputNumber:
      attrs = {
        controls: false,
        precision: item.max_decimal_place
      };
      break;
    case FieldType.select:
      attrs = {
        multiple: item.option_interactive_mode === 2,
        filterable: item.can_fuzzy_search === 1 || item.is_remote === 1,
        remote: item.is_remote === 1
      };
      break;
    case FieldType.date:
      attrs = {
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD"
      };
      break;
    case FieldType.daterange:
      attrs = {
        type: "daterange",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD"
      };
      break;
    case FieldType.textarea:
      attrs = {
        maxlength: item.char_max_length
      };
      break;
  }
  return {
    clearable: true,
    style: {
      width: "100%"
    },
    ...attrs
  };
}

const actionColumn: FormItemOptions = {
  label: "操作",
  key: "action",
  type: "action",
  width: 120
};

// 预览表格数据格式
export function displayTableOptions(data: OptionsFieldInfo[], extensionFields?: extensionFields) {
  if (data.length === 0) return null;

  const { options } = displayFormOptions(data);

  if (extensionFields.action) {
    options.push(actionColumn);
  }
  return {
    columns: options,
    data: [],
    config: {
      tableExtensionFields: extensionFields.tableExtensionFields ?? {}
    }
  };
}

function getOptionShow(label, relations) {
  if (relations.length) {
    const relation = relations.find(e => e.select_option === label);
    return relation.is_show === 1;
  }
  return true;
}

export interface ModulesInfo {
  [key: string]: {
    module_id: number;
    module_key: string;
    module_name: string;
    form_fields: OptionsFieldInfo[];
    table_fields: OptionsFieldInfo[];
    is_sum: number;
    sum_fields: string[];
    sort?: number;
    before?: boolean;
    after?: boolean;
    customSlotTable?: boolean;
    customSlotForm?: boolean;
    is_show?: boolean;
  };
}

const buildOptionRelations = (item: any) => {
  return item.option_value.reduce((acc: any, option: any) => {
    const relations = item.field_option_relations
      .filter((e: any) => e.select_option === option.label)
      .map((e: any) => ({
        ...e,
        field_module_id: `${e.field_id}(${e.module_id})`
      }));

    acc[option.label] = {
      select_option: option.label,
      is_show: relations.length ? relations[0].is_show : 1,
      relations
    };

    return acc;
  }, {});
};

const detailsFn = (item: any) => {
  // 判断是否已经处理过，处理过的数据会有field_idOptions
  if (item.field_idOptions) return item;

  const optionRelations =
    Array.isArray(item.option_value) && item.option_value.length ? buildOptionRelations(item) : {};

  return {
    id: buildUUID(),
    field_idOptions: [{ value: item.field_id, label: item.field_name }],
    option_interactive_mode: item.option_interactive_mode,
    default_value: formatDefaultValueDetails(
      item.field_type,
      item.module_default_value || item.field_default_value,
      item.option_interactive_mode
    ),
    field_show_relations: item.field_show_relations?.map((e: any) => ({
      ...e,
      field_module_id: `${e.field_id}(${e.module_id})`
    })),
    field_option_relations: Object.values(optionRelations)
  };
};

const fieldsFn = data => ArrayObjectFormat(data, detailsFn);

// 详情接口modules数据处理
export function resultModules(data): ModulesInfo {
  const result = {};
  for (const item of data) {
    result[item.module_name] = {
      module_key: item.module_key,
      module_name: item.module_name,
      module_id: item.module_id,
      form_fields: fieldsFn(item.form_fields),
      table_fields: fieldsFn(item.table_fields),
      is_sum: item.is_sum === undefined ? 0 : item.is_sum,
      sum_fields: item.sum_fields === "" ? [] : item.sum_fields.split(","),
      sort: item.sort,
      is_show: item.is_show ?? true
    };
  }
  return result;
}

export interface extensionFields {
  action: boolean;
  tableExtensionFields: {
    [key: string]: any;
  };
  // formExtensionFields: {
  //   [key: string]: any;
  // };
}

export function resultDisplayData(data: any, extensionFields: extensionFields): DisplayConfig[] {
  const result = [];
  for (const item of data) {
    const form = fieldsFn(item.form_fields);
    const table = fieldsFn(item.table_fields);
    result.push({
      moduleKey: item.module_key,
      moduleName: item.module_name,
      moduleId: item.module_id,
      form: displayFormOptions(form),
      table: displayTableOptions(table, extensionFields),
      is_sum: item.is_sum,
      sum_fields: item.sum_fields,
      sort: item.sort,
      after: item.after || false,
      before: item.before || false,
      customSlotTable: item.customSlotTable || false,
      customSlotForm: item.customSlotForm || false,
      showModule: item.is_show ?? true
    });
  }

  return result;
}
