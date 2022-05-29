<template>
  <div class="container login-container d-flex flex-column align-items-center">
    <h1 class="mb-3">로그인</h1>
    <div class="center content-inputs">
      <div action="" @submit.prevent="clickLogin">
      <vs-input
        dark
        v-model="user_id"
        label-placeholder="아이디"/>
      <br>
      <vs-input
        type="password"
        v-model="password"
        dark
        label-placeholder="비밀번호"
        icon-after
        @click-icon="hasVisiblePassword = !hasVisiblePassword">
      </vs-input>
      <div class="mt-3 d-flex justify-content-end button-container">
        <vs-button
          shadow :active="active == false" @click.prevent="$router.back()">
          취소
        </vs-button>
        <vs-button
          shadow :active="active == false" @click.prevent="$router.push({name:'signup'})">
          회원가입
        </vs-button>
        <vs-button
        shadow :active="active == false" @click.prevent="clickLogin">
          로그인
        </vs-button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'LoginView',
  props: {
      
    },
  data(){
    return {
      user_id: '',
      password: '',
      active : 1,
    }
  },
  computed: {
    
  },
  methods : {
    //로그인 클릭했으면
    clickLogin(){
      const data = {
        username : this.user_id,
        password : this.password
      }
      this.$store.dispatch('login',data)
      this.$vs.notification({
          color : 'success',
          position : 'top-center',
          title: '로그인 성공',
          text: '정상적으로 로그인 되었습니다.'
      })

      this.user_id = ''
      this.password = ''
    }
  }
}
</script>

<style lang='scss'>
@import '@/assets/scss/LoginView/LoginView.scss';
</style>