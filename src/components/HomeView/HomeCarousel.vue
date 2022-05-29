<template>
<div class="HomeCarousel">
  <div >
  
  <div class="carousel-inner-custom">
      <img src="@/assets/image/인터스텔라.jpg" class="img-fluid" alt="...">
      <div class="carousel-inner-text d-flex flex-column align-items-end">
        <h5 class="" style="font-size:6rem; color:white;">인터스텔라</h5>
        <div><span class="text-white">“우린 답을 찾을 거야, 늘 그랬듯이”</span></div>
        <p class="text-white">
          세계 각국의 정부와 경제가 완전히 붕괴된 미래가 다가온다. 지난 20세기에 범한 잘못이 
          전 세계적인 식량 부족을 불러왔고, NASA도 해체되었다. 이때 시공간에 불가사의한 틈이 열리고, 
          남은 자들에게는 이 곳을 탐험해 인류를 구해야 하는 임무가 주어진다. 사랑하는 가족들을 뒤로 한 채 인류라는 
          더 큰 가족을 위해, 그들은 이제 희망을 찾아 우주로 간다. 그리고 우린 답을 찾을 것이다. 늘 그랬듯이...
          </p>
          <div class="d-flex justify-content-start w-100 align-items-center"> 평점:
            <v-rating color="orange" length="1" readonly size="25" :value="5"></v-rating>
            <span class="rating" style= "font-family: 'Black Han Sans', sans-serif;">4.2</span>
            <vs-button transparent dark :active="false" @click="modalClick('157336')">
                상세보기
            </vs-button>
            </div>
          <div class="d-flex justify-content-start w-100">
          </div>
        
      </div>
  </div>
</div>
    <!-- 모달창 구현-->
    <div class="modal_custom" v-if="modalState">
      <div class="modal_custom__window">
        <detail-movie-view :selectedMovie="this.$store.getters.getSelectedMovie" 
        @update-detail-movie="updateDetailPage"/>
      </div>
      <div class="modal_custom__overlay" @click.self="modalCheck"></div>
    </div>
  
</div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Nanum+Brush+Script&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');


  .rating{
    
    font-size: 1.5rem !important;
    color: goldenrod;
  }

  @media (max-width: 1400px) {
    .carousel-inner-text{
      width: 70% !important;
    }
  }

@media (max-width: 800px) {
  .carousel-inner-text{
    width: 90% !important;
    margin: 0 auto;
  }
}

@media (max-width: 400px) {
  .carousel-inner-text p{
    display:none !important;
  }
}


  .HomeCarousel {
    font-family: 'Black Han Sans', sans-serif;
    
    
  }

  span {
    font-family: 'Nanum Brush Script', cursive;
    font-size: 3rem !important;
  }
  .carousel-inner-custom {
    position: relative;

    & p{
      font-family: 'Jua', sans-serif !important;
    }
  }

  .carousel-inner-custom img{
    width: 100%;
    height: 1000px;
    object-fit: cover;
    
  }
  .carousel-inner-text{
    top:15%;
    right: 1%;
    width: 40%;
    font-size: 1.5rem;
    text-align: start;
    position: absolute;
  }

</style>

<script>
  import Vue from 'vue'
  import Vuesax from 'vuesax'
  import { mapGetters} from "vuex";
  import 'vuesax/dist/vuesax.css' //Vuesax styles
import DetailMovieView from '@/views/DetailMovieView.vue';
  Vue.use(Vuesax, {
    // options here
  })
  export default {
  components: { DetailMovieView },
    name: 'HelloWorld',
    
    data() {
      return {
        movies: [],
        modalState : false,
      }
    },
    computed : {
      ...mapGetters(['getImg_url'])
    },
    methods : {
      updateDetailPage(){
      this.modalState = false
      setTimeout(() => {
        this.modalState = true
      },400)
      
    },
    modalCheck(){
      this.modalState = !this.modalState

      if (this.modalState){
        document.querySelector('html').classList.add('not-scroll')
      }else{
        document.querySelector('html').classList.remove('not-scroll')
      }
    },

    modalClick(movie_id){
      
    
      
      this.$store.dispatch('fetchSelectedMovie',movie_id)
      .then(
        () => {
          this.modalState = !this.modalState
          window.scrollTo(0,100)
          //this.fetchSelectedMovie(movie_id)
          if (this.modalState){
            document.querySelector('html').classList.add('not-scroll')
          }else{
            document.querySelector('html').classList.remove('not-scroll')
          }
        }
      )

      
    },
    },
    created(){
      
    },
    mounted(){

    }
  }
</script>
