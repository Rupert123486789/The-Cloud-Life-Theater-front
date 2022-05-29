<template>
  <div class="container total-user-my-page-container">
    <div class="user-my-page-container">
      <div class="user-info-container d-flex flex-column align-items-center">
        <h2 class="sub-title d-flex flex-wrap" ><span class="" style="font-size:3.5rem;">{{getProfile.username}}님의</span>&nbsp;프로필
        <span v-if="getCurrentUser.username !== getProfile.username">
          <vs-button v-if="!getFollowings_info.isFollowed" class="d-inline-block ms-5 change-btn" dark @click="followClick">팔로우</vs-button>
          <vs-button v-if="getFollowings_info.isFollowed" class="d-inline-block ms-5 change-btn" dark @click="followClick">팔로우 취소</vs-button>
        </span>
        </h2>
        

        <div class="fs-2 d-flex flex-wrap">
          <div class="mx-3" style="cursor:pointer;" @click="followerClick">팔로워: <span style="font-size:3.0rem;">{{getFollowings_info.followers_count}}</span>명</div>
          <div class="mx-3" style="cursor:pointer;" @click="followingClick">팔로잉: <span style="font-size:3.0rem;">{{getFollowings_info.followings_count}}</span>명</div>
          <div v-if="getCurrentUser.username === getProfile.username" class="d-flex align-items-center">
            <vs-button style="height : 35px;" @click="clickMyFollwoing">팔로잉 관리</vs-button>
          </div>
        </div>
          
        <hr>
        <div class="d-flex flex-column justify-content-start flex-wrap align-items-center">
          <div class="" style="">  
              <div><img src="//cinefox.com/Modules/member/_view/common/images/ca2.png" alt="프로필 이미지"></div>
              <div class="my-4">아이디 :<span class="ms-5">{{getProfile.username}}</span></div>
              <div class="d-flex" v-if="getProfile.username === getCurrentUser.username">
              <div class="my-4" >비밀번호: </div>
              <vs-button class="d-inline-block ms-5 change-btn" dark @click.prevent="passwordChange = true">비밀번호 변경하기</vs-button>
              </div>
          
              <vs-dialog width="300px" blur prevent-close not-center v-model="passwordChange">
                <template #header>
                  <h4 class="not-margin">
                    변경하실 <b>비밀번호</b>를 입력하세요 
                  </h4>
                </template>


              <div class="con-content">
                <vs-input type='password' v-model="new_password1" placeholder="비밀번호"></vs-input>
                <vs-input type='password' v-model="new_password2" placeholder="비밀번호 확인"></vs-input>
                <div class="d-flex justify-content-end">
                  <vs-button border dark transparent :active="false" @click="cancleClick">
                    취소
                  </vs-button>
                  <vs-button border dark transparent :active="false" @click="passwordChangeClick">
                    변경
                  </vs-button>
                </div>
              </div>
              <vs-alert color="danger" v-model="alert2">
                <template #title>
                  비밀번호 오류
                </template>
                  두 비밀번호는 동일해야합니다.!
              </vs-alert>
            </vs-dialog>
              <div class="my-4 d-flex">
                이름: <span class="ms-5">{{getProfile.first_name}}</span>
                <div>
                  <vs-button v-if="getProfile.username === getCurrentUser.username" class="d-inline-block ms-5 change-btn" dark @click="nameChange = !nameChange">이름 수정하기</vs-button>
                </div>
              </div>
              <vs-dialog width="300px" not-center v-model="nameChange" class="name-dialog-custom">
              <template #header>
                <h4 class="not-margin">
                  변경할 <b>이름을</b> 입력하세요 
                </h4>
              </template>

              <div class="con-content">
                <vs-input v-model="firstName" placeholder="1자이상 20자 이하"></vs-input>
                <v-alert dense outlined type="error" :value='alert'>
                  이름은 <strong>1자 이상</strong> <strong>20자 이하</strong>여야 합니다.
                </v-alert>
              </div>

              <template #footer>
                <div class="con-footer d-flex justify-content-end">
                  <vs-button @click="nameChangeClick" transparent>
                    Ok
                  </vs-button>
                  <vs-button @click="cancleClick" dark transparent>
                    Cancel
                  </vs-button>
                </div>
              </template>
            </vs-dialog>

            <div class="my-4">
            <div>방문 횟수: <span>{{getProfile.visit_count || 1}}</span></div>
            <div>멤버 등급: &nbsp;&nbsp;&nbsp;현재
              <span class="mx-3">  
                <span v-if="getProfile.visit_count <= 100">
                  관람객
                </span>
                <span v-else-if="getProfile.visit_count > 100 && getProfile.visit_count < 500">
                  영화 주니어
                </span>
                <span v-else-if="getProfile.visit_count > 500 && getProfile.visit_count < 1000">
                  영화 매니아
                </span>
                <span v-else>
                  영화광
                </span>
              </span>
              등급입니다.   
              </div>  
            </div>
          </div>
          <hr class="w-100">
        <div class="computed_like d-flex flex-column align-items-center">
          <h2>영화 성향 분석</h2>
          <hr>
            <div style="d-flex justify-content-center position: relative; ">
            <canvas id="chart" class="me-0" height="400" width="400"></canvas>
          </div>
          <div v-if="getLikedTendency.max_name">
            <div>{{getProfile.username}}님의 선호 장르는 {{getLikedTendency.max_name}} 입니다.</div>
            <div>{{getProfile.username}}님의 비선호 장르는 {{getLikedTendency.min_name}} 입니다.</div>
          </div>
          <div v-if="!getLikedTendency.max_name">
            <div>데이터가 부족합니다. 좋아요를 눌러주세요</div>
          </div>
        </div>
      </div>
      </div>
        <hr>
      <div>
        <h2 class="text-center mb-7 fs-1">좋아요 목록</h2>
         <div class="d-flex justify-content-start flex-wrap row row-cols-2 row-cols-lg-4 row-cols-xxl-6 g-3">
          <vs-card type="2" v-for="(card,idx) in $vs.getPage(getProfile.like_movies, page_like, max)" @click="modalClick(card.id)" :key="idx">
            <template #title>
              <h3 class="fs-2">{{card.title}}</h3>
            </template>
            <template #img>
              <img :src="getImg_url + card.poster_path" alt="">
            </template>
            <template #text>
              <p></p>
            </template>
            <template #interactions>
              <div class="d-flex align-items-center">
                <vs-button class="btn-chat" transparent>
                  <v-rating
                    color="orange" length="1" readonly
                    size="25" :value="5"
                  ></v-rating>
                  <span class="span d-inline-block" style="color:white; font-size:2.5rem;">
                    {{card.vote_average}}
                  </span>
                </vs-button>
              </div>
            </template>
          </vs-card>
         </div>
        <div class="text-center mt-5">
          <v-pagination v-model="page_like" :length="$vs.getLength(getProfile.like_movies, max)" circle></v-pagination>
        </div>
      </div>
      <hr>
      <div>
        <h2 class="text-center mt-7 my-7 fs-1">플레이 리스트 목록</h2>
        <div class="d-flex justify-content-start flex-wrap row row-cols-2 row-cols-lg-4 row-cols-xxl-6 g-3">
          <vs-card type="2" v-for="(card,idx) in $vs.getPage(getProfile.pick_movies, page_pick, max)" :key="idx" @click="modalClick(card.id)">
            <template #title>
              <h3 class="fs-2">{{card.title}}</h3>
            </template>
            <template #img>
              <img :src="getImg_url + card.poster_path" alt="" >
            </template>
            <template #text>
              <p></p>
            </template>
            <template #interactions>
              <div class="d-flex align-items-center">
                <vs-button class="btn-chat" transparent>
                  <v-rating
                    color="orange" length="1" readonly
                    size="25" :value="5"
                  ></v-rating>
                  <span class="span d-inline-block" style="color:white; font-size:2.5rem;">
                    {{card.vote_average}}
                  </span>
                </vs-button>
              </div>
            </template>
          </vs-card>
         </div>
           <div class="text-center my-5">
            <v-pagination v-model="page_pick" :length="$vs.getLength(getProfile.pick_movies, max)" circle></v-pagination>
          </div>
      </div>
    </div>
    
    <!-- 팔로우 나의 팔로잉 목록(삭제가능) 모달창 영역-->
    <vs-dialog blur prevent-close overflow-hidden auto-width v-model="myFollowModal" >
      <follow-my-form :followInfo="getFollow_info" @delete-complete="deleteComplete"  
      @complete-click="myFollowModal = false"/>
    </vs-dialog>

    <!-- 모달창 구현-->
    <div class="modal_custom" v-if="modalState">
      <div class="modal_custom__window">
        <detail-movie-view :selectedMovie="this.$store.getters.getSelectedMovie" 
        @update-detail-movie="updateDetailPage"/>
      </div>
      <div class="modal_custom__overlay" @click.self="modalCheck"></div>
    </div>

    <!-- 팔로우 정보 모달창 영역-->
    <vs-dialog blur overflow-hidden auto-width v-model="followModal" >
      <follow-info-form :followInfo="follow_info" @selectComplete="followModal=false" :followChildInfo="follow_child_info"/>
    </vs-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from "vuex";
