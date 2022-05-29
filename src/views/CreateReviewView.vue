<template>
  <div class="container review-c-container">
    <h2 class="text-center"><span class="create-movie-title" >"{{movie_name}}" </span>영화 리뷰 작성</h2>
  <v-container fluid>
    <div action="" id="review-content-form">
      <v-text-field v-model="title" :counter="50" label="제목"
      required class="fs-2"></v-text-field>

    <v-textarea id="review-content-textarea" counter label="내용" v-model="text" :value="text"></v-textarea>
    <div class="d-flex justify-content-end">
    <vs-button shadow :active="false" @click.prevent="cancleClick">
        취소
    </vs-button>
    <vs-button v-if="!update" shadow :active="false" @click.prevent="submitClick">
        작성
    </vs-button>
    <vs-button v-if="update" shadow :active="false" @click.prevent="updateClick">
        수정
    </vs-button>
    </div>
    </div>
  </v-container>
    
  </div>
</template>

<script>
import drf from '@/api/drf'
import axios from 'axios'
export default {
  name: 'CreateReviewView',
  data() {
    return {
      title : '',
      text : '',
      movie_name : this.$store.getters.getSelectedMovie.title
    }
  },
  props : {
    movie_id : Number,
    review_id : Number,
    update : Boolean,
  },
  methods : {
    updateClick(){
      if(!this.title || this.title.length > 50){
        alert('제목은 최소 1자 이상 50자 이하로 입력해야합니다.')
        return
      }
      const data = {
        title : this.title,
        content : this.text,
      }

      this.$store.dispatch('updateReview',data)

      const created = {
        movie_id : this.$store.getters.getSelectedMovie.id,
      }

      this.$emit('complete_create_review',created)
    },
    cancleClick(){

      if(this.update){
        this.$emit('cancle-click-update')
      }else{
        this.$emit('close_create_review',false)

      }

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
      //axios통신하면 서버에서 글번호 넘겨줌
      //this.$store.dispatch('createReview',data)
      axios({
        url : drf.review.reviewCreate(this.$store.getters.getSelectedMovieForReview.id),
        method : 'post',
        data : data,
        headers : this.$store.getters.getAuthHeader
      })
      .then(res => {
        
        this.$store.commit('SET_SELECTEDREVIEWS',res.data)
        this.$store.commit('SET_ALLCOMMENTS',[])    
        this.$store.commit('SET_REVIEW_LIKE_INFO',{isLiked : false , like_cnt : 0})
      })
      .catch(err => console.log(err))
      
      const created = {
        movie_id : this.$store.getters.getSelectedMovie.id,
      }
      this.$emit('complete_create_review',created)

    }
  },
  created(){
    if (this.update){
      //서버로부터 정보받아옴
      this.text = this.$store.getters.getSelectedReview.content
      this.title = this.$store.getters.getSelectedReview.title
    }
  }
}
</script>

<style lang='scss'>
@import '@/assets/scss/ReviewView/CreateReview.scss';
</style>