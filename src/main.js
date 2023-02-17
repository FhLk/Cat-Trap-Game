import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'
import routers from './router'

createApp(App).use(routers).mount('#app')
