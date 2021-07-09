import Vue from 'vue'
import App from './App.vue'
import store from '@/store/index'
import VueMeta from 'vue-meta'
import VueAnalytics from 'vue-analytics'
import '@/assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Notifications from 'vue-notification'
import Maska from 'maska'
import 'prismjs'
import '@/assets/css/prism-vsc-dark-plus.css'

Vue.use(VueMeta)
Vue.use(VueAnalytics, {
  id: 'UA-145441695-1',
})
Vue.use(Maska)
Vue.use(Notifications)

Vue.config.productionTip = false

const theme = localStorage.getItem('theme')
if (theme === 'light') {
  store.dispatch('config/changeTheme', 'light')
} else {
  store.dispatch('config/changeTheme', 'dark')
}

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
