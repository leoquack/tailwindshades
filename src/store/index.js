import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'light',
    user: {},
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
  },
})
