<template>
  <div>
    <div class="container-md total-movies-container total-reviews-container">
      <div class="row d-flex">
        <div class="col-12 col-md-6">
          <h1 class="page-title d-inline-block fw-bold">리뷰 검색</h1>&nbsp;
          <span class="d-none d-md-inline-block fs-5">원하는 리뷰를 검색하세요!</span> 
        </div>
        <div class="col-12 col-md-6 d-flex justify-content-end align-items-end fs-3 flex-wrap">
          <vs-button v-show="isMovieSelected" transparent @click="resetAllSearch">
             전체 리뷰 검색으로 돌아가기
            </vs-button>
          <vs-tooltip border>
            <vs-button dark transparent @click="detailReviewSearch">
             특정 영화 리뷰 검색
            </vs-button>
            <template #tooltip>
              특정 영화에 대한 의견들을 확인하세요!
            </template>
          </vs-tooltip>
          <vs-tooltip border>
            <vs-button dark transparent @click="detailReviewCreate">
             영화 리뷰 쓰기
            </vs-button>
            <template #tooltip>
              관람한 영화에 대한 의견을 공유하세요!
            </template>
          </vs-tooltip>
        </div>
      </div>
      <vs-dialog scroll overflow-hidden not-close auto-width v-model="selectMovie" >
        <select-movie-form :create="create" :read="read" @close-modal="selectMovie = false"
        @read-all-review-per-movie="getReviewsOfMovie" @create-select-complete="createSelectComplete"/>
      </vs-dialog>
  <div class="container total-review-per-movie-container">
    <div class="center">
      <vs-table>
        <template #thead>
          <vs-tr>
            <vs-th>
              제목
            </vs-th>
            <vs-th>
              작성자
            </vs-th>
            <vs-th>
              Id
            </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr class="review-detail-per-movie" 
            :key="i" v-for="(tr, i) in $vs.getPage(getAllorSelectedReviewData, page, max)" :data="tr">
            <vs-td @click="goReviewDetailPage(tr)">
              {{ tr.title }}
            </vs-td>
            <vs-td @click="goToProfile(tr.user.username)">
            {{ tr.user.username }}
            </vs-td>
            <vs-td @click="goReviewDetailPage(tr)">
            {{ i + 1 }}
            </vs-td>
          </vs-tr>
        </template>
        <template #footer>
           <v-pagination
              v-model="page" :length="$vs.getLength(getAllorSelectedReviewData, max)" prev-icon="mdi-menu-left" next-icon="mdi-menu-right">
            </v-pagination>
        </template>
      </vs-table>
    </div>
    <hr>
    <form action="">
      <div class="review-search-container d-flex justify-content-center align-items-center flex-wrap">
        <div class="select-container mb-1">
          <select :v-model="searchCondition" @change="setChangeSelect" class="form-select form-select-sm" >
            <option value="username" selected>아이디</option>
            <option value="title" >제목</option>
          </select>
        </div>
        <div class="center content-inputs mb-1" id="search-input">
          <vs-input primary placeholder="검색어를 입력해주세요" @keydown.enter="setSearchText"/>
        </div>
        <div>
          <button @click.prevent="getReviewData">
            <v-icon large class="ms-1 search-icon">
              mdi-magnify
            </v-icon>
          </button>
        </div>
      </div>
    </form>
  </div>
  </div>
  </div>
</template>

<script>
import SelectMovieForm from '@/components/TotalReviewView/SelectMovieForm.vue'
import {mapGetters, mapActions} from 'vuex'
import axios from 'axios'
import drf from '@/api/drf'

