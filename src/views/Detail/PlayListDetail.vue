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
        <van-cell v-for="(obj, index) in songsInfo" center :title="obj?.name" :label="obj?.ar[0].name" :key="index"
          @click="playFn(obj.id, songsInfo)">
          <template #icon>
            <div class="container">
              <p style="color: #969799;padding: 0 10px;">{{ index + 1 }}</p>
              <img v-img-lazy="obj?.al.picUrl">
            </div>
          </template>
          <template #right-icon>
            <div @click.stop="selectMore(obj.id)" class="iconfont icon-gengduo" style="padding: 15px 5px;"></div>
          </template>
        </van-cell>
      </van-list>
    </div>
    <!-- 收藏到歌单 -->
    <MoreFun :id="id" :PlayList="PlayList" @closeAddplaylist="closeAddplaylist"></MoreFun>
    <van-action-sheet cancel-text="取消" v-model:show="showMore" :actions="actions" @select="onSelect" />
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPlayListDetailAPI, getUserPlayListAPI, delSongToListAPI } from '@/api'
import { usePlayId } from "@/store"
import { getPlayListTrack } from "@/utils/getData";
import { showConfirmDialog, showToast } from 'vant';
import 'vant/lib/index.css'
import { playFn } from '@/utils/Play/PlayFn'
const store = usePlayId()

const id = ref(0) //记录当前点击的歌曲id
const loading = ref(false) // 加载中 (状态) - 只有为false, 才能触底后自动触发onload方法
const finished = ref(false) // 未加载全部 (如果设置为true, 底部就不会再次执行onload, 代表全部加载完成)
const page = ref(1) // 当前搜索结果的页码
const playlist = ref({})
const songsInfo = ref([])
const playId = ref('')
const showMore = ref(false);
const PlayList = ref([])  //保存用户收藏的歌单，用于添加歌曲至歌单
const actions = [
  { name: '收藏到歌单', index: 1 },
  { name: '删除', index: 2 }
];

const selectMore = (selectId) => {
  showMore.value = true
  id.value = selectId
}

const closeAddplaylist = () => {
  PlayList.value = []
}

const onSelect = async (item) => {
  if (item.index == 1) {  //添加歌曲
    let res = await getUserPlayListAPI(store.uid)
    //过滤出是用户创建的歌单而不是所有歌单
    PlayList.value = res.data.playlist.filter(obj => !obj.subscribed)
  } else if (item.index == 2) { //删除歌曲
    showConfirmDialog({ //确认删除弹窗
      title: '注意',
      message:
        '确定将所选音乐从歌单中删除？',
      confirmButtonColor: '#f10f0f'
    }).then(async () => {
      let pid = playlist.value.id
      let res = await delSongToListAPI(pid, id.value) //删除歌单中的歌曲
      if (res.data.message) {
        showToast(res.data.message)
        return
      }
      showToast('删除成功')
      resetData()
      getData()  //重新加载数据
    }).catch(() => { })
  }
  showMore.value = false;
};

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
  //用于歌曲切换而创建的列表
  store.curPlayList = songsInfo.value.map(val => {
    return val.id
  })

  loading.value = false; // 数据加载完毕-保证下一次还能触发onload
  page.value++
}

const resetData = () => {
  playlist.value = {}
  songsInfo.value = []
  page.value = 1
}

watch(() => store.playListId, () => {
  resetData()
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