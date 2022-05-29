<template>

  <div class="container review-c-container ">
    <h1 class="text-center"><span class="create-movie-title">"{{getSelectedMovieForReview.title}}" </span>영화 리뷰 작성</h1>
  <v-container fluid>
    <div id="review-content-form">
      <v-text-field v-model="title" :counter="50" label="제목"
      required class="fs-2">
      </v-text-field>

    <v-textarea id="review-content-textarea" counter label="내용" :value="text" v-model="text"></v-textarea>
    <div class="d-flex justify-content-end">
    <vs-button shadow :active="false" @click.prevent="cancleClick">
        취소
    </vs-button>
    <vs-button shadow :active="false" @click.prevent="submitClick">
        <span>작성</span>
    </vs-button>
    </div>
    </div>
  </v-container>
  </div>

</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'CreateReviewTotal',
  data() {
    return {
      text : '',
      title : '',
    }
  },
  computed : {
    ...mapGetters(['getSelectedMovieForReview','getSelectedReview','getUpdatedReview'])
  },
  methods : {
    cancleClick(){
      this.$router.back()
      this.text = ''
      this.title = ''
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

      //axios 통신 후 상세페이지로
      this.$store.dispatch('createReview',data)
      //this.$router.push({name: 'total_review_detail',params : {review_id : this.getSelectedReview.id}, query : {page:1}})
      
      this.text = ''
      this.title = ''
      
    }
  },
}
</script>

<style lang='scss'>
@import 'src/assets/scss/ReviewView/CreateReview.scss';
</style>