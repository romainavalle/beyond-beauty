import Vuex from 'vuex'
const createStore = () => {
  return new Vuex.Store({
    state: {
      currentHomeSlideId: -1
    },
    mutations: {
      SET_CURRENT_HOME_SLIDE_ID (state, id) {
        state.currentHomeSlideId = id
      }
    },
    actions: {
      setCurrentHomeSlideId ({ commit }, /*{ commit }, { app, isStatic }*/ id) {
        commit('SET_CURRENT_HOME_SLIDE_ID', id)
      }
    },
    getters: {
      currentHomeSlideId: state => {
        return state.currentHomeSlideId
      }
    }
  })
}

export default createStore
