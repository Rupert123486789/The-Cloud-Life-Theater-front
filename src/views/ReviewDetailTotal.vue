<template>
  <div>
  <div class="container review-detail-Total-container" v-if="!isUpdate">
    <div class="d-flex justify-content-center fs-4"><span class="d-inline-block detail-movie-title">"{{getSelectedMovieForReview.title}}"&nbsp;</span>영화리뷰</div>
    <hr>
    <div class="d-flex justify-content-end">
      <vs-button shadow :active="false" @click="goReviewPerMovie" 
      v-if="getCurrentUser.username !== getSelectedReview.user.username">
        나도 <span class="mx-2 fs-2" style="color : #F4BFBF;">"{{getSelectedMovieForReview.title}}"</span>  리뷰 쓰러가기 ->
    </vs-button></div>
    <div class="d-flex justify-content-center">
      <h2 class="fs-1"><span>{{getSelectedReview.title}}</span></h2>
    </div>
    <div class="review-detail-textarea-container border d-flex flex-column justify-content-between">
      <div class="review-detail-textarea fs-2">{{getSelectedReview.content}}</div>
      <div class="review-info-container mt-1 d-flex flex-column align-items-end">
        <h5>작성일자: <span>{{getSelectedReview.created_at}}</span></h5>
        <h5>작성자: <span style="cursor:pointer;" @click="clickUsername">{{getSelectedReviewUsername}}</span></h5></div>
    </div>
    <div class="d-flex justify-content-between flex-wrap">
      <div class="d-flex flex-column align-items-start">
        <div class="fs-5">좋아요가 <span class="fs-3 fw-bold">{{getReviewLikeInfo.like_cnt}}</span> 개 입니다.</div> 
        <div v-if="!getReviewLikeInfo.isLiked" class="d-flex align-items-center justify-content-start">리뷰가 도움되었다면<vs-button class="d-line-block" transparent :active="false" @click="likeClick">좋아요</vs-button>
         를 눌러주세요</div>
         <div v-if="getReviewLikeInfo.isLiked" class="d-flex"><vs-button :active="false" @click="likeClick" style="background-color: #F47C7C; height:30px;">좋아요</vs-button> <v-icon>mdi-account-heart</v-icon></div> 
      </div>
      <div class="d-flex justify-content-end flex-wrap mt-1 review-function-btn-container">
        <div class="d-flex justify-content-end flex-wrap"
        v-if="getCurrentUser.username === getSelectedReview.user.username">
          <vs-button :active="false" @click="updateClick">
              수정
          </vs-button>
          <vs-button danger :active="false" @click="deleteModal = true">
              삭제
          </vs-button>
        </div>
        <vs-button warn :active="false" @click="goListReview">
            목록
        </vs-button>
      </div>
    </div>

    
    <!-- 삭제 모달창 영역 -->
    <vs-dialog not-center v-model="deleteModal" class="delete-modal">
        <template #header>
          <h4 style="color : #92B4EC;">"유저의 리뷰는 큰 도움이 됩니다."</h4>
          <h4 class="not-margin" style="color : #FF5D5D;">
            정말 삭제하시겠습니까?
          </h4>
          <h3><b>삭제합니다</b>를 입력해주세요</h3>
        </template>

        <div class="con-content">
          <vs-input v-model="inputDelete" placeholder="삭제합니다"></vs-input>
        </div>

        <template #footer>
          <div class="con-footer d-flex justify-content-end">
            <vs-button @click="deleteCheck" transparent v-if="inputDelete === '삭제합니다'">
              삭제
            </vs-button>
            <vs-button disabled transparent v-if="inputDelete !== '삭제합니다'">
              삭제
            </vs-button>
            <vs-button @click="deleteModal=false" dark transparent>
              취소
            </vs-button>
          </div>
        </template>
      </vs-dialog>

      <div class="fs-3 mb-2">댓글: <span class="fs-2" style="color:#F24C4C;">{{getAllCommentsCnt}}</span>개</div>
      <review-comment-form :commentClear="getCommentClear" @clear-text-complete="commentClear=false"
       :review_id="this.getSelectedReview.id"/>
      <hr>
      <!-- 여기서 자동으로 데이터를 가져올 수 있도록 전체데이터를 props로 넘기거나 computed로 데이터가져오기-->
      <review-list-view :review_id="this.getSelectedReview.id"/>
    </div>
    <update-review-total-form :review="getSelectedReview" v-if="isUpdate"
    @cancle-click="isUpdate= false" @complete-update="isUpdate= false"/>
  </div>
