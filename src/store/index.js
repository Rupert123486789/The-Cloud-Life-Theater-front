import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import userStore from './modules/userStore'
import movieStore from './modules/movieStore'
import reviewStore from './modules/reviewStore'
import reviewCommentStore from './modules/reviewCommentStore'
import movieCommentStore from './modules/movieCommentStore'
import createPersistedState from "vuex-persistedstate"; 
import PageStore from './modules/PageStore'

export default new Vuex.Store({

  plugins: [
    createPersistedState({
      paths: ['userStore','movieStore', 'reviewStore'],
    }
  )], 

  state: {

  },
  getters: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    userStore,
    movieStore,
    reviewStore,
    reviewCommentStore,
    movieCommentStore,
    PageStore,
  }
})
