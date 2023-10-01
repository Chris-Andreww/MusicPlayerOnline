<template>
    <div class="user-page">
        <userinfo :userProfile="userProfile" :userData="userData"></userinfo>
        <van-tabs v-model:active="tabActive">
            <van-tab title="主页">
                <!-- 用户听歌排行和喜欢的歌曲 -->
                <van-list class="userlike">
                    <van-cell center :title="`${userProfile.nickname}的听歌排行`" :label="`累计听歌${userData.listenSongs}首`"
                        @click="toHistory">
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
                <!-- 用户创建的歌单信息 -->
                <userPlayList :PlayList="filterCreatePlayList" :message="'创建的歌单'"></userPlayList>
                <!-- 用户收藏的歌单信息 -->
                <UserPlayList :PlayList="filterLikePlayList" :message="'收藏的歌单'"></UserPlayList>
            </van-tab>
            <van-tab title="动态">动态</van-tab>
        </van-tabs>
    </div>
</template>
  
<script setup>
import { getUserDetailAPI, getUserPlayListAPI, getUserLikeListAPI } from '@/api';
import { onMounted, ref, computed, watch } from 'vue';
import { usePlayId } from "@/store";
import { useRouter, useRoute } from 'vue-router'
import Userinfo from '@/components/userinfo.vue';
import { UserPlayList } from '@/views/User';

const userData = ref({})
const userProfile = ref({})
const tabActive = ref(0)
const likePlayList = ref([])
const uid = ref(0)

const store = usePlayId()
const router = useRouter()
const route = useRoute()

const toDetail = (id) => {
    store.playListId = id
    router.push({
        path: '/layout/PlayListDetail'
    })
}

const toHistory = () => {
    router.push({
        path: '/layout/userplayhistory'
    })
}

//过滤出需要显示的歌单（用户收藏的）
const filterLikePlayList = computed(() => {
    return likePlayList.value.filter(obj => obj.subscribed)
}
)

//过滤出需要显示的歌单（用户创建的）
const filterCreatePlayList = computed(() =>
    likePlayList.value.filter((obj, index) => (!obj.subscribed && index != 0)))

const getData = async () => {

    //获取当前账号的信息（关注、粉丝数）
    let userdetail = await getUserDetailAPI(uid.value)

    userProfile.value = userdetail.data.profile
    userData.value = userdetail.data
    //获取用户喜欢列表
    let userlike = await getUserLikeListAPI(uid.value, Date.now())
    userProfile.value.userlike = userlike.data.ids
    //获取当前账号的歌单信息
    let playinfo = await getUserPlayListAPI(uid.value)
    userProfile.value.likeplaynum = playinfo.data.playlist[0].playCount //获取用户喜欢的音乐歌单播放次数

    likePlayList.value = playinfo.data.playlist //获取用户喜欢的音乐歌单播放次数
}

onMounted(async () => {
    uid.value = route.query.uid
    getData()
})
watch(() => route.query.uid, () => {
    if (route.query.uid == undefined) {
        return
    }
    uid.value = route.query.uid
    getData()
})
</script>
  
<style lang="scss" scoped>
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
</style>