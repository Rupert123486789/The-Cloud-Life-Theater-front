<template>
  <div class="homeview-container bg-dark">
    <div class="first-home-container">
        <HomeCarousel />
      <div class="card-background-container card-first-container">
        <div class="movie-group-title fw-white">평점순</div>
        <home-card-group-form :movies="getVote_average_movies"/>
      </div>
    </div>

  <div class="divider"></div>
  <div class="card-background-container ">
    <div class="movie-group-title d-flex justify-content-between" >
      <div>최신순</div> 
      <div @click="goToSearchPage"><vs-button transparent dark >더 많은 영화 보러 가기 -></vs-button></div>
    </div>
  
  <home-card-group-form :movies="getRelease_order_movies"/>
  </div>

  
  <div class="divider"></div>
  <div class="card-background-container">
  <div class="movie-group-title d-flex justify-content-between" >
    <div>인기순</div> 
    <div @click="goToSearchPage"><vs-button transparent dark >더 많은 영화 보러 가기 -></vs-button></div>
  </div>
    <home-card-group-form :movies="getPopularity_movies"/>
  </div>

  
  <div class="divider"></div>
  <div class="card-background-container ">
  <div class="movie-group-title d-flex justify-content-between" >
    <div>좋아요순</div> 
    <div @click="goToSearchPage"><vs-button transparent dark >더 많은 영화 보러 가기 -></vs-button></div>
  </div>
  <home-card-group-form :movies="getLike_order_movies"/>
  </div>

  <div class="divider"></div>
  <div class="card-background-container">
  <div class="movie-group-title d-flex justify-content-between" >
    <div>플레이리스트 많이 담은 순</div> 
    <div @click="goToSearchPage"><vs-button transparent dark >더 많은 영화 보러 가기 -></vs-button></div>
  </div>
  <home-card-group-form :movies="getPick_order_movies"/>
  </div>

  <div class="divider"></div>
  <div class="card-background-container ">
  <div class="movie-group-title d-flex justify-content-between" >
    <div>성인영화</div> 
    <div @click="goToSearchPage"><vs-button transparent dark >더 많은 영화 보러 가기 -></vs-button></div>
  </div>
  <home-card-group-form :movies="getAdult_movies"/>
  </div>
</div>
  
</template>
<style lang='scss'>
  @import '@/assets/scss/HomeView/HomeView.scss';
</style>
<script>
import { mapGetters,mapActions } from "vuex";
// @ is an alias to /src
import HomeCarousel from '@/components/HomeView/HomeCarousel.vue'
import HomeCardGroupForm from '@/components/HomeView/HomeCardGroupForm.vue';

export default {
  name: 'HomeView',
  components: {
    HomeCarousel,
    HomeCardGroupForm,
  },
  data(){
    return {
      model : null,
      value: 1,
    }
  },
  methods:{
    ...mapActions(['fetchHomePageMovisLoading']),
    goToSearchPage(){
      this.$router.push({name:'movies'})
    }
  },
  computed :{
    ...mapGetters(['getVote_average_movies','getPopularity_movies',
    'getAdult_movies','getLike_order_movies', 'getImg_url','getRelease_order_movies',
    'getPick_order_movies'])
  },
  created(){
    
      this.fetchHomePageMovisLoading()
    
  }
}
</script>
