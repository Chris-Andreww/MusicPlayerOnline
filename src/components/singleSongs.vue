<template>
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <van-cell v-for="obj in resultList" center :title="obj.name" :label="obj.ar[0].name" :key="obj.id"
      @click="playFn(obj.id)">
      <template #icon>
        <img :src="obj.al.picUrl" style="width: 15%;padding-right: 10px;">
      </template>
    </van-cell>
  </van-list>
  <!-- 无版权或vip歌曲显示 -->
  <div class="noSongToast">当前歌曲为会员歌曲或无版权歌曲，暂时无法播放~~</div>
</template>

<script setup>
import { getSongsData } from "@/utils/getData";
import { defineProps, ref, watch } from "vue";
import { usePlayId } from '@/store'
import { getSongCheckAPI } from '@/api'

const props = defineProps({
  value: String,
  type: Number
})


const resultList = ref([]) // 搜索结果
const loading = ref(false) // 加载中 (状态) - 只有为false, 才能触底后自动触发onload方法
const finished = ref(false) // 未加载全部 (如果设置为true, 底部就不会再次执行onload, 代表全部加载完成)
const page = ref(1) // 当前搜索结果的页码
const storePlayId = usePlayId()

// 触底事件
const onLoad = async () => {
  loading.value = true;
  const res = await getSongsData(props.value, props.type, page.value)
  if (res.data.result?.songs === undefined) { // 没有更多数据了
    finished.value = true; // 全部加载完成(list不会在触发onload方法)
    loading.value = false; // 本次加载完成
    return;
  }
  resultList.value = [...resultList.value, ...res.data.result.songs];
  loading.value = false; // 数据加载完毕-保证下一次还能触发onload
  page.value++
}
const playFn = async (id) => {
  const checkRes = await getSongCheckAPI(id)
  if (!checkRes.data.success) {
    let elem = document.querySelector('.noSongToast')
    elem.classList.add('fadein')
    setTimeout(() => {
      elem.classList.remove('fadein')
    }, 2000)
    return
  }
  storePlayId.id = id
}

watch(() => props.value, async () => {
  page.value = 1
  const res = await getSongsData(props.value, props.type, page.value)
  if (res.data.result?.songs === undefined) {
    resultList.value = [];
    return;
  }
  resultList.value = res.data.result?.songs;
  loading.value = false;
})
</script>

<style lang="scss" scoped>
/* 给单元格设置底部边框 */
.van-cell {
  border-bottom: 1px solid lightgray;
}

.noSongToast {
  position: fixed;
  transform: translateX(-50%);
  font-size: 20px;
  padding: 10px 20px;
  width: 50%;
  color: white;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  left: 50%;
  top: 50%;
  opacity: 0;

  transition: opacity 1s;

  &.fadein {
    opacity: 1;
  }
}
</style>
