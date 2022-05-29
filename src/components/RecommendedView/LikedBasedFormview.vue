<template>
  <div class="like-based-form-container container d-flex flex-column align-items-center">
    <div class="recommended-explation d-flex flex-column align-items-center" :class="{'margin-custom-top' : !isSelected}">
      <div class="fs-2 sub-title text-center" style="color:#646FD4;">좋아요 기반 추천이란?</div>
      <div class="fs-4 text-center text-container my-3">사용자의 영화 좋아요 데이터를 기반으로 장르,인기도,투표수 등을 종합적으로 고려하여 관련 영화를 추천하는 알고리즘입니다. 또한 
        좋아요를 누르지 않은 데이터들을 분석하여 그 중 가장 좋아할 만한 영화를 추천하는 서비스입니다. </div>
      <vs-button transparent :active="false" @click="getData">
        버튼을 눌러 확인하기
      </vs-button>
    </div>
    <div v-if="isSelected">
    <div class="d-flex mt-5 flex-column align-items-center flex-wrap justify-content-start like-result-container p-3">
      <div class="text-center fs-1 fw-bold mb-2" style="color:#242F9B;" >1. 좋아요 기반 추천 영화</div>
      <div class="text-center fs-2">분석결과 사용자가 가장 좋아하는 장르는<span class="fw-bold" style="color : #001D6E">{{max_liked_data}}</span> 입니다.</div>
      <div class="d-flex flex-wrap my-3">
          <vs-card v-for="(card,idx) in getTotal_liked_data" @click="modalClick(card.id)" :key="idx" class="mx-2">
            <template #title>
              <h3 class="fw-bold">{{card.title}}</h3>
            </template>
            <template #img>
              <img :src="getImg_url + card.poster_path" alt="">
            </template>
            <template #text>
              <p class="my-0"> 
                평점: <span class="ms-1 fs-3 fw-bold" style="color:#CE9461;">{{card.vote_average}}</span>
              </p>
            </template>
            <template #interactions>
              
            </template>
          </vs-card>
        
      </div>
      <div class="fs-2 text-center">분석결과 결과를 바탕으로 다음 횟수와 같이 장르가 추천되었습니다.<span class="fw-bold d-block" style="color:#001D6E;">{{getSorted_isLiked}}</span></div>
    </div>
    
    <div class="d-flex mt-5 flex-column align-items-center flex-wrap justify-content-start like-result-container p-3">
      <div class="text-center fs-1 fw-bold mb-2" style="color:#242F9B;">2. 비-좋아요 기반 추천 영화</div>
      <div class="text-center fs-2">분석결과 사용자가 선호하지 않는 장르는<span class="fw-bold" style="color : #001D6E">{{getMax_disLiked_data}}</span> 입니다.</div>
      <div class="d-flex flex-wrap my-3">
          <vs-card v-for="(card,idx) in getTotal_disLiked_data" @click="modalClick(card.id)" :key="idx" class="mx-2">
            <template #title>
              <h3 class="fw-bold">{{card.title}}</h3>
            </template>
            <template #img>
              <img :src="getImg_url + card.poster_path" alt="">
            </template>
            <template #text>
              <p class="my-0"> 
                평점: <span class="ms-1 fs-3 fw-bold" style="color:#CE9461;">{{card.vote_average}}</span>
              </p>
            </template>
            <template #interactions>
              
            </template>
          </vs-card>
        
      </div>
      <div class="fs-2 text-center">분석결과 결과를 바탕으로 다음 횟수와 같이 장르가 추천되었습니다.<span class="fw-bold d-block" style="color:#001D6E;">{{getSorted_disLiked}}</span></div>
    </div>
    
    </div>

    <!-- 모달창 구현-->
    <div class="modal_custom" v-if="modalState">
      <div class="modal_custom__window">
        <detail-movie-view :selectedMovie="this.$store.getters.getSelectedMovie" 
        @update-detail-movie="updateDetailPage"/>
      </div>
      <div class="modal_custom__overlay" @click.self="modalCheck"></div>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
import drf from '@/api/drf'
import { mapGetters } from "vuex";
import DetailMovieView from '@/views/DetailMovieView.vue';

