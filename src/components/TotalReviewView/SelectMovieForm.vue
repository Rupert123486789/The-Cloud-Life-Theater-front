<template>
  <div class="container-md total-movies-container">
    <div class="row d-flex ">
      <div class="col-12 col-md-6"><h1 class="page-title d-inline-block fw-bold">영화 검색</h1>&nbsp;
        <span class="d-none d-md-inline-block fs-5">리뷰를 원하는 영화를 선택해주세요!</span> 
      </div>
      <div class="col-12 col-md-6 d-flex justify-content-center search-btm-container align-self-end">
        <div class="d-flex align-items-center pointer" :class="{'is-selected':isSearchSelected}" @click="isSearchSelected = !isSearchSelected">
          <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="" width="20px">
          영화 이름을 입력하세요!
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-end mt-3 align-items-center flex-wrap">
      <vs-button dark gradient :active="active == 3" @click="resetClick" class="reset-button">
        초기화
      </vs-button>
      <input id="searchInput" type="text" class="border my-0 me-2 px-2" placeholder="" @keyup.enter="setSearchText">
      <vs-button shadow><img class="pointer" @click="setSearchText" src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="" width="30px" height="30px">
      </vs-button>
    </div>
    <div class="fs-5 mt-2">원하는 장르를 선택하세요</div>
    <div class="d-flex justify-content-start mt-3 flex-wrap genres">
      <vs-switch class="mt-1 mx-1" :val="value[0]" v-model="selectedGenres" v-for="(value,idx) in genres" :key="idx">
        {{value[1]}}
      </vs-switch>
    </div>
    <hr>
    <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 row-cols-xxl-6" id="select-movie-container">
    <div class="col curser-pointer" v-for="(movie,idx) in $vs.getPage(movies, page, max)" :key="idx" @click="modalClick(movie)">
    <vs-card type="2" >
      <template #title>
        <h3>{{movie.title}}</h3>
      </template>
      <template #img>
        <img :src="getMovieImg + movie.poster_path" onerror="this.src='https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'">
      </template>
      <template #text>
        <p></p>
      </template>
      <template #interactions>
        <div class="d-flex align-items-center">
          <vs-button class="btn-chat">
            <v-rating
              color="orange" length="1" readonly
              size="25" :value="5"
            ></v-rating>
            <span class="span fs-5 d-inline-block">
              {{movie.vote_average}}
            </span>
          </vs-button>
        </div>
      </template>
    </vs-card>
    </div> 
  </div>
  
  <div class="center my-5  d-flex justify-content-center">
    <div class="text-center" style="width:50%">
      <v-pagination  
        v-model="page" :length="$vs.getLength(movies, max)"
      ></v-pagination>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import drf from '@/api/drf'

export default {
  name: 'SelectMovieForm',
  data(){
    return {
      all_movies : [],
      movies : [],
      page: 1,
      max: 12,
      genres : [],
      searched_movies : [],
      selectedGenres : [],
      ModalSelected : false,
      isSearchSelected : false,
      isGenreSelected : true,
      searchText:'',
      active : 2,
    }
  },
  props : {
    create : Boolean,
    read : Boolean,
  },
  methods : {
    modalClick(movie){
      
      this.$emit('close-modal',false)
      if (this.create){
        this.$emit('create-select-complete',movie)
        this.$store.commit('SET_SELECTEDMOVIEFORREIVEW',movie)
        this.$router.push({name:'total_review_create', params : {movie_id: movie.id}})
      } else if(this.read){

        this.$emit('read-all-review-per-movie',movie.id)

      }
    },
    setSearchText(){
      this.searchText = document.querySelector('#searchInput').value
      // document.querySelector('#searchInput').value = ''
    },
    resetClick(){
      document.querySelector('#searchInput').value = ''
      this.searchText = ''
      this.selectedGenres = []
    },
  },
  watch : {
      page(){
        window.scrollTo(0,300)
        //window.scrollTo({top:0, left:300,behavior:'auto'})
      },
      searchText() {
        
        if(this.searchText === '' && !this.selectedGenres.length){
          this.movies = this.all_movies.slice()
          this.searched_movies = []
          return
        } else if(this.searchText === '' && this.selectedGenres.length){
          const temp_movies = []
          for (let i = 0 ; i < this.all_movies.length ; i++){
            for (let j = 0; j < this.all_movies[i].genres.length ; j++){
              if(this.selectedGenres.includes(this.all_movies[i].genres[j])){
                temp_movies.push(this.all_movies[i])
                this.searched_movies = []
                break
              }
            }
          }
          this.movies = temp_movies.slice()
          return 
        }

        if (!this.searched_movies.length){
          this.searched_movies = this.all_movies.filter((movie) => {
            return movie.title.indexOf(this.searchText) !== -1
          })
            this.movies = this.searched_movies.slice()
        } else {
          this.searched_movies = this.movies.filter((movie) => {
            return movie.title.indexOf(this.searchText) !== -1
          })
            this.movies = this.searched_movies.slice()
          
        }
        this.page = 1
    },
    selectedGenres(){
      if (this.searched_movies.length > 0){
        if (this.selectedGenres.length > 0) {
          const temp_movies = []
          for (let i = 0 ; i < this.searched_movies.length ; i++){
            for (let j = 0; j < this.searched_movies[i].genres.length ; j++){
              if(this.selectedGenres.includes(this.searched_movies[i].genres[j])){
                temp_movies.push(this.searched_movies[i])
                break
              }
            }
          }
          this.movies = temp_movies.slice()
        } else{
            this.movies = this.searched_movies.slice()
        }
      } else {
        
        if (this.searchText !== ''){
          if (this.selectedGenres.length > 0) {
            const temp_movies = []
            for (let i = 0 ; i < this.searched_movies.length ; i++){
              for (let j = 0; j < this.searched_movies[i].genres.length ; j++){
                if(this.selectedGenres.includes(this.searched_movies[i].genres[j])){
                  temp_movies.push(this.searched_movies[i])
                  break
                }
              }
            }
            this.movies = temp_movies.slice()
          } else{
            this.movies = this.searched_movies.slice()
          }
        }else{
          if (this.selectedGenres.length > 0) {
            const temp_movies = []
            
            
            for (let i = 0 ; i < this.all_movies.length ; i++){
              for (let j = 0; j < this.all_movies[i].genres.length ; j++){
                if(this.selectedGenres.includes(this.all_movies[i].genres[j])){
                  temp_movies.push(this.all_movies[i])
                  break
                }
              }
            }
            this.movies = temp_movies.slice()
          } else{
            
            this.movies = this.all_movies.slice()
          }

        }
        this.page = 1
      }
    },
  },
  computed : {
    getMovieImg(){
      return "http://image.tmdb.org/t/p/w300"
    }, getSearchText(){  
      return this.searchText
    },
    getGenres(){
      //console.log(_.size(this.genres))
      return _.size(this.genres)
    },
  },
  created(){
    if(!this.$store.getters.getAllMovies.length){
      this.$store.dispatch('fetchAllMovies')
    }

    this.all_movies = this.$store.getters.getAllMovies
    this.movies = this.$store.getters.getAllMovies

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
  }
}
</script>

<style lang='scss'>
@import '@/assets/scss/ReviewView/SelectMovieForm.scss';
</style>