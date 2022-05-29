<template>
  <div>
    <form action="" >
      <div class="d-flex align-items-center justify-content-evenly">
        <label for="comment-textarea" class="icon-label d-flex align-items-center justify-content-center">
          <img src="@/assets/image/comment-icon.png" alt="" >
        </label>
          <v-textarea counter label="영화 한줄평가는 최대 100자 까지 작성해 주세요" :rules="rules" 
          v-model="value" class="bg-white ps-1" id="comment-textarea" style="font-size:25px; border-radius:7px; max-width:80%;">
          </v-textarea>
      </div>
      <div class="d-flex justify-content-between mt-3 row">
        <div class="d-flex align-items-end justify-content-start col-12 col-md-6 flex-wrap order-1 order-md-0">
            <vs-tooltip dark flat >
              <vs-button color="#808080" transparent class="fs-4" @click.prevent="goReviewCreate">
                상세 리뷰 쓰기
              </vs-button>
              <template #tooltip>
                한줄평 대신 상세한 리뷰가 쓰고싶다면?
              </template>
            </vs-tooltip>
            <vs-tooltip dark flat>
              <vs-button color="#808080" transparent class="fs-4" @click.prevent="goTotalReviewPerMovie">
                해당 영화 모든 리뷰 보러가기
              </vs-button>
              <template #tooltip >
                다른사람들의 리뷰가 보고싶다면?
              </template>
            </vs-tooltip>
        </div>
        
        <div class="d-flex align-items-center justify-content-end col-12 col-md-6 flex-wrap order-0 order-md-1">
        <div class="d-flex flex-column">
          <div class="text-center">{{rating}}점</div>
          <v-rating v-model="rating" background-color="orange lighten-3" color="orange"
            dense half-increments hover size="35"/>
        </div>
        <div class="ms-2 submit-btn-container d-flex justify-content-center align-items-center"
          @click.prevent="createComment" style="cursor:pointer;">
          <button class="fs-2 comment-submit-btn">작성</button>
        </div>
        </div>
      </div>
    </form>

    <vs-dialog overflow-hidden blur v-model="activeCreate">
      <create-review-view :movie_id="movie_id" :review_id="review_id" :update="updated"
       @close_create_review="closeCreateReview" @complete_create_review="completeCreateReview"/>
    </vs-dialog>

    <vs-dialog overflow-hidden blur v-model="activeDetail">
      <review-detail :movie_id="movie_id" :review_id="review_id" @cancle-click="activeDetail=false" @update-click="updateReview"
      @total-review-click="totalReviewClick" @delete-complete="deleteComplete"/>
    </vs-dialog>
 
    <vs-dialog overflow-hidden auto-width blur v-model="activeTotalReview" >
      <total-review-per-movie-view :movie_id="movie_id" @cancle-click="activeTotalReview=false" @go-review-detail="goReviewDetail"/>
    </vs-dialog>

  </div>
</template>

<script>
import CreateReviewView from '@/views/CreateReviewView.vue'
import ReviewDetail from '@/views/ReviewDetail.vue'
import TotalReviewPerMovieView from '@/views/TotalReviewPerMovieView.vue'
import {mapActions  } from "vuex";


export default {
  components: { CreateReviewView, ReviewDetail, TotalReviewPerMovieView, },
  name: 'MovieCommentForm',
  data(){
    return {
      rules: [v => v.length <= 100 || '최대 100자까지만 작성 가능합니다.'],
      value: '',
      rating: 5,
      activeCreate: false,
      activeDetail : false,
      activeTotalReview : false,
      movie_id : 1023,
      review_id : 5,
      updated : false,
      
      
    }
  },
  methods : {
    ...mapActions(['fetchSelectedReview',]),

    deleteComplete(){
    
    setTimeout(() => {
      this.activeDetail = false
      this.activeTotalReview = true
    }, 300);
    },
    createComment(){
      
      //작성 버튼 클릭시 데이터 넘겨주기
      const data = {  
        content : this.value,
        rating : this.rating,
      }
      
      this.$store.dispatch('createMovieComment',data)
      this.value = ''
    },
    goReviewCreate(){
      this.activeCreate=!this.activeCreate
      
    },
    completeCreateReview({movie_id, review_id}){
      this.activeCreate = !this.activeCreate
      this.activeDetail = !this.activeDetail
      this.movie_id = movie_id
      this.review_id = review_id
      this.updated = false
    },
    updateReview({movie_id, review_id}){
      this.activeCreate = !this.activeCreate
      this.activeDetail = !this.activeDetail
      this.movie_id = movie_id
      this.review_id = review_id
      this.updated = true
    },
    closeCreateReview(){
      this.activeCreate=false
      this.updated = false
    },
    goTotalReviewPerMovie(){
      this.activeTotalReview = !this.activeTotalReview
    },
    goReviewDetail(review_id){
      this.activeTotalReview = !this.activeTotalReview
      this.review_id = review_id
      this.activeDetail = true
    },
    totalReviewClick(movie_id){
      this.movie_id = movie_id
      this.activeDetail = !this.activeDetail
      this.activeTotalReview = !this.activeTotalReview
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/DetailMovieView/DetailMovieView.scss';
</style>