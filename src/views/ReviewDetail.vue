<template>
  <div class="container review-detail-container">
    <div class="d-flex justify-content-center d-flex flex-column align-items-center"><h2 class="fs-1"><span>{{getSelectedReview.title}}</span></h2></div>
    <div>
    <div class="review-detail-textarea-container border">
    <div class="review-detail-textarea fs-2">{{getSelectedReview.content}}</div>
    </div>
    <div class="review-info-container mt-5 d-flex flex-column align-items-end">
      <h5>작성일자: <span>{{getSelectedReview.created_at}}</span> </h5>
      <h5>작성자: <span>{{getSelectedReview.user.username}}</span> </h5>
    </div>
    </div>
    
    <div class="d-flex justify-content-end flex-wrap">
    <vs-button shadow :active="false" @click="cancleClick">
        취소
    </vs-button>
    <div v-if="getSelectedReview.user.username === getCurrentUser.username" class="d-flex">
    <vs-button shadow :active="false" @click="updateClick">
        수정
    </vs-button>
    <vs-button shadow :active="false" @click="deleteModal = true">
        삭제
    </vs-button>
    </div>
    <vs-button shadow :active="false" @click="TotalReviewClick">
        다른 리뷰들 보기
    </vs-button>
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
            <vs-button @click="deleteClick" transparent v-if="inputDelete === '삭제합니다'">
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {

  name: 'ReviewDetail',
  data(){
    return {
      review : this.$store.getters.getSelectedReview,
      deleteModal : false,
      inputDelete : '',
    }
  },
  props : {
    movie_id : Number,
    review_id : Number,
  },
  computed : {
    ...mapGetters(['getSelectedReview','getCurrentUser']),
  },
  methods : {
    deleteClick(){
      this.deleteModal = false

      this.$store.dispatch('deleteSelectedReviewModal')

      this.$emit('delete-complete')
    },
    cancleClick(){
      this.$emit('cancle-click',false)
    },
    updateClick(){
      
      const update = {
        movie_id : this.movie_id,
        review_id: this.review_id
      }
      this.$emit('update-click',update)
      

    },
    TotalReviewClick(){
      this.$emit('total-review-click',this.movie_id)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/ReviewView/ReviewDetail.scss';
</style>