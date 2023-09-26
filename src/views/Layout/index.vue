<template>
  <div>
    <div class="main" style="overflow: hidden;">
      <van-nav-bar :title="activeTitle" fixed style="z-index: 2;">
        <template #left>
          <div v-show="showNavBack" @click="closePage" class="navback iconfont icon-zhankai"></div>
        </template>
      </van-nav-bar>
      <slide-bar class="slidebar"></slide-bar>
      <!-- 二级路由-挂载点 -->
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </div>
    <van-tabbar route z-index="30">
      <van-tabbar-item replace to="/layout/home" icon="home-o" @click="navClick(0)">首页</van-tabbar-item>
      <van-tabbar-item @click="navClick(1)">
        <template #icon>
          <div class="playrotate iconfont icon-bofang" :class="{ active: isSlider }"></div>
        </template>
        播放页
      </van-tabbar-item>
      <van-tabbar-item replace to="/layout/search" icon="search" @click="navClick(2)">搜索</van-tabbar-item>
      <van-tabbar-item replace to="/layout/user" icon="user-circle-o" @click="navClick(3)">用户</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import SlideBar from '@/views/SlideBar';
import { useRoute, useRouter } from 'vue-router';
import { usePlayId } from '@/store'

const activeTitle = ref('');
const isSlider = ref(false);
const route = useRoute()
const router = useRouter()
const store = usePlayId()
const showNavBack = ref(false)

//传入1代表可以控制侧边栏开关，传入2代表只能控制关闭
const navClick = (index) => {
  if (index == 1) {
    showSlider()
  } else if (isSlider.value) {
    showSlider()
  }
}

const showSlider = () => {
  let doc = document.querySelector('.slidebar')
  let root = document.documentElement;

  if (isSlider.value) {
    //关闭侧边栏
    doc.style.left = -doc.offsetWidth + 'px'
    root.style.overflow = '';
    isSlider.value = false
    store.showSlideBar = false
  } else {
    //打开侧边栏
    doc.style.left = '0px'
    root.style.overflow = 'hidden';
    isSlider.value = true
  }
}

const closePage = () => {
  router.back()
}

watch(route, (to) => {
  navClick(2)
  if (to.fullPath == '/layout/search' || to.fullPath == '/layout/home' || to.fullPath == '/layout/user') {
    showNavBack.value = false
    store.searchVal = ''
  } else {
    showNavBack.value = true
  }
  activeTitle.value = route.meta.title;
});
watch(() => store.id, () => {
  showSlider()
})

watch(() => store.showSlideBar, (isshow) => {
  if (isshow == true) {
    showSlider()
  }
})

onMounted(() => {
  activeTitle.value = route.meta.title;
});
</script>

<style lang="scss" scoped>
/* 中间内容区域 - 容器样式(留好上下导航所占位置) */
.main {
  padding-top: 46px;
  padding-bottom: 50px;
  overflow: hidden;

  .navback {
    font-size: 20px;
    transform: rotateZ(180deg);
  }

  .slidebar {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: fixed;
    left: -100%;
    top: 0px;
    z-index: 30;
    transition: left 0.8s;
  }
}

.playrotate {
  padding-left: 5px;
  transform: rotateZ(0deg);
  transition: transform 0.5s;

  &.active {
    transform: rotateZ(180deg);
  }
}
</style>
