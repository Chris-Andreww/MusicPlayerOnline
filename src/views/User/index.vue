<template>
  <div class="user-page" v-if="isLogin">
    <div class="userinfo">
      <img :src="userProfile.avatarUrl" class="avatar">
      <div class="username">{{ userProfile.nickname }}</div>
      <div class="userfans">关注：{{ userProfile.follows }} &nbsp;| &nbsp;粉丝：{{ userProfile.followeds }}</div>
      <div class="userlevel">Lv.{{ userData.level }}</div>
    </div>
    <van-tabs v-model:active="tabActive">
      <van-tab title="主页">
        <!-- 用户听歌排行和喜欢的歌曲 -->
        <van-list class="userlike">
          <van-cell center :title="`${userProfile.nickname}的听歌排行`" :label="`累计听歌${userData.listenSongs}首`">
            <template #icon>
              <div class="bg">
                <div class="iconfont icon-paixingbang" style="width: 15%;padding-right: 10px;"></div>
              </div>
            </template>
          </van-cell>
          <van-cell @click="toDetail(likePlayList[0].id)" center :title="`${userProfile.nickname}喜欢的音乐`"
            :label="`${userProfile.userlike?.length}首， 播放${userProfile.likeplaynum}次`">
            <template #icon>
              <img :src="likePlayList[0]?.coverImgUrl" style="width: 15%;padding-right: 10px;">
            </template>
          </van-cell>
        </van-list>
        <!-- 用户收藏的歌单信息 -->
        <div class="FavPlaylists" style="margin-top: 30px;">收藏的歌单</div>
        <van-list>
          <van-cell v-for="(obj, index) in filterLikePlayList" center :title="obj.name" @click="toDetail(obj.id)"
            :label="`${obj.trackCount}首， 播放${obj.playCount}次`" :key="index">
            <template #icon>
              <img :src="obj.coverImgUrl" style="width: 15%;padding-right: 10px;">
            </template>
          </van-cell>
        </van-list>
        <!-- 用户创建的歌单信息 -->
        <div class="FavPlaylists" style="margin-top: 30px;">创建的歌单</div>
        <van-list>
          <van-cell v-for="(obj, index) in filterCreatePlayList" center :title="obj.name" @click="toDetail(obj.id)"
            :label="`${obj.trackCount}首， 播放${obj.playCount}次`" :key="index">
            <template #icon>
              <img :src="obj.coverImgUrl" style="width: 15%;padding-right: 10px;">
            </template>
          </van-cell>
        </van-list>
      </van-tab>
      <van-tab title="动态">动态</van-tab>
    </van-tabs>
  </div>
  <div class="toLogin" v-else>
    当前用户未登录，是否登录网易云账号？
    <van-button class="button" round @click="toLogin" color="linear-gradient(to right, #ff6034, #ee0a24)">去登录
      -></van-button>
  </div>
</template>

<script setup>
import { getUserStatusAPI, getUserDetailAPI, getUserPlayListAPI, getUserLikeListAPI } from '@/api';
import { onMounted, ref, computed, watch } from 'vue';
import { usePlayId } from "@/store";
import { useRouter } from 'vue-router'

const userData = ref({})
const userProfile = ref({})
const tabActive = ref(0)
const likePlayList = ref([])
const isLogin = ref(false)  //判断用户是否登录

const store = usePlayId()
const router = useRouter()

const toDetail = (id) => {
  store.playListId = id
  router.push({
    path: '/layout/PlayListDetail'
  })
}

const toLogin = () => {
  router.push({
    path: '/layout/login'
  })
}

//过滤出需要显示的歌单（自己收藏的）
const filterLikePlayList = computed(() => { 
  return likePlayList.value.filter(obj => obj.subscribed) }
)

//过滤出需要显示的歌单（自己创建的）
const filterCreatePlayList = computed(() =>
  likePlayList.value.filter((obj, index) => (!obj.subscribed && index != 0)))

const getData = async () => {
  //获取当前用户的登录状态
  let res = await getUserStatusAPI()

  if (!res.data.data.account) { //如果当前用户未登录
    return
  }
  let uid = res.data.data.profile.userId
  store.uid = uid
  //获取当前账号的信息（关注、粉丝数）
  let userdetail = await getUserDetailAPI(uid)
  userProfile.value = userdetail.data.profile
  userData.value = userdetail.data
  //获取用户喜欢列表
  let userlike = await getUserLikeListAPI(uid)
  userProfile.value.userlike = userlike.data.ids
  //获取当前账号的歌单信息
  let playinfo = await getUserPlayListAPI(uid)
  userProfile.value.likeplaynum = playinfo.data.playlist[0].playCount //获取用户喜欢的音乐歌单播放次数

  likePlayList.value = playinfo.data.playlist //获取用户喜欢的音乐歌单播放次数
  isLogin.value = true
}

onMounted(async () => {
  getData()
})
watch(() => store.uid, () => {
  getData()
})
</script>

<style lang="scss" scoped>
.user-page {

  .userinfo {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: start;

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }

    .username {
      font-size: 20px;
      margin-top: 10px;
    }

    .userfans {
      font-size: 16px;
    }

    .userlevel {
      font-size: 14px;
      background-color: #8779764b;
      padding: 2px 8px;
      border-radius: 20px;
    }
  }

}

.userlike {
  margin-top: 10px;

  .bg {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;

    .icon-paixingbang {
      font-size: 30px;
    }
  }
}

.FavPlaylists {
  font-size: 20px;
  padding-left: 20px;
}

.toLogin {
  font-size: 20px;
  display: flex;
  flex-direction: column;
  padding: 100px 50px;
  justify-content: space-between;

  .button {
    margin-top: 40%;
  }
}
</style>