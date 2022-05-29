<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light py-3" style="font-family: 'Jua', sans-serif;">
  <div class="container">
    <a class="navbar-brand" href="/">
      <img src="@/assets/image/Thecloud_logo.png" alt="noImage" width="190px" height="30px" class="d-inline-block align-text-top">&nbsp;
      <img src="@/assets/image/Life_logo.png" alt="noImage" width="150px" height="16px" class="d-inline-block align-text-top">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav" >
      <ul class="navbar-nav fw-bold fs-3">
        <li class="nav-item first-nav-item">
           <router-link to="/" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/'}">메인</span></router-link>
        </li>
        <li class="nav-item">
            <router-link to="/movies" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/movies'}">영화 검색</span></router-link>
        </li>
        <li class="nav-item">
            <router-link to="/total-review" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/total-review'}">영화 리뷰</span></router-link>
        </li>
        <li class="nav-item">
            <router-link to="/recommended" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/recommended'}">영화 추천</span></router-link>
        </li>

        <li class="nav-item d-block d-lg-none" v-if="!getIsLoggedIn">
          <router-link to="/login" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/login'}">로그인</span></router-link>
        </li>
        <li class="nav-item d-block d-lg-none" v-if="!getIsLoggedIn">
          <router-link to="/signup" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/signup'}">회원가입</span></router-link>
        </li>

        <li class="nav-item d-block d-lg-none" v-if="getIsLoggedIn">
          <router-link :to="{ name :'my_page' , params : {username : getCurrentUser.username} }" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/my-page'}">마이페이지</span></router-link>
        </li>
        <li class="nav-item d-block d-lg-none" v-if="getCurrentUser.username === 'admin' && getIsLoggedIn">
          <div class="text-decoration-none "><span class="nav-link mx-3"><a href="http://127.0.0.1:8000/admin/">관리자 페이지</a> </span></div>
        </li>
        <li class="nav-item d-block d-lg-none" v-if="getIsLoggedIn">
          <router-link :to="{ name :'logout' , params : {username : getCurrentUser.username} }" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/logout'}">로그아웃</span></router-link>
        </li>
      </ul>
    </div>
    <div>
      <ul class="navbar-nav fs-5">

          <li class="nav-item d-none d-lg-block" v-if="!getIsLoggedIn">
              <router-link to="/login" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/login'}">로그인</span></router-link>
          </li>
          <li class="nav-item d-none d-lg-block login-nav-item" v-if="!getIsLoggedIn">
              <router-link to="/signup" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/signup'}">회원가입</span></router-link>
          </li>

          <li class="nav-item d-none d-lg-block " v-if="getIsLoggedIn">
              <router-link :to="{name :'my_page', params : {username : getCurrentUser.username} }" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive === '/my-page'}">마이페이지</span></router-link>
          </li>
          <li class="nav-item d-none d-lg-block" v-if="getCurrentUser.username === 'admin' && getIsLoggedIn">
           <div class="d-flex"><a class="text-decoration-none d-flex align-items-center " href="http://127.0.0.1:8000/admin/"><span class="d-block">관리자 페이지</span></a></div>
          </li>
          <li class="nav-item d-none d-lg-block login-nav-item" v-if="getIsLoggedIn">
            <router-link :to="{ name :'logout' , params : {username : getCurrentUser.username} }" class="text-decoration-none"><span @click="isClicked" class="nav-link mx-3" :class="{'active': isActive == '/logout'}">로그아웃</span></router-link>
          </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
import { mapGetters,mapActions } from "vuex";

export default {
  name: 'NavbarView',
  data() {
    return {
      isActive: '',
      
    }
  },
  mounted() {
      this.isActive = '/' + location.pathname.split('/')[1]
      
      //this.isActive = location.pathname
  },
  computed : {
    ...mapGetters(['getCurrentUser','getIsLoggedIn',]),

  },
  methods:{
    ...mapActions(['logout']),
    openNotification(position = null, color) {
          this.$vs.notification({
            color,
            position,
            title: '로그아웃 완료',
            text: '정상적으로 로그아웃 되었습니다.'
          })
        },

    isClicked(event){
      this.isActive = '/' + event.target.parentElement.attributes.href.nodeValue.split('/')[1]
      
      
      if(this.isActive === '/total-review'){
        this.$store.dispatch('fetchSelectedUsers',[])
      } else if(this.isActive === '/my-page'){
        this.$store.dispatch('fetchProfile',this.getCurrentUser.username)
      } else if(this.isActive === '/logout'){
        if (this.getIsLoggedIn) {
          this.logout()
          this.openNotification('top-center','success')
        } else {
          alert('잘못된 접근')
          this.$router.back()
        }
      }
    },
  }
}
</script>

<style lang="scss">

</style>

<style scoped lang='scss'>
/* nav 폰트 */
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');

@media all and (min-width:992px){
  li:nth-child(4) {
    border-right: 1px solid gray;
  }
  
  .login-nav-item {
    border-right: 1px solid gray;
  }

  .nav-item {
    border-left: 1px solid gray;
    
  }
}
</style>