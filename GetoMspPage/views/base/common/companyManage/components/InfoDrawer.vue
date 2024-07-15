<template>
  <div v-loading="loading">
    <el-drawer v-model="drawer" size="80%">
      <template #header>
        <h4>{{ title }}</h4>
      </template>
      <template #default>
        <el-form :model="form" label-width="140px" inline>
          <el-form-item label="公司名称" required>
            <el-input
              v-model="form.name"
              maxlength="255"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="公司编码" required>
            <el-input
              v-model="form.code"
              maxlength="50"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="公司简称" required>
            <el-input
              v-model="form.short_name"
              maxlength="50"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="公司代码简称">
            <el-input
              v-model="form.short_code"
              maxlength="50"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="纳税人编码" required>
            <el-input
              v-model="form.taxpayer_number"
              maxlength="50"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="注册地址" required>
            <el-input
              v-model="form.registered_address"
              maxlength="255"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="电话号码" required>
            <el-input
              v-model="form.phone_number"
              maxlength="50"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="统一社会信用号码" required>
            <el-input
              v-model="form.unified_social_credit_code"
              maxlength="50"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="星瀚组织编码">
            <el-input
              v-model="form.xh_organization_code"
              maxlength="50"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="关联行政组织" required>
            <el-input
              v-model="form.organization_name"
              maxlength="50"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              type="textarea"
              maxlength="255"
              placeholder="请输入"
              show-word-limit
              disabled
            />
          </el-form-item>
        </el-form>
        <el-table :data="form.accounts" style="width: 100%" border>
          <el-table-column label="序号" width="55" align="center">
            <template #default="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开户银行"
            width="280"
            align="center"
            prop="bank_name"
          />
          <el-table-column
            label="银行账号"
            width="180"
            align="center"
            prop="account"
          />
          <el-table-column
            label="账户名称"
            width="180"
            align="center"
            prop="account_name"
          />
          <el-table-column
            label="账户简称"
            width="180"
            align="center"
            prop="account_short_name"
          />
          <el-table-column
            label="开户时间"
            width="150"
            align="center"
            prop="account_opening_time"
          />
          <el-table-column
            label="账户类型"
            width="160"
            align="center"
            prop="account_type"
          />
          <el-table-column
            label="账户性质"
            width="130"
            align="center"
            prop="account_nature"
          />
          <el-table-column
            label="币别"
            width="130"
            align="center"
            prop="currency_name"
          />
          <el-table-column
            label="账户用途"
            width="130"
            align="center"
            prop="account_use_to"
          />
        </el-table>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick"> 取消 </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { info } from "../api";

const form: any = ref({
  company_id: 0,
  accounts: []
});
const loading = ref(false);
const loadData = async () => {
  loading.value = true;
  await info({
    id: form.value.company_id
  }).then((res: any) => {
    form.value = res.data;
  });
  loading.value = false;
};

const cancelClick = () => {
  drawer.value = false;
};

const drawer = ref(false);
const title = ref("开户信息维护");
const show = async (id = 0) => {
  if (id > 0) {
    form.value.company_id = id;
  }
  loadData();
  drawer.value = true;
};

defineExpose({
  show
});
</script>
<style scoped>
.table-btn {
  width: 100%;
  border-radius: 0px;
  margin-top: -1px;
}
</style>
