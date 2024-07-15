<template>
  <div class="dark:text-white geto-search-table" v-loading="loading">
    <GetoBackBar
      ref="getoBackBar"
      title="公告详情"
      routeName="system_announcement"
    >
      <template #extra>
        <el-button
          type="primary"
          @click="handleEdit"
          v-auth="'OPERATE_ANNOUNCEMENT_EDIT'"
          v-if="form.status === 1"
          >去编辑</el-button
        >
      </template>
    </GetoBackBar>
    <div class="form">
      <el-form :model="form" label-width="120px">
        <el-form-item label="标题" required>
          <el-input
            v-model="form.title"
            maxlength="100"
            placeholder="请输入标题"
            show-word-limit
            style="width: 500px"
            disabled
          />
        </el-form-item>
        <el-form-item label="有效时间" required>
          <el-col :span="11">
            <el-date-picker
              v-model="form.period_of_validity"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期时间"
              end-placeholder="结束日期时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 500px"
              disabled
            />
          </el-col>
        </el-form-item>
        <el-form-item label="是否强制弹窗">
          <el-switch
            v-model="form.is_alert"
            :active-value="1"
            :inactive-value="0"
            disabled
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <h3>公告内容：</h3>
      <div class="!flex-none">
        <div v-html="form.content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineOptions } from "vue";
import GetoBackBar from "@/geto-components/GetoBackBar/index.vue";
import { info } from "@/geto-components/GetoMspPage/api/announcement-manage";
import { useRouter } from "vue-router";

defineOptions({
  name: "system_announcement_info"
});

const form: any = ref({
  title: ""
});

const getoBackBar = ref(null);
const loading = ref(false);
const loadingData = () => {
  loading.value = true;
  info({
    id: router.currentRoute.value.query.id
  })
    .then(res => {
      form.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

const router = useRouter();
const handleEdit = () => {
  router.push({
    name: "announcement_edit",
    query: {
      id: router.currentRoute.value.query.id
    }
  });
};

onMounted(() => {
  loadingData();
});
</script>

<style lang="scss" scoped>
.form {
  margin-top: 15px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.content {
  margin-top: 15px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}
</style>
