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
    <div class="search_wrap" v-show="value">
      <van-tabs>
        <van-tab title="单曲">
          <singleSongs :value="value" :type="1"></singleSongs>
        </van-tab>
        <van-tab title="专辑">
          <albumList :value="value" :type="10"></albumList>
        </van-tab>
        <van-tab title="播客">
          <djRadio :value="value" :type="1009"></djRadio>
        </van-tab>
        <van-tab title="歌手">
          <singerList :value="value" :type="100"></singerList>
        </van-tab>
        <van-tab title="歌单">
          <PlaySheetList :value="value" :type="1000"></PlaySheetList>
        </van-tab>
        <van-tab title="用户">
          <UserList :value="value" :type="1002"></UserList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import { hotSearchAPI } from "@/api";
import { getSearchSuggest } from '@/utils/getData'

export default {
  data () {
    return {
      SuggestVal: [],  //存放搜索建议
      value: '',  //最终的搜索内容
      pendingVal: '', //存放暂时输入的内容（显示搜索建议）
      hotArr: [],
      showSuggest: false,
      timer: null
    };
  },
  async created () {
    const res = await hotSearchAPI();
    this.hotArr = res.data.result.hots;
  },
  methods: {
    inputFn (inputVal) {
      // 防抖策略
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        if (inputVal.length === 0) {
          this.SuggestVal = []
          return;
        }
        let res = await getSearchSuggest(inputVal)
        this.SuggestVal = res.data.result.allMatch
      }, 400);
    },
    async clickItem (val) {
      // 点击关键词
      this.pendingVal = val
      this.showSuggest = false
      this.value = val; // 选中的关键词显示到搜索框
    },
    //用户回车确认搜索时
    search () {
      this.showSuggest = false
      this.value = this.pendingVal
    }
  }
}
</script>

<style lang="scss" scoped>
/* 搜索容器的样式 */
.search_wrap {
  padding: 0.266667rem;
}

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
