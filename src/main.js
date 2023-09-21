import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/mobile/flexible'  //自动适应宽度，改变html中的font-size，供rem使用
import '@/assets/reset.css' //初始化字体样式
import '@/assets/font/iconfont.css'
import pinia from '@/store/store'
import { Tabbar, TabbarItem, NavBar, Col, Row, Image as VanImage, Cell, List, Tab, Tabs, Field, CellGroup, Button } from 'vant';

const app = createApp(App)
//用于vant的全局组件
app.use(router, Tabbar, TabbarItem, NavBar, Col, Row, VanImage, Cell, List, Tab, Tabs, Field, CellGroup, Button);
app.use(pinia)
app.mount('#app')
