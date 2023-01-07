import { createRouter as _createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
// import Meta from 'vue-meta'

// Vue.use(Meta)

export function createRouter() {
  return new _createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    },
    routes,
  })
}
