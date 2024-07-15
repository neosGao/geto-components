import { CSSProperties } from "vue";
import { FormRules } from "element-plus";

export enum FormItemInjectKey {
  remoteMethod = "remoteMethod",
  change = "change",
  blur = "blur"
}

export interface Options {
  value: any;
  label: string;
  show?: boolean;
  [key: string]: any;
}

export type FormTypes =
  | "text"
  | "select"
  | "date"
  | "daterange"
  | "time"
  | "input"
  | "inputNumber"
  | "radio"
  | "checkbox"
  | "textarea"
  | "action"
  | "custom";

export interface FormItemType {
  label: string;
  key: string;
  type: FormTypes;
  prop?: any;
  value?: any;
  rules?: FormRules[];
  width?: number | string;
  align?: "left" | "center" | "right";
  options?: Options[];
  placeholder?: string;
  show?: boolean;
  required?: boolean;
  fixed?: "left" | "right";
  disabled?: boolean;
  attrs?: {
    style?: CSSProperties;
    remote?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    multiple?: boolean;
    maxlength?: number | string;
    minlength?: number | string;
    showWordLimit?: boolean;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    size?: "large" | "default" | "small";
    controls?: boolean;
    controlsPosition?: "" | "right";
    filterable?: boolean;
    loading?: boolean;
  };
}
