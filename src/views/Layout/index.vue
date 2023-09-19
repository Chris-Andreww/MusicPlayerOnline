<template>
  <div>
    <div class="main" style="overflow: hidden;">
      <van-nav-bar :title="activeTitle" fixed @click-left="showSlider" style="z-index: 2;">
        <template #left>
          <div class="navback iconfont icon-zhankai"></div>
        </template>
      </van-nav-bar>
      <slide-bar class="slidebar"></slide-bar>
      <!-- 二级路由-挂载点 -->
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
      <div class="playBottom" @click="showSlider">
        <div class="playrotate iconfont icon-bofang" :class="{ active: isSlider }"></div>
      </div>
    </div>
    <van-tabbar route>
      <van-tabbar-item replace to="/layout/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/layout/search" icon="search">搜索</van-tabbar-item>
      <van-tabbar-item replace to="/layout/user" icon="user-circle-o">用户</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import SlideBar from '@/views/SlideBar';
import { useRoute } from 'vue-router';
import { usePlayId } from '@/store'

const activeTitle = ref('');
const isSlider = ref(false);
const route = useRoute()
const store = usePlayId()

const showSlider = () => {
  let doc = document.querySelector('.slidebar')
  let root = document.documentElement;

  if (isSlider.value) {
    //关闭侧边栏
    doc.style.left = -doc.offsetWidth + 'px'
    root.style.overflow = '';
    isSlider.value = false
  } else {
    //打开侧边栏
    doc.style.left = '0px'
    root.style.overflow = 'hidden';
    isSlider.value = true
  }
}

watch(() => store.isPlay, (newv) => {
  let elem = document.querySelector('.playrotate')
  if (newv) {
    elem.classList.remove('icon-bofang')
    elem.classList.add('icon-zanting')
  } else {
    elem.classList.remove('icon-zanting')
    elem.classList.add('icon-bofang')
  }
})
watch(route, () => {
  activeTitle.value = route.meta.title;
});
watch(() => store.id, () => {
  showSlider()
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

  .playBottom {
    position: fixed;
    width: 60px;
    height: 60px;
    bottom: 50%;
    right: 5%;
    border-radius: 50%;
    background-color: rgb(0, 0, 0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 30;

    .playrotate {
      font-size: 30px;
      padding-left: 5px;
      color: white;
      transform: rotateZ(0deg);
      transition: transform 0.5s;

      &.active {
        transform: rotateZ(180deg);
      }
    }
  }

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
    z-index: 30;
    transition: left 0.8s;
  }
}
</style>
