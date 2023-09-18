import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/Layout'
import Home from '@/views/Home'
import Search from '@/views/Search'
import Play from '@/views/Play'
import User from '@/views/User'

const routes = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/layout',
    component: Layout,
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        component: Home,
        meta: { // meta保存路由对象额外信息的
          title: "首页"
        }
      },
      {
        path: 'search',
        component: Search,
        meta: {
          title: "搜索"
        }
      },
      {
        path: 'user',
        component: User,
        meta: {
          title: "用户"
        }
      },
    ]
  },
  {
    path: '/play',
    component: Play
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
