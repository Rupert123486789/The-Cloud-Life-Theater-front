<template>
  <div class="">
    <vs-card-group>
    <vs-card type='2' v-for="(movie,idx) in movies" @click="modalClick(movie.id)" :key="idx">
      <template #title>
        <h3>{{movie.title}}</h3>
      </template>
      <template #img>
        <img :src="getImg_url + movie.poster_path" alt="">
      </template>
      <template #text>
        <p>
        </p>
      </template>
      <template #interactions>
        <vs-button class="btn-chat" transparent>
          <v-rating
            color="orange" length="1" readonly
            size="45" :value="5"
          ></v-rating>
          <span class="span d-inline-block" style="color:white; font-size:2.5rem;">
            {{movie.vote_average}}
          </span>
        </vs-button>
      </template>
    </vs-card>
  </vs-card-group>

  <!-- 모달창 구현-->
    <div class="modal_custom" v-if="modalState">
      <div class="modal_custom__window">
        <detail-movie-view :selectedMovie="this.$store.getters.getSelectedMovie" 
        @update-detail-movie="updateDetailPage" :selected="selected"/>
      </div>
      <div class="modal_custom__overlay" @click.self="modalCheck"></div>
    </div>
  </div>

</template>

<script>
import DetailMovieView from '@/views/DetailMovieView.vue';
import { mapGetters,mapActions } from "vuex";


export default {
  name: 'HomeGropForm.vue',
  data() {
    return {
      modalState : false,
      selected : false,
    }
  },
  components : {
    DetailMovieView

  },
  props : {
    movies : Array,
  },
  methods:{
    ...mapActions(['fetchHomePageMovisLoading','fetchSelectedMovie',]),
    updateDetailPage(){
      this.modalState = false
      setTimeout(() => {
        this.modalState = true
      },400)
      
    },

    modalCheck(){
      this.modalState = !this.modalState
      this.selected = true
      if (this.modalState){
        document.querySelector('html').classList.add('not-scroll')
      }else{
        document.querySelector('html').classList.remove('not-scroll')
      }
    },

    modalClick(movie_id){

      this.$store.dispatch('fetchSelectedMovie',movie_id)
      .then(() => {
        this.modalState = !this.modalState
        //document.querySelector('.modal_custom').scrollIntoView()
        
        //this.fetchSelectedMovie(movie_id)
        if (this.modalState){
          document.querySelector('html').classList.add('not-scroll')
        }else{
          document.querySelector('html').classList.remove('not-scroll')
        }

      })
      
    },
  },
    computed :{
    ...mapGetters(['getVote_average_movies','getPopularity_movies',
    'getAdult_movies','getLike_order_movies', 'getImg_url'])
  },
   
}
</script>

<style>

</style>