<template>
  <div>
    <div v-for="(comment,idx) in getPageCnt" :key="idx">
      <review-comment-detail :comment="comment"/>
    </div>
    <v-pagination
      v-model="page" :length="$vs.getLength(getAllComments, max)" prev-icon="mdi-menu-left" next-icon="mdi-menu-right"
    ></v-pagination>
    
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ReviewCommentDetail from './ReviewCommentDetail.vue'

export default {
  components: { ReviewCommentDetail },
  name:'ReviewListView',
  data(){
    return {
      max : 7,
      end : 7,
      page : 1,
      start : 0,
    }
  },
  props : {
    review_id : Number,
  },
  watch: {
    page(){
      this.start = (this.page - 1) * this.max
      this.end = (this.start + this.max)
    }
  },
  computed : {
    ...mapGetters(['getAllComments','getSelectedReview']),
    getPageCnt(){
      //console.log(this.getAllComments.slice(this.start,this.end))
      return [...this.getAllComments].reverse().slice(this.start,this.end)
    }
  },
  created(){
    this.$store.dispatch('fetchAllComments',this.review_id)
    
  }
}
</script>

<style lang='scss'>

</style>