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
      <!-- 搜索历史 -->
      <div v-show="searchHistory.length && !value" style="display: flex;justify-content: space-between;align-items: center;">
        <p style="font-size: 18px;margin: 10px;">历史记录</p>
        <div class="iconfont icon-lajixiang" style="padding: 10px;" @click="delHis"></div>
      </div>
      <div class="searchHis_Container" v-show="searchHistory.length && !value">
        <span class="searchHis_item" v-for="(obj, index) in searchHistory" @click="clickItem(obj)" :key="index">
          {{ obj }}
        </span>
      </div>
      <!-- 热搜关键词 -->
      <p style="font-size: 18px;margin: 10px;" v-show="!value">热搜榜</p>
      <van-list v-show="!value">
        <van-cell v-for="(obj, index) in hotArr" center :label="obj.content" :key="index"
          @click="clickItem(obj.searchWord)">
          <template #icon>
            <div style="margin-right: 15px;font-size: 16px;">
              {{ index + 1 }}
            </div>
          </template>
          <template #title>
            {{ obj.searchWord }}
            <img v-if="obj.iconUrl" :src="obj.iconUrl" style="height: 1em;">
          </template>
          <template #right-icon>
            <p style="color: #b4b4b4;">{{ obj.score }}</p>
          </template>
        </van-cell>
      </van-list>
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
import { showConfirmDialog, showToast } from 'vant';

const SuggestVal = ref([])  //存放搜索建议
const value = ref('')  //最终的搜索内容
const pendingVal = ref('') //存放暂时输入的内容（显示搜索建议）
const hotArr = ref([])
const showSuggest = ref(false)
const timer = ref(null)
const store = usePlayId()
const router = useRouter()
const searchHistory = ref([])

onMounted(async () => {
  searchHistory.value = JSON.parse(localStorage.getItem('searchHistory')) ?? []
  const res = await hotSearchAPI();
  hotArr.value = res.data.data;
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
  toLocalStorage(val)
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
  toLocalStorage(value.value)
};

//本地存储搜索历史方法，val为存储的文本
const toLocalStorage = (val) => {
  let curArr = JSON.parse(localStorage.getItem('searchHistory')) ?? []
  //用来判断元素是否存在，如果存在，则将其放在第数组一位
  let isExistArr = curArr.filter(item => {
    return item !== val
  })
  isExistArr.unshift(val)
  searchHistory.value = isExistArr
  localStorage.setItem("searchHistory", JSON.stringify(isExistArr));
}

const delHis = () => {
  showConfirmDialog({ //确认删除弹窗
    title: '注意',
    message:
      '确定清空全部历史记录？',
    confirmButtonColor: '#f10f0f'
  }).then(async () => {
    searchHistory.value = []
    value.value = ''
    localStorage.setItem("searchHistory", '[]');
    showToast('删除成功')
  }).catch(() => { })
}

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

/* 搜索历史_容器 */
.searchHis_Container {
  margin: 5px 0;
  padding: 10px;
  display: flex;
  overflow-x: scroll;
}

/* 搜索历史_样式 */
.searchHis_item {
  white-space: nowrap;
  background-color: #f2f2f2;
  height: 30px;
  margin-right: 10px;
  margin-bottom: 20px;
  padding: 0 15px;
  font-size: 16px;
  line-height: 30px;
  color: #333;
  border-color: #d3d4da;
  border-radius: 50px;
}

/* 给单元格设置底部边框 */
.van-cell {
  border-bottom: 1px solid lightgray;
}
</style>