import drf from '@/api/drf';
import { Chart, registerables } from "chart.js";
import DetailMovieView from './DetailMovieView.vue';
import FollowInfoForm from '@/components/UserMyPageView/FollowInfoForm.vue';
import FollowMyForm from '@/components/UserMyPageView/FollowMyForm.vue';
Chart.register(...registerables)
const data = {
  labels: [
    '액션', '모험', '애니메이션', '코미디', '범죄', '다큐멘터리', '드라마','가족', 
    '판타지', '역사', '공포', '음악', '미스터리', '로맨스', 'SF', 'TV 영화', '스릴러', '전쟁', '서부'
  ],

};

export default {
  components: { DetailMovieView, FollowInfoForm, FollowMyForm, },

  name: 'UserMyPage',
  data(){
    return {
      isFollow : false,
      myChart: null,
      isCurrentUser : false,
      user : this.getProfile,
      firstName : '',
      new_password1 : '',
      new_password2 : '',
      nameChange : false,
      alert : false,
      alert2 : false,
      passwordChange : false,
      active : 0,
      page_like : 1,
      page_pick : 1,
      max : 12,
      modalState : false,
      tendency : this.getLikedTendency,
      followModal : false,
      follow_info : [],
      follow_child_info : '',
      myFollowModal : false,
    }
  },
  updated() {
      this.myChart.data.datasets[0].data = this.getLikedTendency.data
      this.myChart.update()
      
  },
  methods : {
    deleteComplete(){
      //console.log('여기는 부모')
      this.$store.dispatch('fetchFollowingsInfo',this.getCurrentUser.username)
      this.follow_info = this.getFollowings_info.followings
    },
    clickMyFollwoing(){
      this.myFollowModal = true
      this.$store.dispatch('fetchFollowingsInfo',this.getProfile.username)
      this.follow_info = this.getFollowings_info.followings

    },
    followerClick(){
      
      this.$store.dispatch('fetchFollowingsInfo',this.getProfile.username)
      this.follow_info = this.getFollowings_info.followers
      this.followModal = true
      this.follow_child_info = '팔로워'

    },
    followingClick(){
      
      this.followModal = true
      this.$store.dispatch('fetchFollowingsInfo',this.getProfile.username)
      this.follow_info = this.getFollowings_info.followings
      this.follow_child_info = '팔로잉'

    },
    followClick(){
      this.$store.dispatch('Follow',this.getProfile.username)
    },
    updateDetailPage(){
      this.modalState = false
      setTimeout(() => {
        this.modalState = true
      },500)
      
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
      .then(() => {
        this.modalState = !this.modalState
        
        if (this.modalState){
          document.querySelector('html').classList.add('not-scroll')
        }else{
          document.querySelector('html').classList.remove('not-scroll')
        }
      })
    },
    fillData(dataCustom) {
      const ctx = document.getElementById('chart');
      this.myChart = new Chart(ctx, {
          type: 'radar',
          data: {
            ...data,
            datasets: [{
            label: '좋아요 성향',
            data: dataCustom,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
          }]
          },
          options: {
          responsive: false,
          elements: {
            line: {
              borderWidth: 3
            }
          }
          },
      });
    },
    openNotification(position = null, color, text, title) {
          this.$vs.notification({
            color, position, text: text, title: title
          })
    },
    cancleClick(){
      this.new_password1 = ''
      this.new_password2 = ''
      this.firstName = ''
      this.nameChange = false
      this.passwordChange = false
      this.alert = false
      this.alert2 =false
    },
    nameChangeClick(){
      if(this.firstName.length == 0 || this.firstName.length > 20){
        //this.alert('이름은 1자 이상 20자 이하여야합니다.')
        this.alert = true
        return
      }
     
    this.$store.dispatch('updateFrofile', this.firstName)
    this.nameChange = false
    this.firstName = ''
    this.openNotification('bottom-center','dark','이름이 변경되었습니다.','이름 변경 완료!')
    },
    passwordChangeClick(){
      
      if(this.new_password1.length === 0 || this.new_password2.length === 0){
        this.openNotification('bottom-center','danger','비밀번호를 입력해주세요.','비밀번호 변경 오류!')
        return
      }

      if(this.new_password1 !== this.new_password2){
        this.alert2 = true
        return
      }
      
      axios({
        url : drf.accounts.passwordChange(),
        method : 'POST',
        data : {
          new_password1 : this.new_password1,
          new_password2 : this.new_password2,
        },
        headers : this.$store.getters.getAuthHeader,
      })
      .then(() => {
        this.openNotification('top-center','dark','비밀번호가 변경되었습니다.','비밀번호 변경 완료!')
        this.cancleClick()
      })
      .catch(err => console.log(err))
    }
  },
  computed:{
    ...mapGetters(['getCurrentUser','getProfile','getAuthHeader', 'getLikedTendency',
    'getImg_url', 'getFollowings_info',]),
    getFollow_info(){
      return this.getFollowings_info.followings
    }
  },
  created(){
    // console.log('파라미터'+this.$route.params.username)
    // console.log('현재유저'+this.getCurrentUser.username)
    //현재 유저와 파라미터의 유저이름과 같은지 확인
    if (this.$route.params.username === this.getCurrentUser.username){
      this.isCurrentUser = true
    }
    //console.log(this.$route.params.username)
    this.$store.dispatch('fetchProfile',this.$route.params.username)
    
    //현재 유저 정보 받아
    //this.$store.dispatch('fetchProfile')
  },
  mounted(){
    //console.log('여기는 마운티드',this.getLikedTendency.data)
    this.fillData(this.getLikedTendency.data);
    this.$store.dispatch('fetchFollowingsInfo',this.getProfile.username)
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/UserView/UserMyPage.scss';

</style>

