<template>
  <div>
    <form action="">
        <div class="d-flex movie-comment-update-form-container">
          <div class="mx-5 mt-3 d-flex flex-column align-items-center justify-content-start">
            <div class="movie-comment-icon"><v-icon x-large class="movie-comment-icon">mdi-account-circle</v-icon></div>
            <div>{{comment.user.username}}</div>
          </div>
          <div class="movie-comment-form">
            <v-textarea
            id="commentTextarea" autofocus v-model="commentText" label="댓글을 입력하세요" auto-grow
            rows="2" row-height="30">{{this.$store.getters.getSelectedMovieComment}}
            </v-textarea>
          </div>
        
        </div>
        <div class="d-flex justify-content-end comment-button-container">
          <div class="d-flex flex-column align-content-center justify-content-start me-4">
            <div class="text-center">{{rating}}점</div>
            <div>
              <v-rating v-model="rating" background-color="orange lighten-3" color="orange"
                dense half-increments hover size="20"/>
            </div>
          </div>
          <vs-button transparent dark :active="false"
            @click.prevent="updateClick">
            수정
          </vs-button>
          <vs-button transparent dark :active="false"
            @click.prevent="cancleClick">
            취소
          </vs-button>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name:'MovieCommentUpdateForm',
  data(){
    return {
      commentText : this.comment.content,
      rating : this.comment.rating
    }
  },
  props : {
    comment : Object,
  },
  methods : {
    updateClick(){
      const data = {
        content : this.commentText,
        rating : this.rating
      }
      this.$store.dispatch('updateSelectedMovieComment', data)
      this.$emit('update-complete',data)
    },
    cancleClick(){
      this.$emit('cancle-click')
    }
  }
}
</script>

<style lang='scss'>
@import '@/assets/scss/DetailMovieView/MovieCommentUpdateForm.scss';
</style>