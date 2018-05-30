import Vuex from 'vuex'
import { pages } from '~/assets/data.json'
const createStore = () => {
  return new Vuex.Store({
    state: {
      currentHomeSlideId: -1,
      packer: null
    },
    mutations: {
      SET_CURRENT_HOME_SLIDE_ID (state, id) {
        state.currentHomeSlideId = id
      },
      SET_PACKER (state, packer) {
        state.packer = packer
      }
    },
    actions: {
      setCurrentHomeSlideId ({ commit }, /*{ commit }, { app, isStatic }*/ id) {
        commit('SET_CURRENT_HOME_SLIDE_ID', id)
      },
      setPacker ({ commit }, packer) {
        commit('SET_PACKER', packer)
      }
    },
    getters: {
      getURI: (state) => (id) => {
        return state.packer.getAsURI(id)
      },
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