</template>

<script>
import ReviewCommentForm from '@/components/TotalReviewView/ReviewCommentForm.vue'
import ReviewListView from '@/components/TotalReviewView/ReviewListView.vue'
import {mapGetters} from 'vuex'
import UpdateReviewTotalForm from './UpdateReviewTotalForm.vue'
import axios from 'axios'
import drf from '@/api/drf'

export default {
  name: 'ReviewDetailTotal',
  data(){
     return {
      page : this.$route.query.page,
      deleteModal : false,
      inputDelete : '',
      isUpdate : false,
      like_cnt : 0,
      isLiked : false,
      commentClear : false,
    }
  },
  components : {
    ReviewCommentForm,
    ReviewListView,
    UpdateReviewTotalForm,
  },
  computed : {
    ...mapGetters(['getAllCommentsCnt','getSelectedReview','getCurrentUser'
    ,'getSelectedMovieForReview', 'getAuthHeader','getLikedTendency','getReviewLikeInfo']),
    getCommentClear(){
      return this.commentClear
    },
    getSelectedReviewUsername(){
      return this.$store.getters.getSelectedReview.user?.username
    },
    getIsLiked(){
      return this.isLiked
    },
    getLikeCnt(){
      return this.like_cnt
    }
    
  },
  methods : {

    updateClick(){
      this.isUpdate = true
      this.commentClear = !this.commentClear
    },

    //username 클릭시 상세프로필 페이지로 이동
    clickUsername(){
      
      this.$store.dispatch('fetchProfile',this.getSelectedReviewUsername)
      this.$router.push({name:'my_page',params:{username: this.getSelectedReviewUsername}})
    },
    likeClick(){
      
      axios({
        url : drf.review.likeReview(this.getSelectedReview.id),
        method : 'POST',
        headers : this.getAuthHeader
      })
      .then(() => {
        
        // if(res.data.like_users.includes(this.getCurrentUser.pk)){
        //   this.isLiked = true
        // } else {
        //   this.isLiked = false
        // }
        // this.like_cnt = res.data.like_users.length
        this.$store.dispatch('ReviewLikeInfo',this.getSelectedReview.id)
      })
      .catch (err => console.log(err))
    },
    checkliked(){
      this.$store.dispatch('ReviewLikeInfo',this.getSelectedReview.id)
  
    },
    deleteCheck(){
      //모달창 끄기
      this.deleteModal = !this.deleteModal
      this.commentClear = !this.commentClear
      if (this.inputDelete === '삭제합니다'){
        //삭제하면 삭제하고 남은 데이터들을 모두 받아 전체 데이터를 갱신해준다.
        this.$store.dispatch('deleteSelectedReview') 
      }
      this.inputDelete = ''
    },
    //글 수정
    goUpdateDetail(){
      // this.$store.commit('SET_UPDATEDREVIEW',this.getSelectedReview)
      // this.$store.commit('SET_ISUPDATE',true)
      // this.$router.push({name: 'total_review_update', params : {movie_id: this.getSelectedReview.id,update : true}, query : {page:this.$route.query.page}})
    },
    goReviewPerMovie(){
      this.$router.push({name:'total_review_create', params : {movie_id: this.getSelectedReview.id}, query : {page:this.$route.query.page}})
    },
    goListReview(){
      this.$store.dispatch('fetchAllReviews')
      this.$router.push({name: 'total_review', query : {page:this.$route.query.page}})
      this.commentClear = !this.commentClear
    },
  },
  created(){
    this.checkliked()

  },
}
</script>

<style lang='scss'>
@import '@/assets/scss/ReviewView/ReviewDetailTotal.scss';
</style>