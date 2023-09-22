<template>
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <van-cell v-for="(obj, index) in resultList" center :title="obj.name" :label="obj.dj.nickname" :key="index"
      @click="toDetail(obj.id)">
      <template #icon>
        <img :src="obj.picUrl" style="width: 15%;padding-right: 10px;">
      </template>
    </van-cell>
  </van-list>
</template>

<script setup>
import { getSongsData } from "@/utils/getData";
import { defineProps, ref, watch } from "vue";
import { useRouter } from 'vue-router';
import { usePlayId } from "@/store";

const props = defineProps({
  value: String,
  type: Number
})
const resultList = ref([]) // 搜索结果
const loading = ref(false) // 加载中 (状态) - 只有为false, 才能触底后自动触发onload方法
const finished = ref(false) // 未加载全部 (如果设置为true, 底部就不会再次执行onload, 代表全部加载完成)
const page = ref(1) // 当前搜索结果的页码
const timer = ref(null)
const router = useRouter()
const store = usePlayId()

// 触底事件
const onLoad = async () => {
  //节流操作
  if (timer.value) { return }
  timer.value = setTimeout(() => {
    timer.value = null
    loading.value = false;
  }, 1000);
  loading.value = true;
  const res = await getSongsData(props.value, props.type, page.value)
  if (res.data.result?.djRadios === undefined) { // 没有更多数据了
    finished.value = true; // 全部加载完成(list不会在触发onload方法)
    loading.value = false; // 本次加载完成
    return;
  }
  resultList.value = [...resultList.value, ...res.data.result.djRadios];
  loading.value = false; // 数据加载完毕-保证下一次还能触发onload
  page.value++
}

const toDetail = (id) => {
  store.djRadioId = id
  router.push({
    path: 'djRadioDetail'
  })
}

watch(() => props.value, async () => {
  page.value = 1
  const res = await getSongsData(props.value, props.type, page.value)
  if (res.data.result?.djRadios === undefined) {
    resultList.value = [];
    return;
  }
  resultList.value = res.data.result?.djRadios;
  loading.value = false;
})
</script>

<style scoped>
/* 给单元格设置底部边框 */
.van-cell {
  border-bottom: 1px solid lightgray;
}
</style>