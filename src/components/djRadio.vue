<template>
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <van-cell v-for="obj in resultList" center :title="obj.name" :label="obj.dj.nickname" :key="obj.id" @click="detail">
      <template #icon>
        <img :src="obj.picUrl" style="width: 15%;padding-right: 10px;">
      </template>
    </van-cell>
  </van-list>
</template>

<script>
import { getSongsData } from "@/utils/getData";
export default {
  props: {
    value: String,
    type: Number
  },
  data () {
    return {
      resultList: [], // 搜索结果
      loading: false, // 加载中 (状态) - 只有为false, 才能触底后自动触发onload方法
      finished: false, // 未加载全部 (如果设置为true, 底部就不会再次执行onload, 代表全部加载完成)
      page: 1, // 当前搜索结果的页码
    }
  },
  methods: {
    // 触底事件
    async onLoad () {
      const res = await getSongsData(this.value, this.type, this.page)
      if (res.data.result?.djRadios === undefined) { // 没有更多数据了
        this.finished = true; // 全部加载完成(list不会在触发onload方法)
        this.loading = false; // 本次加载完成
        return;
      }
      this.resultList = [...this.resultList, ...res.data.result.djRadios];
      this.finished = true; // 全部加载完成(list不会在触发onload方法)
      this.loading = false; // 数据加载完毕-保证下一次还能触发onload
    },
    detail () {
      console.log(1);
    }
  },
  watch: {
    async value () {
      const res = await getSongsData(this.value, 1009, this.page)
      if (res.data.result?.djRadios === undefined) {
        this.resultList = [];
        return;
      }
      this.resultList = res.data.result?.djRadios;
      this.loading = false;
      this.finished = true;
    }
  }
};
</script>

<style scoped>
/* 给单元格设置底部边框 */
.van-cell {
  border-bottom: 1px solid lightgray;
}
</style>
@/utils/getData