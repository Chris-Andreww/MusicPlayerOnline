<template>
  <div>
    <div class="title">
      <div class="album-bg" :style="`background-image: url(${albumInfo.picUrl ?? ''})`"></div>
      <img :src="albumInfo.picUrl ?? ''">
      <div class="info">
        <div class="albuminfo">
          <div>{{ albumInfo.name }}</div>
          <div>歌手：{{ albumInfo.artist?.name }}</div>
        </div>
        <div>发行时间：{{ formatDate(albumInfo.publishTime) }}</div>
      </div>
    </div>
    <div class="songsList">
      <van-list>
        <van-cell v-for="(obj, index) in songsInfo" center :title="obj.name" :label="obj.ar[0].name" :key="index"
          @click="playFn(obj.id, songsInfo)">
          <template #icon>
            <div class="container">
              <img v-img-lazy="obj?.al.picUrl">
            </div>
          </template>
          <template #right-icon>
            <p style="color: #969799;">{{ index + 1 }}</p>
          </template>
        </van-cell>
      </van-list>
      <!-- 无版权或vip歌曲显示 -->
      <div class="noSongToast">当前歌曲为会员歌曲，只能试听30秒~~</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { getAlbumByIdAPI } from '@/api'
import { formatDate } from '@/utils/formatTime'
import { usePlayId } from "@/store"
import { playFn } from '@/utils/Play/PlayFn'

const store = usePlayId()

const albumInfo = ref({})
const songsInfo = ref([])
const albumId = ref('')

const getData = async () => {
  let res = await getAlbumByIdAPI(albumId.value)
  albumInfo.value = res.data.album
  songsInfo.value = res.data.songs
  //用于歌曲切换而创建的列表
  store.curPlayList = songsInfo.value.map(val => {
    return val.id
  })
}

watch(() => store.albumId, (id) => {
  albumId.value = id
  getData()
})

onMounted(() => {
  albumId.value = store.albumId
  getData()
})

</script>

<style lang="scss" scoped>
.title {
  position: relative;
  display: flex;
  width: 100%;
  height: 20%;
  padding: 20px 0;
  align-items: center;
  overflow: hidden;

  .album-bg {
    background-color: #161824;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    transform-origin: center;
    position: absolute;
    transform: scale(8);
    height: 80%;
    width: 100%;
    z-index: -1;
    opacity: 1;
    filter: blur(20px);
  }

  img {
    width: 100px;
    height: 100px;
    padding: 20px;
  }

  .info {
    color: white;
    display: flex;
    width: 100%;
    height: 100px;
    flex-direction: column;
    justify-content: space-between;
    font-size: 18px;

    .albuminfo {
      div:nth-child(1) {
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 5px;
      }

      div:nth-child(2) {
        font-size: 14px;
      }
    }

    div:nth-child(2) {
      font-size: 14px;
      color: rgb(214, 214, 214);
    }
  }
}

.songsList {
  position: relative;
  margin-top: 40px;

  .van-cell {
    border-bottom: 1px solid lightgray;

    .container {
      width: 50px;
      height: 50px;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        padding-right: 10px;
      }
    }
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
}
</style>