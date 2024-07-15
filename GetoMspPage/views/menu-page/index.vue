<template>
  <div class="body-container">
    <div class="wall-container">
      <div class="wall-item" v-for="(item, index) in modules" :key="index">
        <div class="filter" v-if="index == 0">
          <el-input v-model="query" placeholder="搜索菜单" @change="loadMenuTreeData" clearable />
        </div>
        <div class="wall-item-name">
          {{ item["label"] }}
        </div>
        <div class="form-container">
          <el-row :gutter="12">
            <el-col :span="6" v-for="(child, i) in item['children']" :key="i" class="mt-2">
              <el-card shadow="hover" :body-style="{ padding: '10px' }" class="menu-item">
                <div class="card-body-j">
                  <div class="menu-name" @click="jump(child)">
                    <span>
                      {{ child["label"] }}
                    </span>
                  </div>
                  <div class="menu-btn">
                    <el-badge
                      :value="child['dot']"
                      v-if="child['has_dot'] && child['dot'] > 0"
                      :max="99"
                      class="dot"
                    />
                    <IconifyIconOffline
                      :icon="star"
                      :class="child['is_collect'] ? 'icon_collect' : 'icon'"
                      @click="handleCollect(child)"
                    />
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getModuleMenu, collect, dot } from "@/geto-components/GetoMspPage/api/menu";
import { message } from "@/utils/message";
import star from "@iconify-icons/ep/star-filled";
import { loadUserPermissionKey } from "@/geto-components/GetoUtils/permission";

defineOptions({
  name: "menu_page"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const modules = ref({});
const router = useRouter();
const app_id = router.currentRoute.value.query.app_id;
const sub_menu_key = ref(router.currentRoute.value.query.sub_menu_key);
if (!sub_menu_key.value) {
  sub_menu_key.value = router.currentRoute.value.meta.module;
}
const env = import.meta.env;
const collect_status = ref(false);
const dot_arr = ref([]);
const query = ref("");

// ------------------------------------------------------- 方法 -------------------------------------------------------
/**
 * 加载菜单树
 */
const loadMenuTreeData = async () => {
  const res = await getModuleMenu({
    app_id: app_id,
    sub_menu_key: sub_menu_key.value,
    name: query.value
  });
  modules.value = res.data;
  for (const index in modules.value) {
    const item = modules.value[index];
    for (const i in item["children"]) {
      const child = item["children"][i];
      if (child["has_dot"]) {
        dot_arr.value.push({
          page_key: child["page_key"],
          menu: child
        });
      }
    }
  }
  // 拉取dot 数据
  popDot();
};

const popDot = async () => {
  for (const index in dot_arr.value) {
    getDot(dot_arr.value[index]);
    // 休眠500毫秒，降低并发
    await sleep(500);
  }
};

const getDot = async menu => {
  dot({
    page_key: menu["page_key"]
  }).then(res => {
    menu["menu"]["dot"] = res.data["dot"];
  });
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 菜单跳转
 *
 * @param menu
 */
const jump = menu => {
  // jump 存在值，直接跳转
  if (menu.jump) {
    window.open(menu.jump);
    return;
  }

  const menu_id = Reflect.get(menu, "id");

  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    router.push({
      name: menu_id
    });
    return;
  }

  // ms架构的跳转
  const routes = router.getRoutes();
  const route = routes.find(item => item.name == menu_id);
  const host = env.VITE_PUBLIC_PATH + "#";
  const title = route.meta.title;
  const url = host + route.path + "?title=" + title;
  const params = [
    {
      name: title,
      path: url,
      url: url
    }
  ];
  window.parent.postMessage({ flag: "tab", data: params }, "*"); //解决跨域
  window.parent.postMessage({ flag: "loading", data: { loading: false } }, "*");
};

const handleCollect = menu => {
  if (collect_status.value) {
    return;
  }
  // 防抖
  collect_status.value = true;
  collect({
    pid: menu.p_id,
    key: menu.id,
    label: menu.label
  })
    .then(res => {
      if (res["code"] != 0) {
        message("收藏失败", { type: "error" });
        return;
      }

      message(res.data["msg"], { type: "success" });
      menu.is_collect = !menu.is_collect;
    })
    .finally(() => {
      collect_status.value = false;
    });
};

// ------------------------------------------------------- 事件 -------------------------------------------------------
/**
 * 挂载
 */
onMounted(() => {
  loadUserPermissionKey();
  loadMenuTreeData();
});
</script>

<style scoped>
.menu-item {
  width: 100%;
}

.menu-item:hover {
  cursor: pointer;
}

.card-body-j {
  width: 100%;
  height: 100%;

  .menu-name {
    float: left;
    width: 80%;
    height: 100%;
    margin-bottom: 10px;
    margin-left: 5px;
  }

  .menu-btn {
    height: 100%;
    float: right;

    .dot {
      margin-top: 4px;
      margin-right: 10px;
    }

    .icon {
      font-size: 22px;
      margin-top: 4px;
      float: right;
      color: #909399;
    }

    .icon_collect {
      font-size: 22px;
      margin-top: 4px;
      float: right;
      color: orange;
    }
  }
}

.body-container {
  padding: 0 15px;
  overflow-y: auto;
  background-color: #fff;
  height: 100%;
}

.wall-container {
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  flex-wrap: wrap;
  -webkit-box-pack: start;
  justify-content: flex-start;
  -webkit-box-align: start;
  align-items: flex-start;
  align-content: flex-start;
}

.wall-item {
  -webkit-box-flex: 0;
  flex: 0 0 auto;
  width: 100%;
  min-height: 140px;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.wall-item-name {
  line-height: 45px;
  font-size: 18px;
  margin-top: 20px;
  user-select: none;
  text-align: left;
}

.form-container {
  text-align: left;
  font-size: 15px;
  line-height: 35px;
}

.filter {
  float: right;
  margin-top: 25px;
  width: 30%;
}
</style>
