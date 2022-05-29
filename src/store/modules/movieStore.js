
import drf from "@/api/drf";
import axios from "axios"

export default {
  state: {
    allMovies : [],
    selectedMovie : {},
    sameGenres : [],
    img_url : 'http://image.tmdb.org/t/p/w300',
    like_info : {},
    playlist_info:{},
    vote_average_movies : [],
    popularity_movies : [],
    adult_movies : [],
    like_order_movies : [],
    release_order_movies : [],
    pick_order_movies : [],
  },
  getters: {
    getRelease_order_movies(state){
      return state.release_order_movies
    },
    getPick_order_movies(state){
      return state.pick_order_movies
    },
    getVote_average_movies(state){
      return state.vote_average_movies
    },
    getPopularity_movies(state){
      return state.popularity_movies
    },
    getAdult_movies(state){
      return state.adult_movies
    },
    getLike_order_movies(state){
      return state.like_order_movies
    },
    getAllMovies(state){
      return state.allMovies
    },
    getPlaylist_info(state){
      return state.playlist_info
    },
    getLikeInfo(state){
      return state.like_info
    },
    getSelectedMovie(state) {
      return state.selectedMovie
    },
    getImg_url(state){
      return state.img_url
    },
    getSameGenres(state){
      return state.sameGenres
    }
  },
  mutations: {
    
    SET_RELEASE_ORDER_MOVIES(state,movies){
      state.release_order_movies = movies
    }
    ,
    SET_PICK_ORDER_MOVIES(state,movies){
      state.pick_order_movies = movies
    }
    ,
    SET_VOTE_AVERAGE_MOVIES(state,movies){
      state.vote_average_movies = movies
    },
    SET_POPULARITY_MOVIES(state,movies){
      state.popularity_movies = movies
    },
    SET_ADULT_MOVIES(state,movies){
      state.adult_movies = movies
    },
    SET_LIKE_ORDERS_MOVIES(state,movies){
      state.like_order_movies = movies
    },
    SET_ALLMOVIES(state, movies){
      state.allMovies = movies
    },
    SET_PLAYLIST_INFO(state,playlist){
      state.playlist_info = playlist
    },
    SET_LIKE_INFO(state,like_info){
      state.like_info = like_info
    },
    SET_SELECTEDMOVIE(state,movie){
      state.selectedMovie = movie
    },
    SET_SAMEGENRES(state, genres){
      state.sameGenres = genres
    }
  },
  actions: {
    
    
    fetchHomePageMovisLoading({dispatch}){
      dispatch('fetchVoteAverageMovies')
      dispatch('fetchPopularity_movies')
      dispatch('fetchAudultMovies')
      dispatch('fetchLike_order_movies')
      dispatch('fetchRelease_order_movies')
      dispatch('fetchPick_order_movies')
    },
    
  
    fetchRelease_order_movies({commit,getters}){
      axios({
        url: drf.movies.getAllMoviesOfType('release_date'),
        method : 'get',
        headers : getters.getAuthHeader
      })
      .then(res => {
        
        commit('SET_RELEASE_ORDER_MOVIES',res.data)
      })
      .catch(err => console.log(err))
    },

    fetchPick_order_movies({commit,getters}){
      axios({
        url: drf.movies.getAllMoviesOfType('pick_cnt'),
        method : 'get',
        headers : getters.getAuthHeader
      })
      .then(res => {
        
        commit('SET_PICK_ORDER_MOVIES',res.data)
      })
      .catch(err => console.log(err))
    },

    fetchLike_order_movies({commit,getters}){
      axios({
        url: drf.movies.getAllMoviesOfType('like_cnt'),
        method : 'get',
        headers : getters.getAuthHeader
      })
      .then(res => {
        
        commit('SET_LIKE_ORDERS_MOVIES',res.data)
      })
      .catch(err => console.log(err))
    },

    fetchAudultMovies({commit,getters}){
      axios({
        url: drf.movies.getAllMoviesOfType('adult'),
        method : 'get',
        headers : getters.getAuthHeader
      })
      .then(res => {
        
        commit('SET_ADULT_MOVIES',res.data)
      })
      .catch(err => console.log(err))
    },

    fetchVoteAverageMovies({commit,getters}){
      axios({
        url: drf.movies.getAllMoviesOfType('vote_average'),
        method : 'get',
        headers : getters.getAuthHeader
      })
      .then(res => {
        
        commit('SET_VOTE_AVERAGE_MOVIES',res.data)
      })
      .catch(err => console.log(err))
    },

    fetchPopularity_movies({commit,getters}){
      axios({
        url: drf.movies.getAllMoviesOfType('popularity'),
        method : 'get',
        headers : getters.getAuthHeader
      })
      .then(res => {
        
        commit('SET_POPULARITY_MOVIES',res.data)
      })
      .catch(err => console.log(err))
    },

    fetchPlaylistInfo({commit,getters}){
      axios({
        url : drf.movies.MoviePickUser(getters.getSelectedMovie.id),
        method: 'get',
        headers : getters.getAuthHeader
      })
      .then(res => {
        let isLiked = false
        for (let i = 0 ; i < res.data.pick_users.length ; i++){
          if(res.data.pick_users[i].pk === getters.getCurrentUser.pk){
            isLiked = true
            break
          }
        }
        commit('SET_PLAYLIST_INFO',{
          isLiked,
        })
      })
    },

    fetchLikeInfo({commit,getters}){
      
      //좋아요 개수 받아오기
    axios({
      url: drf.movies.likeUsersInfo(getters.getSelectedMovie.id),
      method: 'get',
      headers : getters.getAuthHeader
    })
    .then(res => {
        let isLiked = false
        let liked_cnt = 0
        for (let i = 0 ; i < res.data.like_users.length ; i++){
          if(res.data.like_users[i].pk === getters.getCurrentUser.pk){
            isLiked = true
          }
          liked_cnt++
        }
      
        commit('SET_LIKE_INFO',{
          isLiked,
          liked_cnt
        })
      }
    )
    .catch(err => console.log(err))
    },
    //모든 영화정보를 받아온다.
    fetchAllMovies({commit, getters}){
      const Url = drf.movies.allMovies()

      axios({
      url:Url,
      method: 'get',
      headers : getters.getAuthHeader
    })
    .then(res => {
      //console.log(res.data)
      commit('SET_ALLMOVIES',res.data)
    })
    .catch(err => {console.log(err)})
    },

    //특정 영화를 선택영화로 설정한다
    fetchSelectedMovie({commit, getters, dispatch},movie_id){
      //console.log(movie_id + '여기는 설정값')
      const Url = drf.movies.selectedMovie(movie_id)
      //console.log('여기실행?')
      axios({
      url:Url,
      method: 'get',
      headers : getters.getAuthHeader
    })
    .then(res => {
      
      commit('SET_SAMEGENRES',res.data.same_genre)
      commit('SET_SELECTEDMOVIE',res.data.movie[0])
      commit('SET_SELECTEDMOVIEFORREIVEW',getters.getSelectedMovie)
      dispatch('fetchAllMovieComments', movie_id)
      dispatch('fetchLikeInfo')
      dispatch('fetchPlaylistInfo') 
    })
    .catch(err => {console.log(err)})
    },
  }
}