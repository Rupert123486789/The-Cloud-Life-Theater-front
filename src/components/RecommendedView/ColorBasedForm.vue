<template>
  <div class="like-based-form-container container d-flex flex-column align-items-center">
    <div class="recommended-explation d-flex flex-column align-items-center" :class="{'margin-custom-top' : !test1 && !test2 && !test3 && !test4 && !test_complete}">
      <div class="fs-2 sub-title text-center" style="color:#646FD4;">컬러 기반 추천이란?</div>
      <div class="fs-4 text-center text-container my-3">사용자가 8가지의 컬러중 4가지를 선택하면 그 선택한 컬러들을 기반으로
        장르와 연관시켜 분석하여 관련 영화를 추천해주는 서비스입니다.<span class="fs-6 d-block"></span></div>
      <vs-button transparent :active="false" @click="test1 = true" v-if="!test1 && !test2 && !test3 && !test4 && !test_complete">
        테스트 시작하기
      </vs-button>
    </div>

    <div class="test-container mt-5">
  
      <div class="test1 d-flex align-items-center" v-if="test1">
        <div class="mx-5 img-container" @click="ClickPicture">
          <div id="black" class="img-box black-img" style="color:transparent;">Black</div>
          <div class="d-none img-text"><h1>Black</h1></div>
      </div>
      <div class="" style="font-size: 2.6rem;">VS</div>
        <div class="mx-5 img-container" @click="ClickPicture">
          <div id="white" class="img-box white-img" style="color:transparent;">White</div>
          <div class="d-none img-text text-white"><h1>White</h1></div>
        </div>
      </div>
      
      <div class="test2 d-flex align-items-center" v-if="test2">
        <div class="mx-5 img-container" @click="ClickPicture">
          <div class="img-box blue-img " style="color:transparent;">Blue</div>
          <div class="d-none img-text" style="color:blue;"><h1>Blue</h1></div>
        </div>
        <div class="" style="font-size: 2.6rem;">VS</div>
        <div class="mx-5 img-container" @click="ClickPicture">
          <div class="img-box green-img " style="color:transparent;">Green</div>
          <div class="d-none img-text" style="color:green;"><h1>Green</h1></div>
        </div>
      </div>

      <div class="test3 d-flex align-items-center" v-if="test3">
        <div class="mx-5 img-container" @click="ClickPicture">
          <div class="img-box orange-img " style="color:transparent;">Orange</div>
          <div class="d-none img-text" style="color:orange;"><h1>Orange</h1></div>
        </div>
        <div class="" style="font-size: 2.6rem;">VS</div>
        <div class="mx-5 img-container" @click="ClickPicture">
          <div class="img-box purple-img " style="color:transparent;">Purple</div>
          <div class="d-none img-text" style="color:purple;"><h1>Purple</h1></div>
        </div>
      </div>

      <div class="test4 d-flex align-items-center" v-if="test4">
        <div class="mx-5 img-container" @click="ClickPicture">
          <div class="img-box yellow-img " style="color:transparent;">Yellow</div>
          <div class="d-none img-text" style="color:yellow;"><h1>Yellow</h1></div>
        </div>
        <div class="" style="font-size: 2.6rem;">VS</div>
        <div class="mx-5 img-container" @click="ClickPicture">
          <div class="img-box red-img " style="color:transparent;">Red</div>
          <div class="d-none img-text" style="color:red;"><h1>Red</h1></div>
        </div>
      </div>

      <div v-if="test_complete" class="d-flex flex-column align-items-center">
        <div class="fs-1">선택하신 색상은 <span id="select-color-text" class="select-color-text" style="color : #68A7AD;">{{this.selected_color}}</span> 입니다.</div>
        <div class="d-flex justify-content-end">
          <vs-button shadow dark border :active="false" @click="resetSelect">
              색상 다시선택
          </vs-button>
          <vs-button shadow dark border :active="false" @click="CompleteSelect">
              확인
          </vs-button>
      </div>
      </div>
      <div>
      <div v-if="result" class="my-10 text-center fs-1 fw-bold mb-2 d-flex flex-column align-items-center" style="color:#363062;"> 컬러 기반 추천 영화
        <div class="d-flex flex-wrap justify-content-center my-3" >
            <vs-card v-for="(card,idx) in getRecommended_movies" @click="modalClick(card.id)" :key="idx" class="mx-2">
              <template #title>
                <h3 class="fw-bold">{{card.title}}</h3>
              </template>
              <template #img>
                <img :src="getImg_url + card.poster_path" alt="">
              </template>
              <template #text>
                <p class="my-0"> 
                  평점: <span class="ms-1 fs-3 fw-bold" style="color:#CE9461;">{{card.vote_average}}</span>
                </p>
              </template>
              <template #interactions>
                
              </template>
            </vs-card>
          
          <div class="mt-7 fs-2 text-center" style="color:black;">분석결과 결과를 바탕으로 다음 횟수와 같이 장르가 추천되었습니다.<span class="fw-bold d-block" style="color:#001D6E;">{{getSorted_genres}}</span></div>
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

