import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'light',
    user: {
      isLoggedIn: false,
      email: '',
    },
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme
    },
  },
  actions: {},
  getters: {
    theme: state => state.theme,
  },
})
