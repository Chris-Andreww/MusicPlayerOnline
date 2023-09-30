<template>
  <div class="home">
    <p class="title">推荐歌单</p>
    <div class="recList">
      <div v-for="(item, index) in recPlayList" :key="index" @click="toDetail(item.id)">
        <img v-img-lazy="item.picUrl">
        <p>{{ item.name }}</p>
      </div>
    </div>
    <p class="title">每日推荐</p>
    <div class="recSongs">
      <van-list>
        <van-cell v-for="(obj, index) in recSongsList" center :key="index" @click="playFn(obj.id, recSongsList)">
          <template #icon>
            <img v-img-lazy="obj.al.picUrl" style="width: 18%;padding-right: 10px;">
          </template>
          <template #title>
            <span class="subtitle" style="font-size: 16px;">{{ obj.name }}</span>
            <span class="singlename" style="font-size: 14px;color: #999999;"> - {{ obj.ar[0].name }}</span>
          </template>
          <template #label>
            <van-tag color="#ffe3e0" text-color="red">{{ obj.reason }}</van-tag>
          </template>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { GetAnonimousAPI, recPlayListAPI, recsongsAPI } from '@/api';
import { onMounted, ref } from 'vue';
import { usePlayId } from '@/store'
import { useRouter } from 'vue-router'
import { playFn } from '@/utils/Play/PlayFn'

const recPlayList = ref([])
const recSongsList = ref([])
const store = usePlayId()
const router = useRouter()

const toDetail = (id) => {
  store.playListId = id
  router.push({
    path: '/layout/PlayListDetail'
  })
}

onMounted(async () => {
  //判断当前用户是否登录，如果没登录就用匿名账号
  if (document.cookie && store.uid) {
    let res = await recPlayListAPI()
    let res2 = await recsongsAPI()
    recPlayList.value = res.data.recommend
    recSongsList.value = res2.data.data.dailySongs
  } else {
    await GetAnonimousAPI()
    let res = await recPlayListAPI()
    let res2 = await recsongsAPI()
    recPlayList.value = res.data.recommend
    recSongsList.value = res2.data.data.dailySongs
  }
})
</script>

<style lang="scss" scoped>
.home {
  .title {
    font-size: 20px;
    padding: 10px;

    .subtitle {
      font-size: 18px;
    }

    .singlename {
      font-size: 16px;

    }
  }

  .recList {
    height: 180px;
    display: flex;
    overflow-x: scroll;


    div {
      width: 100%;
      height: 100%;
      padding: 0px 10px 0px;
      display: flex;
      flex-direction: column;

      img {
        width: 100px;
        height: 100px;
      }

      p {
        font-size: 14px;
      }
    }
  }

  .recSongs {
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow-x: hidden;
  }
}
</style>