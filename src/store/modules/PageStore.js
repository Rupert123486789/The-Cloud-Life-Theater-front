

export default {

  state: {
    isModal : false,
  },
  getters: {
    getIsModal(state){
      return state.isModal
    }
  },
  mutations: {
    SET_ISMODAL(state,info){
      state.isModal = info
    }
  },
  actions: {

    fetchIsModal({commit,getters}){
      commit('SET_ISMODAL',!getters.getIsModal)
    }
  },
}
