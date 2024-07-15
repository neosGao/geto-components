<template>
  <div :class="'card-' + type">
    <el-card shadow="never">
      <slot name="body" />
    </el-card>
  </div>
</template>

<script>
export default {
  props: ["type"]
};
</script>

<style lang="scss" scoped>
.card-search {
  :deep(.el-card .el-card__body) {
    padding: 5px 10px;
  }
}

.card-table {
  :deep(.el-card .el-card__body) {
    // padding: 10px 0px 0px 0px;
    padding: 0px;
  }

  :deep(.el-table) td,
  .el-table th {
    padding: 2px 0px;
  }

  :deep(.cell) {
    padding-left: 0px;
    padding-right: 0px;
  }

  :deep(.table-header:first-child .cell .el-checkbox) {
    padding-left: 10px;
  }

  :deep(.el-table__cell:first-child .cell) {
    padding-left: 0px;
  }
}

.card-profile {
  :deep(.el-card .el-card__body) {
    padding: 10px 10px;
  }
}

.card-cost {
  :deep(.el-card .el-card__body) {
    padding: 0px;
  }
}

.card-folder {
  :deep(.el-card .el-card__body) {
    padding: 15px 20px;
  }
}
</style>
