import drf from "@/api/drf"
import axios from "axios"

export default {
  state: {
    allComments : [],
    selectedComment : {},

  },
  getters: {
    getAllComments(state){
      //const reversed = [...state.allComments].reverse()
      //console.log(state.allComments)
      //console.log(reversed)
      return state.allComments
    },
    getSelectedComment(state){
      return state.selectedComment
    },
    getAllCommentsCnt(state){
      return state.allComments.length
    }
  },
  mutations: {
    SET_ALLCOMMENTS(state,comments){
      state.allComments = comments
    },
    SET_SELECTEDCOMMENT(state,comment){
      state.selectedComment = comment
    }
  },
  actions: {
    fetchAllComments({commit,getters},review_id){
      //console.log('지금읽은 글번호: ' + review_id)
      //axios통신 후 댓글들 state 집어넣는다.
      const URL = drf.review.getReviewComment(review_id)
      axios({
        url : URL,
        method : 'GET',
        headers : getters.getAuthHeader
      })
      .then(res => {
        //console.log(res)
        commit('SET_ALLCOMMENTS',res.data)
      })
      .catch(err => console.log(err))
    },
    
    createComment({commit,getters,dispatch}, {content,review_id}){
      //console.log(review_id)
      //비동기로 댓글을 만들고 정보받아온다
      //console.log('지금적은 글번호: ' + review_id)
      const data = {
        content,
      }
      axios({
        url : drf.review.CreateReviewComment(review_id),
        method : 'POST',
        headers : getters.getAuthHeader,
        data : data
      })
      .then(res => {
        commit('SET_SELECTEDCOMMENT',res.data)
        dispatch('fetchAllComments',review_id)
      })
      .catch(err => console.log(err))
            
      //댓글 생성 후 해당 영화의 전체 댓글 다시 받아옴
      //dispatch('fetchAllComments')
    },

    updateSelectedComment({commit,getters,dispatch},data){
      //비동기 통신으로 수정 후 데이터를 받아옴
      axios({
        url : drf.review.updateReviewComment(getters.getSelectedReview.id,getters.getSelectedComment.id),
        data : data,
        method : 'PUT',
        headers : getters.getAuthHeader,
      })
      .then(res => {
        //console.log(res.data)
        commit('SET_SELECTEDCOMMENT',res.data)
        dispatch('fetchAllComments',getters.getSelectedReview.id)
      })
      .catch(err => console.log(err))

    },
    deleteSelectedComment({commit,getters,dispatch}){
      
      ///비동기 통신으로 수정 후 데이터를 받아옴
      axios({
        url : drf.review.deleteReviewComment(getters.getSelectedReview.id,getters.getSelectedComment.id),
        method : 'DELETE',
        headers : getters.getAuthHeader,
      })
      .then(() => {
        commit('SET_SELECTEDCOMMENT',{})
        dispatch('fetchAllComments',getters.getSelectedReview.id)
      })
      .catch(err => console.log(err))
    },
  },

  
  
}