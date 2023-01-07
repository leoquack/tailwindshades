import { createStore as _createStore } from 'vuex'

export function createStore(router) {
  return _createStore({
    state: {
      get route() {
        return router.currentRoute.value
      },
      theme: 'light',
      user: {},
      loginFeatures: true,
      cache: {},
      originShade: {},
    },
    mutations: {
      setTheme(state, theme) {
        state.theme = theme
      },
      setUser(state, user) {
        state.user = user
      },
      setCacheValue(state, { key, value }) {
        state.cache[key] = {
          value,
          createdAt: Date.now(),
        }
      },
      setOriginShade(state, shade) {
        state.originShade = shade
      },
    },
    actions: {
      fromCache({ state }, { key, expiry }) {
        return new Promise(resolve => {
          if (!state.cache[key]) {
            return resolve({ error: "doesn't exist" })
          }
          if (!state.cache[key]?.value) {
            return resolve({ error: 'empty' })
          }
          if (state.cache[key]?.createdAt < expiry) {
            return resolve({ error: 'expired' })
          }

          return resolve({ data: state.cache[key].value })
        })
      },
    },
    getters: {
      theme: state => state.theme,
      user: state => state.user,
      cache: state => state.cache,
      isLoggedIn: state => {
        if (!state.user) {
          return false
        }
        return Object.entries(state.user).length > 0
      },
      loginFeatures: state => state.loginFeatures,
      originShade: state => state.originShade,
    },
  })
}
