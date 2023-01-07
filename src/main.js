import { createApp } from 'vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import '@/assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Maska from 'maska'
import 'prismjs'
import '@/assets/css/prism-vsc-dark-plus.css'
import { createClient } from '@supabase/supabase-js'

const store = createStore()
const router = createRouter()

sync(store, router)

const app = createApp({
  router,
  store,
  ...App,
})

const supabase = createClient(
  'https://tsmcdgolhhtzzotghypz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTQ2MDU1MiwiZXhwIjoxOTU3MDM2NTUyfQ.wKYvxV79TzOi82vwodfZjJqf2IRR7hYhxaWyj8cA-lk'
)
app.$supabase = supabase

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

app.mount('#app')

// import VueMeta from 'vue-meta'
// import VueAnalytics from 'vue-analytics'
// import Notifications from 'vue-notification'
// import VTooltip from 'v-tooltip'

// Vue.use(VTooltip, {
//   defaultContainer: '#root',
//   popover: {
//     defaultContainer: '#root',
//   },
// })
// Vue.use(VueMeta)
// Vue.use(VueAnalytics, {
//   id: 'UA-145441695-1',
// })
// Vue.use(Maska)
// Vue.use(Notifications)
