<template>
  <div>
    <van-search shape="round" placeholder="请输入搜索关键词" @focus="showSuggest = true" v-model="pendingVal"
      @update:model-value="inputFn" :show-action="showSuggest" @cancel="showSuggest = false" @search="search" />
    <div class="top">
      <!-- 搜索建议 -->
      <div class="search_suggest" v-show="showSuggest">
        <div class="sugitem" v-for="(obj, index) in SuggestVal" @click="clickItem(obj.keyword)" :key="index">
          <span class="iconfont icon-sousuo"></span>
          <div>{{ obj.keyword }}</div>
        </div>
      </div>
      <!-- 热搜关键词容器 -->
      <div class="hot_name_wrap" v-show="!value">
        <span class="hot_item" v-for="(obj, index) in hotArr" @click="clickItem(obj.first)" :key="index">{{ obj.first
        }}</span>
      </div>
    </div>
    <!-- 搜索结果 -->
    <router-view v-slot="{ Component }" v-show="value">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
  </div>
</template>
<script setup>
import { hotSearchAPI } from "@/api";
import { getSearchSuggest } from '@/utils/getData'
import { usePlayId } from '@/store'
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const SuggestVal = ref([])  //存放搜索建议
const value = ref('')  //最终的搜索内容
const pendingVal = ref('') //存放暂时输入的内容（显示搜索建议）
const hotArr = ref([])
const showSuggest = ref(false)
const timer = ref(null)
const store = usePlayId()
const router = useRouter()

onMounted(async () => {
  const res = await hotSearchAPI();
  hotArr.value = res.data.result.hots;
});

const inputFn = (inputVal) => {
  // 防抖策略
  if (timer.value) clearTimeout(timer.value);
  timer.value = setTimeout(async () => {
    if (inputVal.length === 0) {
      SuggestVal.value = []
      return;
    }
    let res = await getSearchSuggest(inputVal)
    SuggestVal.value = res.data.result.allMatch
  }, 400);
};

const clickItem = (val) => {
  // 点击关键词
  pendingVal.value = val
  showSuggest.value = false
  value.value = val; // 选中的关键词显示到搜索框
  router.push({
    path: '/layout/search/searchlist'
  })
  store.searchVal = value.value
};

const search = () => {
  showSuggest.value = false
  value.value = pendingVal.value
  if (!value.value) {  //如果用户没有输入就回车
    store.searchVal = value.value
    router.back()
    return
  }
  router.push({
    path: '/layout/search/searchlist'
  })
  store.searchVal = value.value
};

//如果输入框为空，就显示热搜
watch(() => store.searchVal, (newv) => {
  if (!newv) {
    pendingVal.value = ''
    value.value = ''
  }
})
</script>

<style lang="scss" scoped>
/* 搜索容器的样式 */

.search_suggest {
  position: absolute;
  background-color: white;
  width: 100%;
  z-index: 30;

  .sugitem {
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 15px;
    border-bottom: 1px solid lightgray;
  }

  span {
    padding-right: 10px;
  }
}

/* 热搜词_容器 */
.hot_name_wrap {
  margin: 0.266667rem 0;
  padding: 15px;
}

/* 热搜词_样式 */
.hot_item {
  display: inline-block;
  height: 0.853333rem;
  margin-right: 0.213333rem;
  margin-bottom: 0.213333rem;
  padding: 0 0.373333rem;
  font-size: 0.373333rem;
  line-height: 0.853333rem;
  color: #333;
  border-color: #d3d4da;
  border-radius: 0.853333rem;
  border: 1px solid #d3d4da;
}

/* 给单元格设置底部边框 */
.van-cell {
  border-bottom: 1px solid lightgray;
}
</style>
