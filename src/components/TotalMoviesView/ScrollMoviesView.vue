<template>

<div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 row-cols-xxl-6">
  <div class="col curser-pointer" v-for="(movie,idx) in (getMoviesPerScroll)" :key="idx" @click="modalClick">
    <div class="card-box-custom">
      <img :src="getMovieImg + movie.poster_path" class="card-img-top" 
      onerror="this.src='https://beawesomelife.kr/wp-content/themes/easymag/images/no-image.png'" 
      height="410px" @click="setSelectedMovie(movie.id)">
      <div class="card-body">
        <div class="card-title-container"><h5 class="card-title">{{movie.title}}</h5></div>
        <div class="card-title">평점: <span class="rated_content">{{movie.vote_average}} 
          <v-rating v-model="movie.vote_average" background-color="orange lighten-3" color="orange"
            dense half-increments size="15" readonly class="d-inline"/></span></div>
      </div>
    </div>
  </div>
   <vs-checkbox loading v-model="isLoading" v-if="!isEnd">
        Loading.... please wait.....
  </vs-checkbox>

   <!-- 모달창 구현-->
    <div class="modal_custom" v-if="ModalSelected">
      <div class="modal_custom__window">
        <detail-movie-view :selectedMovie="this.$store.getters.getSelectedMovie"
        @update-detail-movie="updateDetailPage"/>
      </div>
      <div class="modal_custom__overlay" @click.self="modalClick"></div>
    </div>

</div>
</template>

<script>
import DetailMovieView from '@/views/DetailMovieView.vue'

export default {
  components: { DetailMovieView },
  name:'ScrollMoviesView',
  data(){
    return {
      all_movies : [],
      movies : [],
      searched_movies : [],
      limit: 20,
      isLoading:false,
      isEnd:true,
      ModalSelected : false,
      selectedMovie : this.$store.getters.getSelectedMovie,
    }
  },
  props : {
    searchText : String,
    selectedGenres : Array,
  },
  computed : {
    getMovieImg(){
      return "http://image.tmdb.org/t/p/w300"
    },
     getMoviesPerScroll(){
      return this.movies.slice(0, this.limit)
    },
    getSearchedMovies(){
      return this.searched_movies
    }
  },
  methods : {
    updateDetailPage(){
      this.ModalSelected = false
      setTimeout(() => {
        this.ModalSelected = true
      },500)
      
    },
    setSelectedMovie(movie_id){
       //비동기로 해당 영화에 대한 정보를 가져온다.
      this.$store.dispatch('fetchSelectedMovie',movie_id)
      this.$store.dispatch('fetchselectedMovieForReview',movie_id)
      this.selectedMovie = this.$store.getters.getSelectedMovie
      //this.$store.dispatch('fetchAllMovieComments', this.$store.getters.getSelectedMovie.id)
    },
    modalClick(){
      this.ModalSelected = !this.ModalSelected
      if (this.ModalSelected){
        document.querySelector('html').classList.add('not-scroll')
      }else{
        document.querySelector('html').classList.remove('not-scroll')
      }
    },
    infiniteHandler() {
      // console.log('window.scrollY',window.scrollY)
      // console.log('window.innerHeight',window.innerHeight)
      // console.log('document.body.offsetHeight',document.body.offsetHeight)
      //console.log(window.scrollY + window.innerHeight >= document.body.offsetHeight)
      this.isEnd = false
      if (this.limit <= this.movies.length){
        if(window.scrollY + window.innerHeight >= document.body.offsetHeight){
          //console.log('여기')
          this.isEnd = false
          this.isLoding = true
          setTimeout(() => {
            this.limit += 5
            this.isLoading = false
            this.isEnd = true
          },300)
        }
        console.log('여기2')
      }else{
        this.isLoding = false
        this.isEnd = true
      }
    },
  },
  watch : {
      searchText() {
        //console.log(this.selectedGenres)
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

      }
    },
  },
  created(){
    if(!this.$store.getters.getAllMovies.length){
      this.$store.dispatch('fetchAllMovies')
    }

      this.movies = this.$store.getters.getAllMovies
      this.all_movies = this.$store.getters.getAllMovies
  },
  mounted(){
    document.addEventListener('scroll',this.infiniteHandler)
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/TotalMoviesView/TotalMoviesView.scss';
</style>