import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import routes from './routes'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  mode: 'history',
  linkActiveClass: '',
  linkExactActiveClass: '',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
  routes,
})
