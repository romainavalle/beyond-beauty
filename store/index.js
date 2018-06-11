import Vuex from 'vuex'
import { pages } from '~/assets/data.json'
const createStore = () => {
  return new Vuex.Store({
    state: {
      currentHomeSlideId: -1,
      packer: null,
      isMenuOpen: false,
      isMenuVisible: false,
      isAppReady: false
    },
    mutations: {
      SET_CURRENT_HOME_SLIDE_ID (state, id) {
        state.currentHomeSlideId = id
      },
      SET_PACKER (state, packer) {
        state.packer = packer
      },
      SET_MENU_OPEN (state, bool){
        state.isMenuOpen = bool
      },
      SET_MENU_VISIBLE (state, bool){
        state.isMenuVisible = bool
      },
      SET_APP_READY (state){
        state.isAppReady = true
      }
    },
    actions: {
      setMenuOpen ({ commit }, bool) {
        commit('SET_MENU_OPEN', bool)
      },
      setMenuVisible ({ commit }, bool) {
        commit('SET_MENU_VISIBLE', bool)
      },
      setCurrentHomeSlideId ({ commit }, /*{ commit }, { app, isStatic }*/ id) {
        commit('SET_CURRENT_HOME_SLIDE_ID', id)
      },
      setPacker ({ commit }, packer) {
        commit('SET_PACKER', packer)
      },
      setAppReady ({ commit }) {
        commit('SET_APP_READY')
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
