<template>
  <div class="container-md total-movies-container">
    <div class="row d-flex">
      <div class="col-12 col-md-6"><h1 class="page-title d-inline-block fw-bold">영화 검색</h1>&nbsp;
        <span class="d-none d-md-inline-block fs-5">원하는 영화를 검색하세요!</span> 
      </div>
      <div class="col-12 col-md-6 d-flex justify-content-end search-btm-container align-self-end">
        <div class="d-flex align-items-center pointer" :class="{'is-selected':isSearchSelected}" @click="isSearchSelected = !isSearchSelected"><img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="" width="20px">검색</div>
        <div class="d-flex align-items-center pointer" :class="{'is-selected':isScrollView}" @click="selectScroll"><img src="@/assets/image/scrolling.png" alt="" width="30px" >스크롤보기</div>
        <div class="d-flex align-items-center pointer" :class="{'is-selected':isPageView}" @click="selectPage"><img src="@/assets/image/leftright.png" alt="" width="30px" >페이지보기</div>
      </div>
    </div>
    <div v-if="isSearchSelected" class="d-flex justify-content-end mt-3 align-items-center flex-wrap">
      <vs-button warn gradient :active="active == 3" @click="resetClick" class="reset-button">
        초기화
      </vs-button>
      <input id="searchInput" type="text" class="border my-0 me-2 px-2" placeholder="" @keyup.enter="setSearchText">
      <img class="pointer" @click="setSearchText" src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="" width="30px" height="30px">
    </div>
    <div class="fs-5 mt-2">원하는 장르를 선택하세요</div>
    <div class="d-flex justify-content-start mt-3 flex-wrap genres">
      <vs-switch class="mt-1 mx-1" :val="value[0]" v-model="selectedGenres" v-for="(value,idx) in genres" :key="idx">
        {{value[1]}}
      </vs-switch>
    </div>
    <hr>
      <scroll-movies-view v-if="isScrollView" :searchText="getSearchText" :selectedGenres="selectedGenres"/>
      <page-movies-view v-if="isPageView" :searchText="getSearchText" :selectedGenres="selectedGenres"/>
    
  </div>
</template>

<script>
import ScrollMoviesView from '@/components/TotalMoviesView/ScrollMoviesView.vue'
import PageMoviesView from '@/components/TotalMoviesView/PageMoviesView.vue'
import _ from 'lodash'
import Vue from 'vue'
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import axios from 'axios'
import drf from '@/api/drf'

Vue.use(Vuesax, {
  // options here
})
export default {
  components: { 
    ScrollMoviesView, 
    PageMoviesView,
    },
  name: 'TotalMovies',
  data(){
    return {
      isSearchSelected : false,
      isScrollView: true,
      isPageView:false,
      isGenreSelected : true,
      searchText:'',
      genres : [],
      selectedGenres : [],
      active : 2,
    }
  },
  computed : {
    getSearchText(){  
      return this.searchText
    },
    getGenres(){
      //console.log(_.size(this.genres))
      return _.size(this.genres)
    }
  },
  methods : {
    setSearchText(){
      this.searchText = document.querySelector('#searchInput').value
      // document.querySelector('#searchInput').value = ''
    },
    selectScroll(){
      if (this.isScrollView){
        return 
      }
      if (document.querySelector('#searchInput')){
        document.querySelector('#searchInput').value = ''
      }
      this.selectedGenres = []
      this.isScrollView = !this.isScrollView
      this.isPageView = !this.isPageView
      
    },
    selectPage(){
      if (this.isPageView){
        return 
      }
      if (document.querySelector('#searchInput')){
        document.querySelector('#searchInput').value = ''
      }
      this.selectedGenres = []
      this.isScrollView = !this.isScrollView
      this.isPageView = !this.isPageView
    },
    resetClick(){
      document.querySelector('#searchInput').value = ''
      this.searchText = ''
      this.selectedGenres = []
    }
  },
  created(){
    //장르 받아오기
    //const URL = "https://api.themoviedb.org/3/genre/movie/list"
    const URL = drf.movies.getGernes()
    axios({
      url:URL,
      headers : this.$store.getters.getAuthHeader,
    })
    .then(res => {
        res.data.forEach(genre => {
          this.genres.push([genre.pk,genre.fields.name])
        });
      })
    .catch(err => {console.log(err)})

    //console.log(this.$store.getters.getAllMovies.length)
    if (!this.$store.getters.getAllMovies.length){
      this.$store.dispatch('fetchAllMovies')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/TotalMoviesView/TotalMoviesView.scss';
</style>