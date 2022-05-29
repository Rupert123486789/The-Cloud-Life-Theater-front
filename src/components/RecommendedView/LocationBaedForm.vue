<template>
  <div class="like-based-form-container container d-flex flex-column align-items-center">
    <div class="recommended-explation d-flex flex-column align-items-center" :class="{'margin-custom-top' : !isSelected}">
      <div class="fs-2 sub-title text-center" style="color:#646FD4;">위치 기반 추천이란?</div>
      <div class="fs-4 text-center text-container my-3">사용자의 현재 위치를 기반으로 경도와 위도, 태양 위치, 고도 등을 종합적으로 계산하여 관련 영화를 추천하는 재미있는 알고리즘입니다. 
        현재 위치는 아이피를 기준으로 가장 가까운 위치로 설정됩니다<span class="fs-6 d-block">(단, 위치 기반 관련 데이터 수집에 동의하지 않는다면 해당 서비스를 이용할 수 없습니다.)</span></div>
      <vs-button transparent :active="false" @click="active = true">
        버튼을 눌러 확인하기
      </vs-button>
    </div>
    <!-- 로딩바 구현-->
    <div class="loading-page" v-if="isLoading">
      <div>현재 사용자의 위치 정보를 받아오고 있습니다...</div>
      <div>약간의 시간이 걸릴 수 있습니다...</div>
    </div>
    <div v-if='isSelected' class="d-flex mt-5 flex-column align-items-center flex-wrap justify-content-start like-result-container p-3">
      <div class="text-center fs-1 fw-bold mb-2" style="color:#363062;"> 현재 위치 기반 추천 영화</div>
      <div class="text-center fs-2">분석결과 사용자의 현재 위치는<span class="fw-bold" style="color : #001D6E">{{getAddress.address}}</span> 입니다.</div>
      <div class="text-center fs-2">현재 위치의 경도는 <span class="fw-bold" style="color : #001D6E">{{getAddress.longitude}}</span>
        위도는 <span class="fw-bold" style="color : #001D6E">{{getAddress.latitude}}</span> 입니다.
      </div>
      
      <div class="d-flex flex-wrap my-3">
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
        
      </div>
      <div class="fs-2 text-center">분석결과 결과를 바탕으로 다음 횟수와 같이 장르가 추천되었습니다.<span class="fw-bold d-block" style="color:#001D6E;">{{getSorted_genres}}</span></div>
    </div>

    <!-- 예 아니오 입력하는 폼-->
    <vs-dialog width="550px" not-center v-model="active">
        <template #header>
          <h4 class="not-margin">
            위치 정보 사용 <b>동의</b>
          </h4>
        </template>


        <div class="con-content">
          <p>
             위치정보사업자가 개인위치정보를 수집하고자 하는 경우에는 미리 다음의 내용을 이용약관에 명시한 후 개인위치정보주체의 동의를 받아야 합니다(규제「위치정보의 보호 및 이용 등에 관한 법률」 제18조제1항 및 「위치정보의 보호 및 이용 등에 관한 법률 시행령」 제22조).
              위치정보사업자의 상호, 주소, 전화번호 그 밖의 연락처
              개인위치정보주체 및 법정대리인(규제「위치정보의 보호 및 이용 등에 관한 법률」 제25조제1항에 따라 법정대리인의 동의를 얻어야 하는 경우로 한정함)의 권리와 그 행사방법
              위치정보사업자가 위치기반서비스사업자에게 제공하고자 하는 서비스의 내용
              위치정보 수집사실 확인자료의 보유근거 및 보유기간
              개인위치정보의 수집방법
              개인위치정보주체는 위 동의를 하는 경우 개인위치정보의 수집 범위 및 이용약관의 내용 중 일부에 대한 동의를 유보할 수 있습니다(규제「위치정보의 보호 및 이용 등에 관한 법률」 제18조제2항 및 제25조제2항).
          </p>
          <div class="d-flex justify-content-end"><b class="fs-2">동의하십니까?</b> </div>
        </div>

        <template #footer>
          <div class="con-footer d-flex justify-content-end">
            <vs-button @click="noClick()" dark transparent>
              아니오
            </vs-button>
            <vs-button @click="yesClick()" transparent>
              예
            </vs-button>
          </div>
        </template>
      </vs-dialog>

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
import axios from 'axios'
import drf from '@/api/drf'
import { mapGetters } from "vuex";
import DetailMovieView from '@/views/DetailMovieView.vue';

export default {
  components: { DetailMovieView },
  name: 'LocationBasedForm',
  data(){
    DetailMovieView
    return {
      recommended_movies : [],
      selected_genres : {},
      address : {},
      sorted_genres : [],
      active : false,
      modalState : false,
      isLoading : false,
      isSelected : false,
    }
  },
  computed : {
    ...mapGetters(['getCurrentUser', 'getAuthHeader', 'getImg_url']),
    getRecommended_movies(){
      return this.recommended_movies
    },
    getAddress(){
      return this.address
    },
    getSorted_genres(){
      return this.sorted_genres
    },
  },
  methods : {

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
  openNotification(position = null, color,title,text) {
        this.$vs.notification({
          color,
          position,
          title: title,
          text: text,
        })
      },
    noClick(){
      this.active = false
      this.openNotification('top-center','danger','서비스 사용 불가','해당 서비스는 위치 정보 사용 동의가 있어야사용가능합니다.')
    },

    yesClick(){
      
      if(this.isSelected){
        this.openNotification('top-center','danger','서버 과부하 방지','이미 분석된 데이터가 존재합니다.')
        this.active = false
        return
      }

      this.active = false

      this.isLoading = true
      this.selected_genres = {}
      axios({
        url: drf.movies.getSunRecommended(this.getCurrentUser.username),
        headers : this.getAuthHeader,
        method : 'get',
      })
      .then(res => {
        this.recommended_movies = res.data[0]
        
        this.address = res.data[1]

        let new_address = this.address.address.split('+').slice(0,2)
        this.address.address = new_address
        
        this.recommended_movies.forEach(movie => {
          movie.genres.forEach(genre => {
            if(this.selected_genres[genre.name]){
              this.selected_genres[genre.name] += 1
            } else {
              this.selected_genres[genre.name] = 1
            }
          })
        });
        //console.log(this.selected_genres)
        this.sorted_genres = []
        for(let name in this.selected_genres){
        this.sorted_genres.push([name,this.selected_genres[name]])
      }

        this.sorted_genres.sort(function(a,b){
          return b[1] - a[1]
        })
      })

      setTimeout(() => {
        this.isLoading = false
        this.isSelected = true
      }, 2500);
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/recommended/recommended.scss';
</style>