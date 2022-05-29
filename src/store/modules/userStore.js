import router from "@/router"
import axios from "axios"
import drf from "@/api/drf"


export default {
  state: {
    token: localStorage.getItem('token') || '',
    currentUser : {},
    profile : {},
    authError : null,
    likedTendency : {},
    fllowings_info : {},
    returnPageInfo : '',
  },
  getters: {
    getReturnPageInfo(state){
      return state.returnPageInfo
    },
    getFollowings_info(state){
      return state.fllowings_info
    },
    getIsLoggedIn: state => !!state.token,
    getCurrentUser: state => state.currentUser,
    getProfile: state => state.profile,
    getAuthError: state => state.authError,
    getAuthHeader: state => ({ Authorization: `Token ${state.token}`}),
    getLikedTendency: state => state.likedTendency
  },
  mutations: {
    SET_RETURN_PAGE_INFO(state,info){
      state.returnPageInfo = info
    },
    SET_FOLLOWINGS_INFO(state,info){
      state.fllowings_info = info
    },
    SET_TOKEN: (state, token) => state.token = token,
    SET_CURRENT_USER: (state, user) => state.currentUser = user,
    SET_PROFILE: (state, profile) => state.profile = profile,
    SET_AUTH_ERROR: (state, error) => state.authError = error,
    SET_LIKEDTENDENCY : (state, likedTendency) => state.likedTendency = likedTendency
  },
  actions: {
    
    fetchFollowingsInfo({commit,getters},username){
      axios({
        url:drf.accounts.followInfo(username),
        headers : getters.getAuthHeader,
        method : 'GET'
      })
      .then(res => {
        
        let isFollowed = false
        res.data.followers.forEach(user => {
          if(user.username === getters.getCurrentUser.username){
            isFollowed = true
          } 
        })
        res.data.isFollowed = isFollowed
        //console.log(res.data.isFollowed)
        commit('SET_FOLLOWINGS_INFO',res.data)
      })
      .catch(err => console.log(err))
    },

    Follow({getters,dispatch},username){
      axios({
        url:drf.accounts.follow(username),
        headers : getters.getAuthHeader,
        method : 'POST'
      })
      .then(res => {
        dispatch('fetchFollowingsInfo',res.data.data.split('님')[0])
      })
      .catch(err => console.log(err))
    },

    fetchLikedTendency({commit},like_movies){
      
      
      const labels = [
        '액션', '모험', '애니메이션', '코미디', '범죄', '다큐멘터리', '드라마','가족', 
        '판타지', '역사', '공포', '음악', '미스터리', '로맨스', 'SF', 'TV 영화', '스릴러', '전쟁', '서부'
      ]
      
      
      const likedTendencyDict = {}
      labels.forEach(label => {
        likedTendencyDict[label] = 0
      })
      
      like_movies.forEach(movie => {
        movie.genres.forEach(genre => {
          likedTendencyDict[genre.name] += 1
        })
      })

      const data = []
      let max_name = []
      let min_name = []
      let max = 0
      let min = 1000000000
      for (let i = 0 ; i < labels.length ; i++){
        data.push(likedTendencyDict[labels[i]])
        if (max < likedTendencyDict[labels[i]]){
          max = likedTendencyDict[labels[i]]
          max_name = [labels[i]]
        
        } else if (max === likedTendencyDict[labels[i]]){
          max_name.push(labels[i]) 
        }
        else if(min > likedTendencyDict[labels[i]]){
          min = likedTendencyDict[labels[i]]
          min_name = [labels[i]]
        } else if (min === likedTendencyDict[labels[i]]){
          min_name.push(labels[i]) 
        }
      }

      //console.log(data)
      let sendData = {}
      if (like_movies.length === 0){
        sendData = {
          data : data,
          max_name : '',
          min_name : ''
        }
      } else {
        sendData = {
          data : data,
          max_name : max_name,
          min_name : min_name,
        }
      }

      commit('SET_LIKEDTENDENCY', sendData)
      //console.log(getters.getProfile)
      //router.push({name:'my_page',params:{username: getters.getProfile.username}, query : {tendency:this.getLikedTendency}})

    },

    saveToken({commit}, token){
      commit('SET_TOKEN', token)
      
      localStorage.setItem('token', token)
      //console.log(localStorage.getItem('token'))
    },

    removeToken({ commit }){
      commit('SET_TOKEN', '')
      localStorage.setItem('token', '')
    },

    //현재 유저 정보 설정
    fetchCurrentUser({commit,getters,dispatch}){
      
      //현재 로그인이 되어있다면(토큰이 있다면)
      if(getters.getIsLoggedIn){
        
        axios({
          url : drf.accounts.currentUserinfo(), //현재 유저 정보를 받아야한다.
          method : 'get',
          headers : getters.getAuthHeader,
        })
        .then (res => commit('SET_CURRENT_USER', res.data))
        .catch (err => {
          //401에러 -> 서버가 누군지 모른다.(즉, 잘못된 토큰)
          if(err.response.status === 401){
            dispatch('removeToken')
            router.push({name: 'login'})
          }
        })
      }
    },
    
     
    

    //로그인 처리
    login({commit,dispatch,getters},login_info){
      
      //비동기 통신으로 서버에 보낸다.
      axios({
        url : drf.accounts.login(),
        method : 'post',
        data : login_info
      })
      .then(res => { //res 토큰이 넘어옴
        const token = res.data.key 
        
        dispatch('saveToken',token) //토큰 저장
        dispatch('fetchCurrentUser') // 현재 유저정보를 업데이트
        if(getters.getReturnPageInfo){
          router.push({ name: getters.getReturnPageInfo })
          commit('SET_RETURN_PAGE_INFO','')
        } else {
          router.push('/')
        }
      })
      .catch(err => {
        //console.log(err.response.data)
        alert(err.respone.data)
        commit('SET_AUTH_ERROR',err.response.data)
      })
    },
    //회원가입 요청
    signUp({commit, dispatch}, signUp_info){
      
      axios({
        url : drf.accounts.signup(),
        method: 'post',
        data: signUp_info,
      })
      .then(res => {
        const token = res.data.key
        dispatch('saveToken', token) //토큰저장
        dispatch('fetchCurrentUser') //현재유저 업데이트
        
        router.push({name:'home'})
      })
      .catch(error => {
        console.log(error)
        commit('SET_AUTH_ERROR',error.response.data)
      })
    },
    //로그아웃
    logout({getters,dispatch}){
      axios({
        url : drf.accounts.logout(),
        method : 'post',
        headers: getters.getAuthHeader
      })
      .then(() => {
        dispatch('removeToken')
        // alert('성공적으로 logout!')
        router.push({name:'login'})
      })
      .catch(err => {
        console.log(err)
      })
    },

    
    //프로필 정보 가져오기
    fetchProfile({commit, getters, dispatch}, username){
      
      axios({
        url : drf.accounts.getUserProfieInfo(username),
        method: 'get',
        headers : getters.getAuthHeader
      })
      .then(res => {
        commit('SET_PROFILE',res.data)
        
        dispatch('fetchLikedTendency',res.data.like_movies)
        dispatch('fetchFollowingsInfo',res.data.username)
      })
      .catch(err => {
        console.log(err)
      })
    },

    //프로필 정보 수정
    updateFrofile({commit, getters, dispatch}, name){

      console.log(getters.getCurrentUser)
      //front에서 user_id, 변경된이름
      //현재 유저 
      const data = {
        first_name : name, //변경하고자하는이름
      }
      axios({
        url : drf.accounts.updateUsername(getters.getCurrentUser.username),
        method : 'put',
        headers : getters.getAuthHeader,
        data : data
      })
      .then(res => {
        dispatch('fetchProfile', getters.getCurrentUser.username)
        commit('SET_PROFILE',res.data)
      })
      .catch(err => {
        console.log(err)
      })
      
    }
  },
}