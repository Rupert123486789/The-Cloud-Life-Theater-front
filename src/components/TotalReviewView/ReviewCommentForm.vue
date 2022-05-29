<template>
  <div>
    <form action="">
        <div class="d-flex review-comment-form-container align-items-center">
          <div class="me-2"><v-icon x-large>mdi-account-circle</v-icon></div>
          <div class="review-comment-form" v-if="!update">
            <v-textarea
            id="commentTextarea" v-model="commentText" label="댓글을 입력하세요" auto-grow
            rows="1" row-height="15" @focus="isSelected = true"></v-textarea>
          </div>
          <div class="review-comment-form" v-if="update">
            <v-textarea
            id="commentTextarea" autofocus v-model="commentText" label="댓글을 입력하세요" auto-grow
            rows="1" row-height="15" @focus="isSelected = true">{{this.commentText}}
            </v-textarea>
          </div>
        </div>
        <div class="d-flex justify-content-end comment-button-container" v-if="isSelected">
          <vs-button transparent dark :active="active == 1"
            @click.prevent="cancleClick">
            취소
          </vs-button>
          <vs-button transparent dark :active="active == 1"
            @click.prevent="createClick" v-if="!update">
            작성
          </vs-button>
          <vs-button transparent dark :active="active == 1"
            @click.prevent="updateClick" v-if="update">
            수정
          </vs-button>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ReviewCommentForm',
  data(){
    return {
      commentText : '',
      isSelected : false,
      active : 2,
      
    }
  },
  props : {
    update : Boolean,
    commentClear : Boolean,
    review_id : Number,
  },
  watch :{
    commentClear(){
      this.commentText = ''
      this.$emit('clear-text-complete')
    },
    update(){
      
      this.commentText = this.$store.getters.getSelectedComment.content
    }
  },
  methods : {
    createClick(){
      //console.log(this.commentText)
      const data = {
        content : this.commentText,
        review_id : this.review_id,
      }

      this.$store.dispatch('createComment',data)
      
      // 작성버튼 클릭후 처리
      this.commentText = ''
      this.isSelected = !this.isSelected
    },
    cancleClick(){
      if(this.update){
        this.$emit('cancle-click-update')
      } else {
        this.isSelected = false
        this.commentText = ''
      }
    },updateClick(){
      const data = {
        content : this.commentText
      }
      this.$store.dispatch('updateSelectedComment',data)
      this.$emit('update-complete',data)
    }
  },
  created(){
    if(this.$store.getters.getSelectedComment){
      this.commentText = this.$store.getters.getSelectedComment.content
    }
  }
}
</script>

<style lang='scss'>
@import '@/assets/scss/ReviewView/ReviewComment.scss';
</style>