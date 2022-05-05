import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import store from '@/store/index'
import VueMeta from 'vue-meta'
import VueAnalytics from 'vue-analytics'
import '@/assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Notifications from 'vue-notification'
import Maska from 'maska'
import 'prismjs'
import '@/assets/css/prism-vsc-dark-plus.css'
import { createClient } from '@supabase/supabase-js'
import VTooltip from 'v-tooltip'

Vue.use(VTooltip, {
  defaultContainer: '#root',
  popover: {
    defaultContainer: '#root',
  },
})
Vue.use(VueMeta)
Vue.use(VueAnalytics, {
  id: 'UA-145441695-1',
})
Vue.use(Maska)
Vue.use(Notifications)
Vue.config.productionTip = false

const supabase = createClient(
  'https://tsmcdgolhhtzzotghypz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTQ2MDU1MiwiZXhwIjoxOTU3MDM2NTUyfQ.wKYvxV79TzOi82vwodfZjJqf2IRR7hYhxaWyj8cA-lk'
)
Vue.prototype.$supabase = supabase

supabase.auth.onAuthStateChange((event, session) => {
  const user = session?.user
  store.commit('setUser', user)
})

const theme = localStorage.getItem('theme')
if (theme === 'light') {
  store.commit('setTheme', 'light')
} else {
  store.commit('setTheme', 'dark')
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth) && !store.getters.isLoggedIn) {
    // alert('You need to be logged in to access this page')
    next('/')
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