<script>
import { mapGetters } from "vuex";
import axios from 'axios'
import drf from '@/api/drf'
import DetailMovieView from '@/views/DetailMovieView.vue';
export default {
  components: { DetailMovieView },
  name: 'ColorBasedForm',
  data() {
    return{
      test1 : false,
      test2 : false,
      test3 : false,
      test4 : false,
      test_complete : false,
      total : 0,
      selected_color : [],
      result : false,
      selected_genres : {},
      recommended_movies : [],
      sorted_genres : [],
      modalState : false,
      progress: 0,
      isCheck : false,
    }
  },
  computed : {
    ...mapGetters(['getCurrentUser', 'getAuthHeader', 'getImg_url']),
    getRecommended_movies(){
      return this.recommended_movies
    },
    getSorted_genres(){
      return this.sorted_genres
    },
  },
  methods : {

    openNotification(position = null, color) {
          this.$vs.notification({
            color,
            position,
            title: '이미 데이터가 분석되었습니다.',
            text: '서버 과부화를 막기위한 조치입니다...'
          })
        },

    //로딩거는 함수
    openLoading() {

          const loading = this.$vs.loading({
            progress: 0
          })
          const interval = setInterval(() => {
            if (this.progress <= 100) {
              loading.changeProgress(this.progress++)
            }
          }, 20)
          setTimeout(() => {
            loading.close()
            clearInterval(interval)
            this.progress = 0
            this.result = true
          }, 2000)
    },
    modalClick(movie_id){
    this.$store.dispatch('fetchSelectedMovie',movie_id)
    .then(() => {
      this.modalState = !this.modalState
      
      if (this.modalState){
        document.querySelector('html').classList.add('not-scroll')
      }else{
        document.querySelector('html').classList.remove('not-scroll')
      }
    })
  },
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

    CompleteSelect(){

      if(this.isCheck){
        this.openNotification('top-center','danger')
        return
      }

      this.isCheck = true
      this.openLoading()
      //console.log(this.total)
      this.selected_genres = {}
      axios({
        url : drf.movies.getRecommendColorTest(this.total),
        method : 'get',
        headers : this.getAuthHeader
      })
      .then(res => {
        //console.log(res)
        this.recommended_movies = res.data
        
        this.recommended_movies.forEach(movie => {
          movie.genres.forEach(genre => {
            if(this.selected_genres[genre.name]){
              this.selected_genres[genre.name] += 1
            } else {
              this.selected_genres[genre.name] = 1
            }
          })
        });
        this.sorted_genres = []
        for(let name in this.selected_genres){
        this.sorted_genres.push([name,this.selected_genres[name]])
        }
        this.sorted_genres.sort(function(a,b){
          return b[1] - a[1]
        })
      })
      .catch(err => console.log(err))
  
    },

    resetSelect() {
      this.test1 = true
      this.test2 = false
      this.test3 = false
      this.test4 = false
      this.test_complete = false
      this.selected_color = []
      this.result = false
      this.isCheck = false
    },
    ClickPicture(event){
      

      const color = event.target.innerText
      //console.log(color)
      switch (color) {
        case 'White':
          this.total += 1
          setTimeout(() => {
            this.test1 = false
            this.test2 = true
            
          }, 300);
          this.selected_color.push('하양')
          break;
        case 'Black':
          this.total -= 1
          setTimeout(() => {
            this.test1 = false
            this.test2 = true
            
          }, 300);
          this.selected_color.push('검정')
          break;
        case 'Blue':
          this.total -= 1
          setTimeout(() => {
            this.test3 = true
          this.test2 = false
            
          }, 300);
          
          this.selected_color.push('파랑')
          break;
        case 'Green':
          this.total += 1
         setTimeout(() => {
            this.test3 = true
          this.test2 = false
            
          }, 300);
          this.selected_color.push('초록')
          break;
        case 'Orange':
          this.total += 1
          setTimeout(() => {
             this.test4 = true
          this.test3 = false
            
          }, 300);
        
          this.selected_color.push('오렌지')
          break;
        case 'Purple':
          this.total -= 1
          setTimeout(() => {
             this.test4 = true
          this.test3 = false
            
          }, 300);
          
          this.selected_color.push('보라')
          break;
        case 'Yellow':
          this.total += 1

          setTimeout(() => {
          this.test_complete = true
          
          this.test4 = false
            
          }, 500);
          
          this.selected_color.push('노랑')
          break;
        case 'Red':
          this.total -= 1
           setTimeout(() => {
           this.test_complete = true
          this.test4 = false
          }, 500);
         
          this.selected_color.push('빨강')
          break;
        default:
          alert('테스트 값 오류발생')
          break;
      }
    }
  }
}
</script>


<style lang="scss">
@import '@/assets/scss/recommended/recommended.scss';
</style>