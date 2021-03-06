import Vuex from 'vuex'
import data  from '~/assets/data.json'
if(process.browser){
  var sniffer = require('sniffer')
}
const createStore = () => {
  return new Vuex.Store({
    state: {
      currentHomeSlideId: -1,
      packer: null,
      isMenuOpen: false,
      isMenuVisible: false,
      isMenuCompletlyVisible: false,
      isAppReady: false,
      isAppLoaded: false,
      isCanvasVisible: true,
      isPageTransition: false,
      intro: data.intro,
      pages: data.pages,
      currentFact: 2,
      muteSound: false,
      isMobile: null
    },
    mutations: {
      TOGGLE_SOUND (state) {
        state.muteSound = !state.muteSound
      },
      SET_CURRENT_FACT (state, id) {
        state.currentFact = id
      },
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
      SET_MENU_COMPLETLY_VISIBLE (state, bool){
        state.isMenuCompletlyVisible = bool
      },
      SET_APP_READY (state){
        state.isAppReady = true
      },
      SET_APP_LOADED (state){
        state.isAppLoaded = true
      },
      SET_CANVAS_VISIBLE (state, bool){
        state.isCanvasVisible = bool
      },
      SET_PAGE_TRANSITION (state, bool){
        state.isPageTransition = bool
      },
      CHECK_MOBILE(state) {
        state.isMobile = sniffer && sniffer.isPhone ? true : false
      }
    },
    actions: {
      toggleSound ({ commit }) {
        commit('TOGGLE_SOUND')
      },
      setCurrentFact ({ commit }, id) {
        commit('SET_CURRENT_FACT', id)
      },
      setMenuOpen ({ commit }, bool) {
        commit('SET_MENU_OPEN', bool)
      },
      setMenuVisible ({ commit }, bool) {
        commit('SET_MENU_VISIBLE', bool)
      },
      setMenuCompletlyVisible ({ commit }, bool) {
        commit('SET_MENU_COMPLETLY_VISIBLE', bool)
      },
      setCurrentHomeSlideId ({ commit }, /*{ commit }, { app, isStatic }*/ id) {
        commit('SET_CURRENT_HOME_SLIDE_ID', id)
      },
      setPacker ({ commit }, packer) {
        commit('SET_PACKER', packer)
      },
      setAppReady ({ commit }) {
        commit('SET_APP_READY')
      },
      setAppLoaded ({ commit }) {
        commit('SET_APP_LOADED')
      },
      setCanvasVisible ({ commit }, bool) {
        commit('SET_CANVAS_VISIBLE', bool)
      },
      setPageTransition ({ commit }, bool) {
        commit('SET_PAGE_TRANSITION', bool)
      },
      checkMobile ({commit}) {
        commit('CHECK_MOBILE')
      }
    },
    getters: {
      getURI: (state) => (id) => {
        return state.packer.getAsURI(id)
      },
      currentPageIdNum: state => {
        const page = state.pages.find(p => {return p.pageId === state.route.params.pageId})
        return state.pages.indexOf(page)
      },
      currentPageId: (state, getters) => {
        return getters.currentPageIdNum !== -1 ? state.pages[getters.currentPageIdNum].id : null
      },
      nextPageIdNum: (state, getters) => {
        let pageIdNum = getters.currentPageIdNum + 1
        if(pageIdNum > 3)pageIdNum = 0
        return pageIdNum
      },
      getPageIdNum: (state, getters) => (id) => {
        const page = state.pages.find(p => {return p.pageId === id})
        return state.pages.indexOf(page)
      },
      pageData: (state, getters) => {
        return state.pages[getters.currentPageIdNum]
      },
      isMobile:(state) => {
        return state.isMobile
      },
      isTablet:(state) => {
        return sniffer ? sniffer.isTablet : false
      }
    }
  })
}

export default createStore
