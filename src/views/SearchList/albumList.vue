<template>
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <van-cell v-for="obj in resultList" center :title="getName(obj)" @click="toDetail(obj.id)"
      :label="`${obj.artist.name} -- ${formatDate(obj.publishTime)}`" :key="obj.id">
      <template #icon>
        <img v-img-lazy="obj.picUrl" style="width: 15%;padding-right: 10px;">
      </template>
    </van-cell>
  </van-list>
</template>

<script setup>
import { getSongsData } from "@/utils/getData";
import { defineProps, ref, watch } from "vue";
import { formatDate } from '@/utils/formatTime'
import { useRouter } from 'vue-router';
import { usePlayId } from "@/store";

const props = defineProps({
  type: Number
})

const resultList = ref([]) // 搜索结果
const loading = ref(false) // 加载中 (状态) - 只有为false, 才能触底后自动触发onload方法
const finished = ref(false) // 未加载全部 (如果设置为true, 底部就不会再次执行onload, 代表全部加载完成)
const page = ref(1) // 当前搜索结果的页码
const timer = ref(null)
const router = useRouter()
const store = usePlayId()

const toDetail = (id) => {
  store.albumId = id
  router.push({
    path: 'albumDetail'
  })
}

//判断该专辑是否有别名（译名）
const getName = (obj) => {
  if (obj.alias?.length) {
    return `${obj.name} (${obj.alias[0]})`
  } else return obj.name
}

// 触底事件
const onLoad = async () => {
  //节流操作
  if (timer.value) { return }
  timer.value = setTimeout(() => {
    timer.value = null
    loading.value = false;
  }, 1000);
  loading.value = true;
  const res = await getSongsData(store.searchVal, props.type, page.value)
  if (res.data.result?.albums === undefined) { // 没有更多数据了
    finished.value = true; // 全部加载完成(list不会在触发onload方法)
    loading.value = false; // 本次加载完成
    return;
  }
  resultList.value = [...resultList.value, ...res.data.result.albums];
  loading.value = false; // 数据加载完毕-保证下一次还能触发onload
  page.value++
}


watch(() => store.searchVal, async () => {
  page.value = 1
  const res = await getSongsData(store.searchVal, props.type, page.value)
  if (res.data.result?.albums === undefined) {
    resultList.value = [];
    return;
  }
  resultList.value = res.data.result?.albums;
  loading.value = false;
})
</script>

<style scoped>
/* 给单元格设置底部边框 */
.van-cell {
  border-bottom: 1px solid lightgray;
}
</style>