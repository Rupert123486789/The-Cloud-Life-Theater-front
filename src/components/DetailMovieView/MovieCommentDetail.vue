<template>
  <div class="movie-comment-detail mb-5">
    <div class="d-flex justify-content-between row" v-if="!isSelectedUpdate">
      <div class="d-flex justify-content-start col-12">
        <div class="comment-user-info-container mx-5 d-flex flex-column align-items-center justify-content-start">
          <div class="movie-comment-icon"><v-icon x-large class="movie-comment-icon">mdi-account-circle</v-icon></div>
          <div class="movie-comment-user-id">{{comment.user.username}}</div>
        </div>
        <div class="comment-rating-container d-flex justify-content-center align-items-center"><span>{{this.comment.rating}}</span></div>
        <div class="comment-content pt-2 d-flex flex-column justify-content-start ms-5">{{this.comment.content}}
          <div class="d-flex justify-content-end">
            <div v-if="checkUser()" class="comment-update-btn-container d-flex justify-content-end">
                <div>
                  <vs-button
                    transparent shadow :active="false"
                    @click="updateClick">
                    수정
                  </vs-button>
                </div>
                <div>
                  <vs-button
                    transparent shadow :active="false"
                    @click="isDelete = true">
                    삭제
                  </vs-button>
                </div>
            </div>  
          </div>
        </div>
      </div>
    </div>

    <!-- 수정버튼 클릭시 보여줄 폼-->
    <movie-comment-update-form v-if="isSelectedUpdate" :comment="comment"
      @update-complete="updateData" @cancle-click="isSelectedUpdate = false"
    />

    <!-- 삭제 버튼 클릭시 보여줄 다이얼로그 -->
    <v-dialog
      v-model="isDelete"
      max-width="300"
    >
      <v-card>
        <v-card-title class="text-h6">
          정말 삭제하시겠습니까?
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1" text @click="isDelete = false">
            취소
          </v-btn>

          <v-btn
            color="green darken-1" text @click="deleteClick">
            삭제
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import MovieCommentUpdateForm from './MovieCommentUpdateForm.vue'
export default {
  components: { MovieCommentUpdateForm },
  name:'MovieCommentDetail',
  data() {
    return {
      // commentText : this.$store.getters.getSelectedMovieComment.content,
      commentText : this.comment.content,
      isSelectedUpdate : false,
      rating : this.comment.rating,
      isDelete : false,
    }
  },
  props : {
    comment : Object,
  },
  methods : {
    checkUser(){
      const CurrentUser = this.$store.getters.getCurrentUser.username
      return this.comment.user.username === CurrentUser
    },
    updateClick(){
      this.isSelectedUpdate = !this.isSelectedUpdate
      //console.log(this.comment)
      this.$store.commit('SET_SELECTEMOVIEDCOMMENT',this.comment)
    },
    deleteClick(){
      //현재 선택한 댓글을 뷰엑스에 설정
      this.$store.commit('SET_SELECTEMOVIEDCOMMENT',this.comment)
      //비동기로 삭제
      this.$store.dispatch('deleteSelectedMovieComment',this.comment)

      this.isDelete = false
    },
    //수정완료시 실행
    updateData(data){
      
      this.isSelectedUpdate = false
      this.commentText = data.content
      this.rating = data.rating
      // this.commentText = this.$store.getters.getSelectedMovieComment.content
      // this.rating = this.$store.getters.getSelectedMovieComment.rating
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/DetailMovieView/MovieDetailComment.scss';
</style>