export default {
  components: { DetailMovieView },
  name: 'LikedBasedFormview',
  data() {
    return {
      total_liked_data : [],
      total_disliked_data : [],
      isLiked : [],
      disLiked : [],
      isLiked_data : {},
      max_liked_data : [],
      disLiked_data : {},
      max_disLiked_data : [],
      modalState : false,
      isSelected : false,
      percent : 0,
      sorted_isLiked : [],
      sorted_disLiked : [],
    }
  },
  computed : {
    ...mapGetters(['getCurrentUser', 'getAuthHeader', 'getImg_url']),
    getSorted_isLiked(){
      return this.sorted_isLiked
    },
    getSorted_disLiked(){
      return this.sorted_disLiked
    },
    getIsLiked_data(){
      return this.isLiked_data
    },
    getMax_liked_data(){
      return this.max_liked_data
    },
    getDisLiked_data(){
      return this.disLiked_data
    },
    getMax_disLiked_data(){
      return this.max_disLiked_data
    },
    getTotal_liked_data(){
      return this.total_liked_data
    },
    getTotal_disLiked_data(){
      return this.total_disliked_data
    }
  },
  methods : {
    openLoading() {
      
      const loading = this.$vs.loading({
        percent: this.percent
      })
      const interval = setInterval(() => {
        if (this.percent <= 100) {
          loading.changePercent(`${this.percent++}%`)
        }
      },20)
      setTimeout(() => {
        loading.close()
        clearInterval(interval)
        this.percent = 0
        this.isSelected = true
      }, 2800)
    },

    updateDetailPage(){
      this.modalState = false
      setTimeout(() => {
        this.modalState = true
      },400)
      
    },
    modalCheck(){
      this.modalState = !this.modalState

      if (this.modalState){
        document.querySelector('html').classList.add('not-scroll')
      }else{
        document.querySelector('html').classList.remove('not-scroll')
      }
    },

    openNotification(position = null, color) {
          this.$vs.notification({
            color,
            position,
            title: '이미 데이터가 분석되었습니다.',
            text: '서버 과부화를 막기위한 조치입니다...'
          })
        },
    modalClick(movie_id){
    this.$store.dispatch('fetchSelectedMovie',movie_id)
    .then(() => {
      this.modalState = !this.modalState
      
      if (this.modalState){
        document.querySelector('html').classList.add('not-scroll')
      }else{
        document.querySelector('html').classList.remove('not-scroll')
      }
    })
  },
    getData(){
      
      if(this.isSelected){
        this.openNotification('top-center','danger')
        return
      }

      this.openLoading()

      //this.isSelected = !this.isSelected
      
      
      this.isLiked_data = {},
      this.max_liked_data = [],
      this.disLiked_data = {},
      this.max_disLiked_data = [],
      //좋아요 기반 요청
      axios({
        url : drf.movies.getLikedBasedRecommended(this.getCurrentUser.username),
        headers : this.getAuthHeader,
        method : 'get'
      })
      .then(res => {
        this.total_liked_data = res.data
        res.data.forEach(movie => {
          movie.genres.forEach(genre => {
            if (this.isLiked_data[genre.name]){
              this.isLiked_data[genre.name] += 1
            } else {
              this.isLiked_data[genre.name] = 1
            }
          })
        });
        this.sorted_isLiked = []
      for(let name in this.isLiked_data){
        this.sorted_isLiked.push([name,this.isLiked_data[name]])
      }

      this.sorted_isLiked.sort(function(a,b){
        return b[1] - a[1]
      })
      //console.log(sorted_disLiked)
      for (let i = 0 ; i < this.sorted_isLiked.length - 1 ; i++){
        this.max_liked_data.push(this.sorted_isLiked[i][0])
        if (this.sorted_isLiked[i][1] !== this.sorted_isLiked[i + 1][1]){
          break
        }
      }
      })
      .catch(err => console.log(err))

      //비 좋아요 기반 요청
      axios({
        url : drf.movies.getdisLikedBasedRecommended(this.getCurrentUser.username),
        headers : this.getAuthHeader,
        method : 'get'
      })
      .then(res => {
        this.total_disliked_data = res.data
        res.data.forEach(movie => {
          movie.genres.forEach(genre => {
            if (this.disLiked_data[genre.name]){
              this.disLiked_data[genre.name] += 1
            } else {
              this.disLiked_data[genre.name] = 1
            }
          })
        });
         this.sorted_disLiked = []
      for(let name in this.disLiked_data){
        this.sorted_disLiked.push([name,this.disLiked_data[name]])
      }

      this.sorted_disLiked.sort(function(a,b){
        return b[1] - a[1]
      })
      //console.log(sorted_disLiked)
      for (let i = 0 ; i < this.sorted_disLiked.length - 1 ; i++){
        this.max_disLiked_data.push(this.sorted_disLiked[i][0])
        if (this.sorted_disLiked[i][1] !== this.sorted_disLiked[i + 1][1]){
          break
        }
      }
      })
      .catch(err => console.log(err))

    }  
  }
}
</script>

<style lang='scss'>
@import '@/assets/scss/recommended/recommended.scss';

</style>