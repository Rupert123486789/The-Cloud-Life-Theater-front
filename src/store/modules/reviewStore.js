import drf from "@/api/drf"
import router from "@/router"
import axios from "axios"


export default {
  state: {
    allReviews : [],
    selectedReview : {},
    selectedUsers: [],
    selectedMovieForReview : {},
    isUpdate : false,
    updatedReview : {},
    reviewLikeInfo : {},
  },
  getters: {

    getReviewLikeInfo(state){
      return state.reviewLikeInfo
    },

    getUpdatedReview(state){
      return state.updatedReview
    },
    getIsUpdate(state){
      return state.isUpdate
    },
    getAllReviews(state){
      return [...state.allReviews].reverse()
    },
    // 상세페이지로 넘아갈때 선택된애 구함
    getSelectedReview(state){
      return state.selectedReview
    },
    // 전체 영화 리뷰 목록 페이지에서 선택된 애들을 구함
    getSelectedUsers(state){
      return state.selectedUsers
    },
    getSelectedMovieForReview(state){
      return state.selectedMovieForReview
    }
  },
  mutations: {
    SET_REVIEW_LIKE_INFO(state,info){
      state.reviewLikeInfo = info
    },
    SET_UPDATEDREVIEW(state,review) {
      state.updatedReview = review
    },
    SET_ISUPDATE(state, bool){
      state.isUpdate = bool
    },
    SET_ALLREVIEWS(state, reviews){
      reviews.reverse()
      state.allReviews = reviews
    },
    SET_SELECTEDREVIEWS(state, review){
      state.selectedReview = review
    },
    SET_SELECTEDUSERS(state, review){
      state.selectedUsers = review
    },
    SET_SELECTEDMOVIEFORREIVEW(state,movie){
      state.selectedMovieForReview = movie
    }
  },
  actions: {

    ReviewLikeInfo({commit,getters},review_id){

      axios({
        url : drf.review.ReviewLikeInfo(review_id),
        method : 'get',
        headers : getters.getAuthHeader
      })
      .then(res => {
        let isLiked = false
        //console.log(res.data.like_users)

        
        for(let i = 0 ; i < res.data.like_users.length ; i++){
          if(res.data.like_users[i].username === getters.getCurrentUser.username){
            isLiked = true
            break
          }
        }
        
        const like_cnt = res.data.like_users.length

        const info = {isLiked,like_cnt,}
        commit('SET_REVIEW_LIKE_INFO',info)
      })
      .catch(err => console.log(err))
    },

    updateReview({commit,getters, dispatch}, data){
      
      axios({
        url : drf.review.reviewUpdate(getters.getSelectedReview.id),
        headers : getters.getAuthHeader,
        method : 'PUT',
        data : data
      })
      .then(res => {
        console.log(res.data)
        commit('SET_SELECTEDREVIEWS',res.data)
        dispatch('fetchAllReviews')
      })
      .catch(err => console.log(err))
    },

    createReview({commit,getters,},review){

      //console.log(getters.getSelectedMovieForReview)
      axios({
        url : drf.review.reviewCreate(getters.getSelectedMovieForReview.id),
        method : 'post',
        data : review,
        headers : getters.getAuthHeader
      })
      .then(res => {
        //console.log(res.data)
        commit('SET_SELECTEDREVIEWS',res.data)
        commit('SET_ALLCOMMENTS',[])    
        commit('SET_REVIEW_LIKE_INFO',{isLiked : false , like_cnt : 0})
      })
      .then(() => {
        router.push({name: 'total_review_detail',params : {review_id : getters.getSelectedReview.id}, query : {page:1}})
      })
      .catch(err => console.log(err))
      
    },

    deleteSelectedReviewModal({getters}){
      //axios통신으로 현재 선택된리뷰를 삭제한다.
      axios({
        url : drf.review.reviewDelete(getters.getSelectedReview.id),
        headers : getters.getAuthHeader,
        method : 'DELETE',
      })
      .then(() => {
        //commit('SET_SELECTEDREVIEWS',{})
        //dispatch('fetchAllReviews')
        
      })
      .catch(err => console.log(err))
      
    },

    deleteSelectedReview({getters,commit}){
      //axios통신으로 현재 선택된리뷰를 삭제한다.
      axios({
        url : drf.review.reviewDelete(getters.getSelectedReview.id),
        headers : getters.getAuthHeader,
        method : 'DELETE',
      })
      .then(() => {
        router.push({name:'total_review'})
        commit('SET_ALLCOMMENTS',[])   
      })
      .then(() => {
        //commit('SET_SELECTEDREVIEWS',{})
      })
      .catch(err => console.log(err))
      
    },
    fetchSelectedUsers({commit},user_review){
      commit('SET_SELECTEDUSERS',user_review)
    },
    fetchSelectedReview({commit,dispatch}, review){
      commit('SET_SELECTEDREVIEWS',review)
      dispatch('fetchAllComments',review.id)
    },
    fetchAllReviews({commit,getters}){
      axios({
        url:drf.review.allReviews(),
        method : 'GET',
        headers : getters.getAuthHeader,
      })
      .then(res => {
          commit('SET_ALLREVIEWS',res.data)
      })
      .catch(err => console.log(err))
    },
    fetchselectedMovieForReview({commit,dispatch,getters},movie_id){
      
      dispatch('fetchSelectedMovie',movie_id)
      commit('SET_SELECTEDMOVIEFORREIVEW',getters.getSelectedMovie)
    }
  },
  
}