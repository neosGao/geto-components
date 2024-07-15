import { ref, reactive, onMounted } from "vue";

interface Options {
  immediate: boolean;
  listKey?: string;
}

export const useTable = (fn, options: Options = { immediate: false }) => {
  const loading = ref(false);

  const tableData = ref([]);

  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 30, 40, 50]
  });

  const tableParams = ref({});

  const getTableData = async (params = {}) => {
    try {
      tableParams.value = params;

      loading.value = true;
      const { code, data } = await fn({
        ...params,
        page: pagination.currentPage,
        limit: pagination.pageSize
      });
      if (code === "0") {
        tableData.value = data[options.listKey ?? "data"];
        pagination.total = data.total;
      }
    } finally {
      loading.value = false;
    }
  };

  const pageChange = ({ currentPage, pageSize }) => {
    pagination.currentPage = currentPage;
    pagination.pageSize = pageSize;
    getTableData(tableParams.value);
  };
  onMounted(() => {
    options.immediate && getTableData();
  });

  return {
    loading,
    data: tableData,
    pagination,
    getTableData,
    pageChange
  };
};
