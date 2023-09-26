<template>
  <div>
    <!-- 用户创建的歌单信息 -->
    <div class="FavPlaylists" style="margin-top: 30px;">{{ message }}</div>
    <van-list>
      <van-cell v-for="(obj, index) in PlayList" center :title="obj.name" @click="toDetail(obj.id)"
        :label="`${obj.trackCount}首， 播放${formatNum(obj.playCount)}次`" :key="index">
        <template #icon>
          <img v-img-lazy="obj.coverImgUrl" style="width: 15%;padding-right: 10px;">
        </template>
      </van-cell>
    </van-list>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
import { formatNum } from '@/utils/formatNum';
import { usePlayId } from "@/store";
import { useRouter } from 'vue-router'
const store = usePlayId()
const router = useRouter()

defineProps({
  PlayList: Array,
  message: String
})
const toDetail = (id) => {
  store.playListId = id
  router.push({
    path: '/layout/PlayListDetail'
  })
}
</script>
<style lang="scss" scoped>
.FavPlaylists {
  font-size: 20px;
  padding-left: 20px;
}
</style>