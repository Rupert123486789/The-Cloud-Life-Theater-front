<template>
  <div class="review-comment-detail mb-5">
    <div class="d-flex justify-content-between flex-wrap" v-if="!isSelectedUpdate">
      <div class="d-flex">
        <div class="me-2">
          <v-icon x-large @click="goProfile" style="cursor:pointer;">mdi-account-circle</v-icon>
        </div>
      <div class="d-flex flex-column">
        <div class="">
          <div><span class="fw-bold" @click="goProfile" style="cursor:pointer;">{{comment.user.username}}님</span></div>
        </div>
        <div class="comment-content">{{comment.content}}</div>
      </div>
      </div>
      <div class="d-flex flex-column align-items-end">
        <span class="ms-5 d-block">작성일: {{comment.created_at}}</span>
        <div v-if="checkUser(comment.user)" class="comment-update-container d-flex justify-content-end">
          <div class="me-2">
            <vs-button
              transparent dark :active="false"
              @click="updateClick">
              수정
            </vs-button>
          </div>
          <div>
            <vs-button
              transparent dark :active="false"
              @click="isDelete = true">
              삭제
            </vs-button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isSelectedUpdate" >
      <review-comment-form :update="update" 
      @cancle-click-update="isSelectedUpdate = false"
      @update-complete="updateData"/>
    </div>

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
import ReviewCommentForm from './ReviewCommentForm.vue'
export default {
  components: { ReviewCommentForm },
  name: 'ReviewCommentDetial',
  props : {
    comment : Object,
    
  },
  data(){
    return {
      isSelectedUpdate : false,
      active : 2,
      update : false,
      commentText : this.comment.content,
      isDelete : false,
    }
  },
  methods : {
    goProfile(){
      this.$store.dispatch('fetchProfile',this.comment.user.username)
      this.$router.push({name:'my_page',params:{username: this.comment.user.username}})
    },
    updateClick(){
      this.isSelectedUpdate = true
      this.update = true

      //현재 선택한 댓글을 뷰엑스에 저장
      this.$store.commit('SET_SELECTEDCOMMENT',this.comment)
    },
    checkUser(commentUser) {
      //현재 유저랑 작성자 유저랑 비교
      return this.$store.getters.getCurrentUser.username === commentUser.username
    },
    updateData(data){
      //console.log(data)
      this.commentText = data.content
      this.isSelectedUpdate = false
    },
    deleteClick(){
      //현재 선택한 댓글을 뷰엑스에 저장
      this.$store.commit('SET_SELECTEDCOMMENT',this.comment)
      this.$store.dispatch('deleteSelectedComment',this.comment)
      this.isDelete = false
    }
  },
}
</script>

<style>

</style>