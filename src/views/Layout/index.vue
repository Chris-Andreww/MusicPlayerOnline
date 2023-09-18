<template>
  <div>
    <div class="main" style="overflow: hidden;">
      <van-nav-bar :title="activeTitle" fixed @click-left="showSlider" style="z-index: 2;">
        <template #left>
          <div class="iconfont icon-zhankai" :class="{ active: isSlider }"></div>
        </template>
      </van-nav-bar>
      <slide-bar class="slidebar" @showSlider="showSlider"></slide-bar>
      <!-- 二级路由-挂载点 -->
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </div>
    <van-tabbar route>
      <van-tabbar-item replace to="/layout/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/layout/search" icon="search">搜索</van-tabbar-item>
      <van-tabbar-item replace to="/layout/user" icon="user-circle-o">用户</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import SlideBar from '@/views/SlideBar'
export default {
  data () {
    return {
      activeTitle: this.$route.meta.title, // "默认"顶部导航要显示的标题 (默认获取当前路由对象里的meta中title值)
      isSlider: false
    };
  },
  methods: {
    showSlider () {
      let doc = document.querySelector('.slidebar')
      let root = document.documentElement;

      if (this.isSlider) {
        //关闭侧边栏
        doc.style.left = -doc.offsetWidth + 'px'
        root.style.overflow = '';
        this.isSlider = false
      } else {
        //打开侧边栏
        doc.style.left = '0px'
        root.style.overflow = 'hidden';
        this.isSlider = true
      }
    }
  },
  // 路由切换 - 侦听$route对象改变
  watch: {
    $route () {
      this.activeTitle = this.$route.meta.title; // 提取切换后路由信息对象里的title显示
    },
  },
  components: {
    SlideBar
  }
};
</script>

<style lang="scss" scoped>
/* 中间内容区域 - 容器样式(留好上下导航所占位置) */
.main {
  padding-top: 46px;
  padding-bottom: 50px;
  overflow: hidden;

  .iconfont {
    font-size: 20px;
    transform: rotateZ(0deg);
    transition: transform 0.5s;

    &.active {
      transform: rotateZ(180deg);
    }
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
