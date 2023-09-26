<template>
  <van-nav-bar :title="`评论（${totalCommentNum}）条`" fixed style="z-index: 2;">
    <template #left>
      <div v-show="true" @click="closePage" class="navback iconfont icon-xiangzuoshouqi"></div>
    </template>
  </van-nav-bar>
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <van-cell v-for="(obj, index) in resultList" center :title="obj.user.nickname" :key="index">
      <template #icon>
        <div class="avatar">
          <img v-img-lazy="obj.user.avatarUrl" style="width: 100%;padding-right: 10px">
        </div>
      </template>
      <template #title>
        <div class="title">
          <p>{{ obj.user.nickname }}</p>
          <p>{{ formatDate(obj.time) }}</p>
        </div>
      </template>
      <template #label>
        <div class="content">
          <p>{{ obj.content }}</p>
        </div>
      </template>
    </van-cell>
  </van-list>
</template>

<script setup>
import { getComments } from "@/utils/getData";
import { ref, watch } from "vue";
import { usePlayId } from '@/store'
import { formatDate } from '@/utils/formatTime'
import { useRouter } from "vue-router";

const totalCommentNum = ref(0)
const resultList = ref([]) // 评论内容
const loading = ref(false) // 加载中 (状态) - 只有为false, 才能触底后自动触发onload方法
const finished = ref(false) // 未加载全部 (如果设置为true, 底部就不会再次执行onload, 代表全部加载完成)
const page = ref(1) // 当前搜索结果的页码
const store = usePlayId()
const router = useRouter()

const closePage = () => {
  router.back()
}

// 触底事件
const onLoad = async () => {
  loading.value = true;
  const res = await getComments(store.id, page.value)
  if (!res.data.more) { // 没有更多数据了
    finished.value = true; // 全部加载完成(list不会在触发onload方法)
    loading.value = false; // 本次加载完成
    return;
  }
  //如果有热评，就将热评添加到评论的前面
  if (res.data.hotComments != undefined) {
    resultList.value = res.data.hotComments
    totalCommentNum.value = res.data.total
  }

  resultList.value = [...resultList.value, ...res.data.comments];
  loading.value = false; // 数据加载完毕-保证下一次还能触发onload
  page.value++
}

watch(() => store.id, () => {
  page.value = 1
  onLoad()
})
</script>
<style lang="scss" scoped>
.navback {
  font-size: 20px;
}

.avatar {
  height: 100%;
  width: 30px;
  height: 30px;
  top: 0;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
}

.title {
  font-size: 13px;
  color: #666666;

  p {
    height: 20px;
  }
}

.content {
  font-size: 15px;
  color: #323332;
  padding-top: 8px;
}

/* 给单元格设置底部边框 */
.van-cell {
  border-bottom: 1px solid lightgray;
}
</style>