import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/mobile/flexible'  //自动适应宽度，改变html中的font-size，供rem使用
import '@/assets/reset.css' //初始化字体样式
import '@/assets/font/iconfont.css'
import pinia from '@/store/store'
import vant from 'vant';
//引入懒加载指令插件
import { lazyPlugin } from '@/utils/lazyPlugin'

const app = createApp(App)

app.use(lazyPlugin)
//用于vant的全局组件
app.use(router)
app.use(vant);
app.use(pinia)
app.mount('#app')
