<template>
  <div>
    <div class="title">
      <div class="album-bg" :style="`background-image: url(${playlist.picUrl ?? ''})`"></div>
      <img :src="playlist.picUrl ?? ''">
      <div class="info">
        <div class="albuminfo">
          <div>{{ playlist.name }}</div>
          <div>创建用户：{{ playlist?.dj?.nickname }}</div>
        </div>
        <div>{{ playlist.desc }}</div>
      </div>
    </div>
    <div class="songsList">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false"
        @load="onLoad">
        <van-cell v-for="(obj, index) in songsInfo" center :title="obj?.name" :label="obj?.dj.brand" :key="index"
          @click="playFn(obj.mainSong.id)">
          <template #icon>
            <div class="container">
              <img v-img-lazy="obj.coverUrl">
            </div>
          </template>
          <template #right-icon>
            <p style="color: #969799;">{{ index + 1 }}</p>
          </template>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { getdjRadioDetailAPI } from '@/api'
import { usePlayId } from "@/store"
import { getdjRadioTrack } from "@/utils/getData";

const store = usePlayId()

const loading = ref(false) // 加载中 (状态) - 只有为false, 才能触底后自动触发onload方法
const finished = ref(false) // 未加载全部 (如果设置为true, 底部就不会再次执行onload, 代表全部加载完成)
const page = ref(1) // 当前搜索结果的页码
const playlist = ref({})
const songsInfo = ref([])
const playId = ref('')

//获取歌单详情
const getData = async () => {
  let res = await getdjRadioDetailAPI(playId.value)
  playlist.value = res.data.data
  onLoad()
}

// 触底事件，获取播客所有歌曲
const onLoad = async () => {
  loading.value = true;
  let res = await getdjRadioTrack(playId.value, page.value)

  if (res.data.programs.length === 0) { // 没有更多数据了
    finished.value = true; // 全部加载完成(list不会在触发onload方法)
    loading.value = false; // 本次加载完成
    return;
  }
  songsInfo.value = [...songsInfo.value, ...res.data.programs];
  //用于歌曲切换而创建的列表
  store.curPlayList = songsInfo.value.map(val => {
    return val.id
  })
  loading.value = false; // 数据加载完毕-保证下一次还能触发onload
  page.value++
}

const playFn = async (id) => {
  store.id = id
}

watch(() => store.djRadioId, () => {
  playlist.value = {}
  songsInfo.value = []
  page.value = 1
  playId.value = store.djRadioId
  getData()
})

onMounted(() => {
  playId.value = store.djRadioId
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
}
</style>