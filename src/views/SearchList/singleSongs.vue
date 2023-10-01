<template>
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
    <van-cell v-for="(obj, index) in resultList" center :title="obj.name" :label="obj.ar[0].name" :key="index"
      @click="playFn(obj.id, resultList)">
      <template #icon>
        <img v-img-lazy="obj.al.picUrl" style="width: 15%;padding-right: 10px;">
      </template>
    </van-cell>
  </van-list>
</template>

<script setup>
import { getSongsData } from "@/utils/getData";
import { defineProps, ref, watch, onMounted } from "vue";
import { usePlayId } from '@/store'
import { playFn } from '@/utils/Play/PlayFn'

const props = defineProps({
  type: Number
})

const resultList = ref([]) // 搜索结果
const loading = ref(false) // 加载中 (状态) - 只有为false, 才能触底后自动触发onload方法
const finished = ref(false) // 未加载全部 (如果设置为true, 底部就不会再次执行onload, 代表全部加载完成)
const page = ref(1) // 当前搜索结果的页码
const store = usePlayId()

// 触底事件
const onLoad = async () => {
  loading.value = true;
  resultList.value = []
  const res = await getSongsData(store.searchVal, props.type, page.value)
  if (res.data.result?.songs === undefined) { // 没有更多数据了
    finished.value = true; // 全部加载完成(list不会在触发onload方法)
    loading.value = false; // 本次加载完成
    return;
  }
  resultList.value = [...resultList.value, ...res.data.result.songs];
  loading.value = false; // 数据加载完毕-保证下一次还能触发onload
  page.value++
}

watch(() => store.searchVal, async () => {
  resultList.value = []
  page.value = 1
  onLoad()
})

onMounted(() => {
  page.value = 1
  onLoad()
})
</script>

<style lang="scss" scoped>
/* 给单元格设置底部边框 */
.van-cell {
  border-bottom: 1px solid lightgray;
}
</style>
