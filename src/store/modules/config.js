const initial = {
  config() {
    return {
      theme: 'light',
    }
  },
}

const state = {
  config: initial.config(),
}

const mutations = {
  SET(state, setting) {
    state.config[setting.identifier] = setting.value
  },
  SET_STATUS(state, status) {
    state.status = status
  },
  ERROR(state) {
    state.config = initial.config()
    state.status = 'error'
  },
}

const actions = {
  changeTheme({ commit }, theme) {
    return new Promise((resolve) => {
      localStorage.setItem('theme', theme)
      commit('SET', { identifier: 'theme', value: theme })
      resolve()
    })
  },
}

const getters = {
  config: state => state.config,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
