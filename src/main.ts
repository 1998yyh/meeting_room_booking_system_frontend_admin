import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index'
import App from './App.vue'
import 'element-plus/dist/index.css'


import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(createPinia())
app.use(router)

app.config.globalProperties.name = 'yanghao';
app.config.globalProperties.age = 26;

app.mount('#app')



