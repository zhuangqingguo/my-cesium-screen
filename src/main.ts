import { createApp } from 'vue'
import { store } from './store'

// normalize.css
import 'normalize.css/normalize.css'
// import "ant-design-vue/dist/antd.css";
// svg icon
import 'virtual:svg-icons-register'

// 引入和风天气图标
import 'qweather-icons/font/qweather-icons.css'
// 引入ant-design 非组件模块样式
import 'ant-design-vue/es/message/style/css'
import 'ant-design-vue/es/notification/style/css'
// 全局样式
import './styles/index.less'

import App from './App.vue'
import router from './router'

const app = createApp(App)
// app.use(VueTianditu, {
//   v: '4.0',
//   tk: '7f013d0186775b063d6a046977bbefc6'
// })

app.use(store).use(router).mount('#app')
