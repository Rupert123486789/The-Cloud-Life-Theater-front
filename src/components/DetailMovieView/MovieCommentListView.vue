<template>
  <div>
    <div v-for="(comment,idx) in getPageCnt" :key="idx">
      <movie-comment-detail :comment="comment" />
    </div>
    <div class="center con-pagination">
      <!-- <vs-pagination color="#FFD9C0" v-model="page" :length="$vs.getLength(getAllMovieComments, max)" /> -->
      <v-pagination v-model="page" color="#FFD9C0" :length="$vs.getLength(getAllMovieComments, max)" circle></v-pagination>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MovieCommentDetail from './MovieCommentDetail.vue'

export default {
  components: { MovieCommentDetail },
  name:'MovieCommentListView',
  data () {
    return {
      max : 5,
      end : 5,
      page : 1,
      start : 0,
    }
  },
  watch : {
    page(){
      this.start = (this.page - 1) * this.max
      this.end = (this.start + this.max)
    } 
  },
  computed : {
    ...mapGetters(['getAllMovieComments']),
    getPageCnt(){
      //console.log(this.getAllMovieComments)
      return [...this.getAllMovieComments].reverse().slice(this.start,this.end)
    },
  },
  created() {
    //비동기로 해당영화의 모든 데이터를 받아온다
    //this.$store.dispatch('fetchAllMovieComments')
  },
  mounted(){

  }
}
</script>

<style>

</style>