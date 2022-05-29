<template>
  <div class="container total-review-per-movie-container">
    <div class="d-flex justify-content-center mb-3"><h1 class="review_title"><span class="movie-title">"{{getSelectedMovie.title}}"</span> 영화 리뷰 전체 조회</h1></div>
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
          <vs-tr class="review-detail-per-movie" @click="goReviewDetailPage(tr)"
            :key="i" v-for="(tr, i) in $vs.getPage(getAllorSelectedReviewData, page, max)" :data="tr">
            <vs-td>
              {{ tr.title }}
            </vs-td>
            <vs-td>
            {{ tr.user.username }}
            </vs-td>
            <vs-td>
            {{ i + 1 }}
            </vs-td>
          </vs-tr>
        </template>
        <template #footer>
          <vs-pagination v-model="page" :length="$vs.getLength(getAllorSelectedReviewData, max)" />
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
          <vs-input primary v-model="searchText" placeholder="검색어를 입력해주세요" />
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
</template>

<script>
import axios from 'axios';
import { mapGetters } from "vuex";
import drf from '@/api/drf';

export default {
  name: 'TotalReviewPerMovieView',
  props:{
    movie_id : Number,
  },
  methods : {
    goReviewDetailPage(review){
      this.$emit('go-review-detail',review.id)
      this.$store.commit('SET_SELECTEDREVIEWS',review)
    },
    getReviewData(){
      
      if (!this.searchText){
        this.isSearched = false
        this.selected_users = []
        return
      } else {
        this.isSearched = true
        this.selected_users = []
        const lower_searchText = this.searchText.toLowerCase()
        if (this.searchCondition === 'title'){
          this.users.forEach(user => {
            //console.log(user)
            if (user[this.searchCondition].toLowerCase().indexOf(lower_searchText) !== -1){
              this.selected_users.push(user)
            }
          });
        } else {
          this.users.forEach(user => {
            //console.log(user)
            if (user.user[this.searchCondition].toLowerCase().indexOf(lower_searchText) !== -1){
              this.selected_users.push(user)
            }
          });
        }
      }
    },
    setChangeSelect(event){
      this.searchCondition =  event.target.value
    }
  },
  computed : {
    ...mapGetters(['getSelectedMovie','getAuthHeader', ]),
    getAllorSelectedReviewData(){
      if (this.selected_users.length > 0 || (this.isSearched)){
        return this.selected_users
      } else {
        return this.users
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
      users : []
    }
  },
  created(){
    
    //처음 뷰 인스턴스를 생성할 때 바로 해당 영화정보를 기준으로 영화들을 조회해준다.
    axios({
      url : drf.review.allReviewsPerMovie(this.getSelectedMovie.id),
      headers : this.getAuthHeader,
      method : 'get',
    })
    .then(res => {
      //console.log(res.data)
      this.users = res.data
    })
    .catch (err => console.log(err))
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/TotalMoviesView/TotalReviewPerMovie.scss';
</style>