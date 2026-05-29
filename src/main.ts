import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/style.css'
import 'floating-vue/dist/style.css'
import router from './router'
import FloatingVue from 'floating-vue'

const app = createApp(App)
app.use(router)
app.use(FloatingVue)

app.mount('#app')
