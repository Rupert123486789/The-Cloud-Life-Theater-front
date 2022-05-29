<template>
  <v-app id="app">
    <navbar-view />
    <keep-alive>
      <router-view />
    </keep-alive> 
  </v-app>
</template>
<script>
import axios from 'axios'

import NavbarView from './components/NavbarView.vue'
import drf from './api/drf'
export default {
  name: 'App',
  components : {
    NavbarView,
  },
  data(){
    return{
      
    }
  },
  created(){
    // 전체영화 목록 가져오기
    this.$store.dispatch('fetchAllMovies')
    //console.log(this.$store.getters.getCurrentUser)
    //현재 유저 방문횟수 업데이트
    if(this.$store.getters.getCurrentUser.username){
      axios({
        url: drf.movies.setVisitCount(this.$store.getters.getCurrentUser.username),
        headers : this.$store.getters.getAuthHeader,
        method : 'GET',
      })
      .then(() => {
        //console.log('방문처리 완료')
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss">
 @import '@/assets/scss/TotalVuesaxCustom.scss';
 @import '@/assets/scss/Totalscss.scss';
</style>
