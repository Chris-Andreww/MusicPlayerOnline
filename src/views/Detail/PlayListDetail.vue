<template>
  <div>
    <div class="title">
      <div class="album-bg" :style="`background-image: url(${playlist.coverImgUrl ?? ''})`"></div>
      <img :src="playlist.coverImgUrl ?? ''">
      <div class="info">
        <div class="albuminfo">
          <div>{{ playlist.name }}</div>
          <div>创建用户：{{ playlist.creator?.nickname }}</div>
        </div>
        <div>{{ playlist.description }}</div>
      </div>
    </div>
    <div class="songsList">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
        :immediate-check="false">
        <van-cell v-for="(obj, index) in songsInfo" center :title="obj?.name" :label="obj?.ar[0].name" :key="obj.id"
          @click="playFn(obj.id)" :value="index + 1">
          <template #icon>
            <img :src="obj?.al.picUrl" style="width: 15%;padding-right: 10px;">
          </template>
        </van-cell>
      </van-list>
    </div>
    <!-- 无版权或vip歌曲显示 -->
    <div class="noSongToast">当前歌曲为会员歌曲或无版权歌曲，暂时无法播放~~</div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { getSongCheckAPI, getPlayListDetailAPI } from '@/api'
import { usePlayId } from "@/store"
import { getPlayListTrack } from "@/utils/getData";

const store = usePlayId()

const loading = ref(false) // 加载中 (状态) - 只有为false, 才能触底后自动触发onload方法
const finished = ref(false) // 未加载全部 (如果设置为true, 底部就不会再次执行onload, 代表全部加载完成)
const page = ref(1) // 当前搜索结果的页码
const playlist = ref({})
const songsInfo = ref([])
const playId = ref('')

//获取歌单详情
const getData = async () => {
  let res = await getPlayListDetailAPI(playId.value)
  playlist.value = res.data.playlist
  onLoad()
}

// 触底事件，获取歌单所有歌曲
const onLoad = async () => {
  loading.value = true;
  let res = await getPlayListTrack(playId.value, page.value)

  if (res.data.songs.length === 0) { // 没有更多数据了
    finished.value = true; // 全部加载完成(list不会在触发onload方法)
    loading.value = false; // 本次加载完成
    return;
  }
  songsInfo.value = [...songsInfo.value, ...res.data.songs];
  store.curPlayList = songsInfo.value
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
  store.id = id
}

watch(() => store.playListId, () => {
  playlist.value = {}
  songsInfo.value = []
  page.value = 1
  playId.value = store.playListId
  getData()
})

onMounted(() => {
  playId.value = store.playListId
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
    width: 120px;
    height: 120px;
    padding: 20px;
  }

  .info {
    color: white;
    display: flex;
    width: 100%;
    height: 100%;
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
      font-size: 13px;
      color: rgb(231, 229, 229);
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      /* 想第几行显示省略号就写对应的行数 */
      -webkit-box-orient: vertical;
    }
  }
}

.songsList {
  position: relative;
  margin-top: 40px;

  .van-cell {
    border-bottom: 1px solid lightgray;
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
</style>