import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/Layout'
import Home from '@/views/Home'
import Search from '@/views/Search'
import { UserInfo, UserPlayHistory } from '@/views/User'
import Login from '@/views/Login'
import SearchList from '@/views/SearchList/index.vue'
import { albumDetail, PlayListDetail, djRadioDetail,UserDetail } from '@/views/Detail'
import Comment from '@/views/comments'

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
        },
        children: [
          {
            path: 'searchlist',
            component: SearchList
          },
          {
            path: 'albumDetail',
            name: 'albumDetail',
            component: albumDetail,
            meta: {
              title: "专辑详情"
            }
          },
          {
            path: 'PlayListDetail',
            name: 'PlayListDetail',
            component: PlayListDetail,
            meta: {
              title: "歌单详情"
            }
          },
          {
            path: 'djRadioDetail',
            component: djRadioDetail,
            meta: {
              title: "播客详情"
            }
          }
        ]
      },
      {
        path: 'user',
        component: UserInfo,
        meta: {
          title: "个人中心"
        }
      },
      {
        path: 'login',
        component: Login,
        meta: {
          title: "登录页"
        }
      },
      {
        path: 'PlayListDetail',
        component: PlayListDetail,
        meta: {
          title: "歌单详情"
        }
      }, {
        path: 'albumDetail',
        component: albumDetail,
        meta: {
          title: "专辑详情"
        }
      }, {
        path: 'Comment',
        component: Comment,
        meta: {
          title: "评论"
        }
      }, {
        path: 'userplayhistory',
        component: UserPlayHistory
      }, {
        path: 'userdetail',
        component: UserDetail,
        meta: {
          title: "用户详情"
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
