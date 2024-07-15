import { PropType } from "vue";
export interface Column {
  prop: string;
  label: string;
  width?: string;
  type?: string;
}

export const BaseTableProps = {
  data: {
    type: Array as PropType<Array<Record<string, any>>>,
    required: true
  },
  columns: {
    type: Array as PropType<Column[]>,
    required: true
  },
  showIndex: Boolean,
  selection: Boolean,
  multiple: Boolean,
  pagination: Boolean,
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array as PropType<Array<number>>,
    default: () => [10, 20, 30, 40, 50]
  },
  total: {
    type: Number,
    default: 1
  },
  disabled: Boolean
};
