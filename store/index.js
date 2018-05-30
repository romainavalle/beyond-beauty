import Vuex from 'vuex'
import { pages } from '~/assets/data.json'
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
      },
      currentPageId: state => {
        const page = pages.find(p => {return p.pageId === state.route.params.pageId})
        return pages.indexOf(page)
      },
      route: state => {
        return state.route
      }
    }
  })
}

export default createStore