export default {
  components: { SelectMovieForm, },
  name: 'TotalReviewsView',
  methods : {
    ...mapActions(['fetchAllReviews','fetchSelectedUsers','fetchselectedMovieForReview']),
    goToProfile(username){
      this.$store.dispatch('fetchProfile',username)
      this.$router.push({name:'my_page',params:{username: username}})
    },
    setSearchText(event){
      this.searchText = event.target.value
    },
    resetAllSearch(){
      this.isMovieSelected = false
      this.selected_users = []
      this.searchText = ''
      this.certain_selected_movie = []
      this.isSearched = false
      this.page = 1
    },
    getReviewsOfMovie(movie_id){
      this.isMovieSelected = true //영화 검색 여부를 true로 바꿔준다.
      this.page = 1
      //해당 영화에 맞는 모든 리뷰들을 보여준다.
      this.selected_users = []
      this.searchText = ''
      //this.fetchSelectedUsers([])
      axios({
        url : drf.review.allReviewsPerMovie(movie_id),
        method : 'get',
        headers : this.getAuthHeader
      })
      .then(res => {
        this.selected_users = res.data
      })
      .catch(err => console.log(err))
    },
    createSelectComplete(movie){
      //console.log(movie.id)
      this.resetAllSearch()
      this.fetchselectedMovieForReview(movie.id)
    },
    detailReviewCreate(){

      this.selectMovie = !this.selectMovie
      this.create = true
      this.read = false
    },
    detailReviewSearch(){
      this.selectMovie = !this.selectMovie
      this.create = false
      this.read = true

    },
    goReviewDetailPage(review){
      
      this.$store.dispatch('ReviewLikeInfo',review.id)
      this.$store.dispatch('fetchSelectedReview',review)
      
      this.$store.dispatch('fetchAllComments',review.id)
      this.fetchselectedMovieForReview(review.movie)
      this.$router.push({name : 'total_review_detail',params : {review_id : review.id} , query : {page : this.page}})
    },
    getReviewData(){
      
      //영화 선택이 되어있다면
      if(this.isMovieSelected){
        const lower_searchText = this.searchText.toLowerCase()
        this.certain_selected_movie = []
        if (this.searchCondition == 'title'){
          this.selected_users.forEach(user => {
            
            if (user[this.searchCondition].toLowerCase().indexOf(lower_searchText) !== -1){
              this.certain_selected_movie.push(user)
              
            }
          })
        } else{
          this.selected_users.forEach(user => {
            
            if (user.user[this.searchCondition].toLowerCase().indexOf(lower_searchText) !== -1){
              this.certain_selected_movie.push(user)
              
            }
          });
        }
        this.page = 1
        return
      }

      if (!this.searchText){
        this.isSearched = false
        this.selected_users = []
        //this.fetchSelectedUsers([])  
        return

      } else {
        this.isSearched = true
        this.selected_users = []
        //this.fetchSelectedUsers([])
        const lower_searchText = this.searchText.toLowerCase()
        
        if (this.searchCondition == 'title'){
          this.users.forEach(user => {
            
            if (user[this.searchCondition].toLowerCase().indexOf(lower_searchText) !== -1){
              this.selected_users.push(user)
              
            }
          })
        } else{
          this.users.forEach(user => {
            
            if (user.user[this.searchCondition].toLowerCase().indexOf(lower_searchText) !== -1){
              this.selected_users.push(user)
              
            }
          });
        }

      }
      this.page = 1
    },
    setChangeSelect(event){
      this.searchCondition =  event.target.value
    }
  },
  watch : {
    page(){
      
    }
  },
  computed : {
    ...mapGetters(['getAllReviews','getSelectedUsers', 'getAuthHeader']),
    getAllorSelectedReviewData(){
      
      if(this.isMovieSelected && this.searchText){
        
        return [...this.certain_selected_movie].reverse()
      } else if(this.isMovieSelected && !this.searchText){
        return [...this.selected_users].reverse()
      }
      else if (this.selected_users.length > 0 || (this.isSearched)){
        return [...this.selected_users].reverse()
      } else {
        return [...this.getAllReviews].reverse()
      }
    }
  },
  data() {
    return {
      searchText : '',
      searchCondition : 'username',
      page: 1,
      max: 9,
      isSearched : false,
      selected_users : [],
      certain_selected_movie : [],
      users: this.$store.getters.getAllReviews,
      selectMovie : false,
      create : false,
      read: false,
      isMovieSelected : false,
    }
  },
  created(){
    //console.log('전체리뷰 페이지 created 실행')
    this.fetchAllReviews()
    
    this.users = this.$store.getters.getAllReviews
    
    if(this.$route.query.page){
      this.page = parseInt(this.$route.query.page)
    } else {
      this.page = 1
    }
    
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/TotalMoviesView/TotalMoviesView.scss';
</style>
