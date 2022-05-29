import drf from "@/api/drf"
import axios from "axios"


export default {
  state: {
    allMovieComments : [],
    selectedMovieComment : {},
  },
  getters: {
    getAllMovieComments(state){
      //const reversed = [...state.allMovieComments].reverse()
      return state.allMovieComments
    },
    getSelectedMovieComment(state){
      return state.selectedMovieComment
    },
    getAllMovieCommentsCnt(state){
      return state.allMovieComments.length
    }
  },
  mutations: {
    SET_ALLMOVIECOMMENTS(state,comments){
      state.allMovieComments = comments
    },
    SET_SELECTEMOVIEDCOMMENT(state,comment){
      state.selectedMovieComment = comment
    }
  },
  actions: {
    fetchAllMovieComments({commit,getters}, movie_id){
      //console.log('해당영화의 댓글들' + movie_id)
      //axios통신 후 댓글들 state 집어넣는다.
      //console.log(movie_id)
      axios({
        url : drf.movies.getMovieAllComments(movie_id),
        method : 'get',
        headers : getters.getAuthHeader
      })
      .then(res => {
        //const reversed = [...res.data].reverse()
        commit('SET_ALLMOVIECOMMENTS',res.data)
      })
    },
    
    createMovieComment({commit,getters, dispatch}, {content,rating }){
      //비동기로 댓글을 만들고 정보받아온다
      
      const axiosData = {
        content,
        rating,
      }
      //console.log(getters.getSelectedMovie.id)
      axios({
        url : drf.movies.createMovieComment(getters.getSelectedMovie.id),
        method : 'POST',
        data : axiosData,
        headers : getters.getAuthHeader
      })
      .then(res => {
        //이 부분 수정요망
        commit('SET_SELECTEMOVIEDCOMMENT',res.data)
        dispatch('fetchAllMovieComments', getters.getSelectedMovie.id)
      })
      .catch(err => console.log(err))

      
      //댓글 생성 후 해당 영화의 전체 댓글 다시 받아옴
      //dispatch('fetchAllMovieComments')
    },

    updateSelectedMovieComment({commit,getters},comment){
      //비동기 통신으로 수정 후 데이터를 받아옴
      //console.log(getters.getSelectedMovieComment)
      const URL = drf.movies.updateMovieComment(getters.getSelectedMovie.id,
        getters.getSelectedMovieComment.id)
      axios({
        url : URL,
        data : comment,
        method : 'PUT',
        headers : getters.getAuthHeader
      })
      .then(res => {
        //console.log(res.data)
        //이 부분 수정요망
        commit('SET_SELECTEMOVIEDCOMMENT',res.data)
      })
      .catch(err => console.log(err))
      
    },
    deleteSelectedMovieComment({commit,getters, dispatch}){
      
      //비동기로 삭제한다.
      const URL = drf.movies.deleteMovieComment(getters.getSelectedMovie.id,
        getters.getSelectedMovieComment.id)
      
        axios({
          url : URL,
          method : 'DELETE',
          headers : getters.getAuthHeader
        })
        .then(() => {
          //현재 선택된 댓글을 비워주고
          commit('SET_SELECTEMOVIEDCOMMENT',{})
          dispatch('fetchAllMovieComments', getters.getSelectedMovie.id)
        })
        .catch(err => console.log(err))

      
      //댓글 삭제 후 해당 영화의 전체 댓글 다시 받아옴
      //dispatch('fetchAllMovieComments')
    },
  },
  
}