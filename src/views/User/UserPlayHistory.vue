<template>
  <div>
    <van-nav-bar title="听歌排行" fixed style="z-index: 2;">
      <template #left>
        <div v-show="true" @click="closePage" class="navback iconfont icon-xiangzuoshouqi"></div>
      </template>
    </van-nav-bar>
    <van-tabs v-model:active="active" swipeable>
      <van-tab title="最近一周">
        <van-list class="songsList">
          <van-cell v-for="(obj, index) in songsInfo" center :title="obj.song.name" :key="index"
            @click="playFn(obj.song.id, resSongsInfo)">
            <template #icon>
              <div class="container">
                <p style="color: #969799;padding: 0 10px;">{{ index + 1 }}</p>
                <img v-img-lazy="obj.song.al.picUrl">
              </div>
            </template>
            <template #label>
              <p>{{ obj.song.ar[0].name }} - {{ obj.song.al.name }}</p>
            </template>
            <template #right-icon>
              <div style="color: #969799;font-size: 12px;" class="iconfont icon-live">&nbsp;{{ obj.playCount }}次</div>
            </template>
          </van-cell>
        </van-list>
      </van-tab>
      <van-tab title="所有时间">
        <van-list class="songsList">
          <van-cell v-for="(obj, index) in songsInfo" center :title="obj.song.name" :key="index"
            @click="playFn(obj.song.id, resSongsInfo)">
            <template #icon>
              <div class="container">
                <p style="color: #969799;padding: 0 10px;">{{ index + 1 }}</p>
                <img v-img-lazy="obj.song.al.picUrl">
              </div>
            </template>
            <template #label>
              <p>{{ obj.song.ar[0].name }} - {{ obj.song.al.name }}</p>
            </template>
            <template #right-icon>
              <div style="color: #969799;font-size: 12px;" class="iconfont icon-live">&nbsp;{{ obj.playCount }}次</div>
            </template>
          </van-cell>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script setup>
import { usePlayId } from "@/store";
import { onMounted, ref, watch } from 'vue'
import { GetPlayHistoryAPI } from '@/api'
import { playFn } from '@/utils/Play/PlayFn'
import { useRouter } from "vue-router";

const store = usePlayId()
const songsInfo = ref([])
const active = ref(0)
const resSongsInfo = ref([])  //存放解析为数组格式的歌曲列表，用于循环播放
const router = useRouter()

//传入1代表获取一周的数据，传入0代表获取全部数据
const getData = async (id) => {
  let res = await GetPlayHistoryAPI(store.uid, id)
  if (id == 1) {
    songsInfo.value = res.data.weekData
    resSongsInfo.value = res.data.weekData.map(val => {
      return val.song
    })
  } else {
    songsInfo.value = res.data.allData
    resSongsInfo.value = res.data.allData.map(val => {
      return val.song
    })
  }
}

const closePage = () => {
  router.back()
}

watch(active, (newv) => {
  if (newv == 0) {
    songsInfo.value = []
    getData(1)
  } else {
    songsInfo.value = []
    getData(0)
  }
})

onMounted(() => {
  getData(1)
})
</script>
<style lang="scss" scoped>
.songsList {
  position: relative;
  margin-top: 40px;

  .van-cell {
    border-bottom: 1px solid lightgray;

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        margin-right: 20px;
      }
    }
  }
}
</style>