<template>
  <div class="update-top-container">
    <div class="container review-c-container" >
    <h1 class="text-center"><span class="create-movie-title">"{{this.$store.getters.getSelectedMovie.title}}" </span>영화 리뷰 수정</h1>
    <v-container fluid>
    <div id="review-content-form">
      <v-text-field v-model="title"  :counter="50" label="제목"
      required class="fs-2">
      </v-text-field>

    <v-textarea id="review-content-textarea" counter label="내용"  v-model="text"></v-textarea>
    <div class="d-flex justify-content-end">
    <vs-button shadow :active="false" @click.prevent="cancleClick">
        취소
    </vs-button>
    <vs-button shadow :active="false" @click.prevent="submitClick">
        <span>수정</span>
    </vs-button>
    </div>
    </div>
  </v-container>
  </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'UpdateReviewTotalForm',
  data() {
    return {
      text : this.review.content,
      title : this.review.title,
    }
  },
  props:{
    review : Object,
  },
  computed : {
    ...mapGetters(['getSelectedMovieForReview','getSelectedReview','getUpdatedReview'])
  },
  methods : {
    cancleClick(){
      this.$emit('cancle-click')
      //this.$router.back()
      // this.text = ''
      // this.title = ''
    },
    submitClick(){
      
      if(!this.title || this.title.length > 50){
        alert('제목은 최소 1자 이상 50자 이하로 입력해야합니다.')
        return
      }
        const data = {
        title : this.title,
        content : this.text,
      }
      
     
      //console.log('여기는 업데이트')
      //axios 통신 후 상세페이지로
      this.$store.dispatch('updateReview',data)

      //this.$router.push({name: 'total_review_detail',params : {review_id : this.getSelectedReview.id}, query : {page:this.$route.query.page}})

      // this.text = ''
      // this.title = ''

      this.$emit('complete-update')
    }
  },
  created(){

  },
}
</script>

<style lang='scss'>
@import 'src/assets/scss/ReviewView/CreateReview.scss';

.update-top-container{
  margin-top:8rem;
}

</style>