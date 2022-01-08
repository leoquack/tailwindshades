import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'light',
    user: {},
    loginFeatures: true,
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme
    },
    setUser(state, user) {
      state.user = user
    },
  },
  actions: {},
  getters: {
    theme: state => state.theme,
    user: state => state.user,
    isLoggedIn: state => {
      if (!state.user) {
        return false
      }
      return Object.entries(state.user).length > 0
    },
    loginFeatures: state => state.loginFeatures,
  },
})
