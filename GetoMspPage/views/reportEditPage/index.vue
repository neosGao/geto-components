<template>
  <div class="dark:text-white geto-search-table">
    <div class="flex min-h-full">
      <transition
        name="slideLeft"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <div
          class="bg-white w-[300px] min-h-full p-3 relative mr-5"
          v-show="isClicked"
        >
          <el-button
            type="primary"
            link
            @click="goPage('new')"
            v-auth="'OPERATE_STATEMENT_LIST_CREATE'"
          >
            +新增报表
          </el-button>
          <IconifyIconOffline
            :icon="arrowLeft"
            class="w-[20px] h-[20px] absolute right-3 top-3.5 cursor-pointer"
            @click="isClicked = !isClicked"
          />
          <div class="flex mt-2">
            <el-input
              v-model="sideBar.searchValue"
              placeholder="请输入名称"
              filterable
            />
            <el-button
              type="primary"
              @click="getListData('search')"
              v-auth="'OPERATE_STATEMENT_LIST_SEARCH'"
              >搜索</el-button
            >
          </div>
          <div
            style="overflow: auto; height: calc((100% - 100px))"
            v-loading="sideBar.loading"
          >
            <div
              v-for="(item, index) in sideBar.list"
              :key="index"
              class="side-item min-h-[60px]"
              @click="goPage('show', item.id)"
            >
              <p>{{ item.name }}</p>
              <el-button
                type="text"
                style="margin-left: 10px; color: #f00; float: right"
                @click.stop="goPage('delete', item.id)"
                v-if="item.can_edit && hasAuth('OPERATE_STATEMENT_LIST_DELETE')"
                >删除</el-button
              >
              <el-button
                type="text"
                style="margin-left: 10px; float: right"
                @click.stop="goPage('edit', item.id)"
                v-if="item.can_edit && hasAuth('OPERATE_STATEMENT_LIST_EDIT')"
                >编辑</el-button
              >
            </div>
          </div>
          <div class="block absolute bottom-0">
            <el-pagination
              :current-page="sideBar.currentPage"
              @current-change="page => getListData('page', page)"
              layout="prev, pager, next"
              :total="sideBar.total"
            />
          </div>
        </div>
      </transition>
      <IconifyIconOffline
        :icon="arrowRight"
        class="w-[30px] h-[30px] bg-white shadow absolute left-4 top-4 cursor-pointer"
        @click="isClicked = !isClicked"
        v-if="!isClicked"
      />
      <report-edit
        v-if="['new', 'edit'].includes(page_flag)"
        :id="chart_id"
        :type="page_flag"
        @refashList="getListData"
      />
      <report-show v-if="page_flag === 'show'" :id="chart_id" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import arrowLeft from "@iconify-icons/ep/d-arrow-left";
import arrowRight from "@iconify-icons/ep/d-arrow-right";
import { getSideList, deleteStatement } from "./statementListApi";
import reportEdit from "./components/editPage.vue";
import reportShow from "./components/showPage.vue";
import { message } from "@/utils/message";
import { hasAuth } from "@/router/utils";
defineOptions({
  name: "statement_edit"
});

const page_flag = ref<string>("");
const chart_id = ref<number>();
const isClicked = ref<boolean>(true);
const sideBar = ref({
  currentPage: 1,
  total: 1,
  searchValue: "",
  loading: false,
  list: []
});

const beforeEnter = el => {
  el.style.transform = "translateX(-100%)";
};

const enter = (el, done) => {
  el.offsetHeight; // 强制重绘
  el.style.transition = "transform 0.5s ease-out"; // 调整过渡时间和缓动函数
  el.style.transform = "translateX(0)";
  done();
};

const leave = (el, done) => {
  el.style.transition = "transform 0.5s ease-out"; // 调整过渡时间和缓动函数
  el.style.transform = "translateX(-100%)";
  setTimeout(() => {
    done();
  }, 500); // 延迟1秒后调用 done，确保有足够的时间播放离场动画
};

const getListData = async (type = "search", val = 1) => {
  if (type == "page") sideBar.value.currentPage = val;
  if (type == "search") sideBar.value.currentPage = 1;
  const param = {
    currentPage: sideBar.value.currentPage,
    pageSize: 10,
    name: sideBar.value.searchValue
  };
  sideBar.value.loading = true;
  const res: res = await getSideList(param);
  sideBar.value.loading = false;
  sideBar.value.list = res.data.data;
  sideBar.value.total = res.data.total;
  sideBar.value.currentPage = res.data.current_page;
};

const goPage = async (type: string, id: number | null = null) => {
  if (["show", "edit", "delete"].includes(type) && !id) return;
  if (type === "delete") {
    const res: res = await deleteStatement({ id });
    if (res.code !== "0") return;
    message("删除成功!", { type: "success" });
    getListData();
  } else if (type === "show" && !hasAuth("OPERATE_STATEMENT_LIST_INFO")) {
    message("暂无权限!", { type: "warning" });
  }
  page_flag.value = type;
  chart_id.value = id;
};

onMounted(() => {
  getListData();
});
</script>

<style scoped lang="scss">
.side-item {
  border-radius: 5px;
  border: 1px #ddd solid;
  background: #fff;
  margin: 10px auto;
  width: 96%;
  padding: 0 3%;
  overflow: auto;
  cursor: pointer;
}

.side-item:hover {
  border: 1px #bbb solid;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
</style>
