import { createApp } from 'vue'
import App from './App.vue'
import 'devextreme/dist/css/dx.light.css'
import 'vue3-toastify/dist/index.css';
import Vue3Toastify, { toast } from 'vue3-toastify';
import 'floating-vue/dist/style.css'
import './assets/css/style.css'
import './assets/css/DevExtreme.css'
import router from './router'
import FloatingVue from 'floating-vue'

const app = createApp(App)
app.use(Vue3Toastify, {
    autoClose: 3000,
    position: toast.POSITION.TOP_CENTER,
});
app.use(router)
app.use(FloatingVue)
app.mount('#app')
