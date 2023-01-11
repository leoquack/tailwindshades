import { createApp } from 'vue'
import { createStore } from './store'
import { createRouter } from './router'
import App from './App.vue'
import '@/assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
// import VueAnalytics from 'vue-analytics'
import Notifications from '@kyvg/vue3-notification'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import 'prismjs'
import '@/assets/css/prism-vsc-dark-plus.css'
import { createClient } from '@supabase/supabase-js'
import { createHead, VueHeadMixin } from '@unhead/vue'

const router = createRouter()
const store = createStore(router)

const app = createApp(App)

app.use(store)
app.use(router)
app.use(FloatingVue, {
  container: '#root',
})
app.use(Notifications)

const head = createHead()
app.mixin(VueHeadMixin)
app.use(head)

// app.use(VueAnalytics, {
//   id: 'UA-145441695-1',
// })

const supabase = createClient(
  'https://tsmcdgolhhtzzotghypz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTQ2MDU1MiwiZXhwIjoxOTU3MDM2NTUyfQ.wKYvxV79TzOi82vwodfZjJqf2IRR7hYhxaWyj8cA-lk'
)
app.config.globalProperties.$supabase = supabase

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
  if (
    to.matched.some(record => record.meta.auth) &&
    !store.getters.isLoggedIn
  ) {
    // alert('You need to be logged in to access this page')
    next('/')
  } else {
    next()
  }
})

app.mount('#app')
