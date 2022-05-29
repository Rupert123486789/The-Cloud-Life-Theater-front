<template>
    <div class="container login-container d-flex flex-column align-items-center">
    <h1 class="mb-3">회원가입</h1>
    <div class="center content-inputs">
      <div action="" @submit.prevent="signUpClick" >
      <vs-input
        dark
        v-model="userId"
        :progress="getIdProgress()"
        placeholder="아이디">
        <template v-if="(getIdLength > 0 && getIdLength < 4) || getIdLength >= 20" #message-success>
            아이디는 최소 4자이상 최대 20자 이하입니다.
        </template>
      </vs-input>
      <br>
      <vs-input
        type="password"
        v-model="password1"
        dark
        placeholder="비밀번호"
        icon-after
        :progress="getProgress(password1)"
        >
        <template v-if="getProgress(password1) > 1 && getProgress(password1) <= 99" #message-success>
            비밀번호는 8자이상, 문자와 숫자를 포함시켜 주세요
        </template>
      </vs-input>
      
      <vs-input
        type="password"
        v-model="password2"
        dark
        placeholder="비밀번호 확인"
        icon-after
        :progress="getProgress(password2)" 
        >
        <template v-if="getProgress(password2) > 1 && getProgress(password2) <= 99" #message-success>
            비밀번호는 8자이상, 문자와 숫자를 포함시켜 주세요
        </template>
        
      </vs-input>
      <div v-if="!checkSamePassword()" >
          <span class="password-check-message">두 비밀번호가 같지 않습니다.</span> 
      </div>
      <div class="center content-inputs">
        <vs-input v-model="name" placeholder="이름" 
        :progress="(getNameLength >= 1 && getNameLength <= 20) ? 100 : 0"/>
      </div>
      <div v-if="getNameLength > 20" >
          <span class="name-check-message">이름의 길이는 최소 1자~최대20자 입니다.</span> 
      </div>

      <div class="mt-3 d-flex justify-content-end button-container">
        <vs-button @keyup.enter="signUpClick"
          shadow :active="active == 1" @click.prevent="cancleClick">
          취소
        </vs-button>
        <vs-button
        :disabled = getCheckAllLength
        shadow :active="active == 1" @click.prevent="signUpClick">
          회원가입
        </vs-button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'SignUpView',
  data(){
    return {
      userId: '',
      password1:'',
      password2:'',
      active : 0,
      name : ''
    }
  },
  computed: {
        getNameLength(){
          return this.name.length
        },
        getIdLength(){
          return this.userId.length
        },
        getCheckAllLength(){
          return !this.getProgress(this.password1) >= 100 || !this.getProgress(this.password2) >= 100 || !this.getIdProgress() || !this.name || this.password1 !== this.password2
        }
      },
  methods:{
    cancleClick(){
      this.username = ''
      this.password1 = ''
      this.password2 = ''
      this.userId = ''
      this.$router.back()
    },
    signUpClick(){
      const data = {
        username : this.userId,
        password1 : this.password1,
        password2 : this.password2,
        first_name : this.name
      }
      //console.log(data)
      this.$store.dispatch('signUp',data)
      this.name = ''
      this.password1 = ''
      this.password2 = ''
      this.userId = ''

      this.$vs.notification({
          color : 'success',
          position : 'top-center',
          title: '회원가입 성공',
          text: '정상적으로 회원가입 되었습니다.'
        })
    },
    getIdProgress(){
      if (this.getIdLength >= 4 && this.getIdLength <= 20){
        return 100
      } else {
        return 0
      }
    },
    getProgress(userId) {
      let progress = 0

      // at least one number
      if (/\d/.test(userId)) {
        progress += 30
      }

      // at menons a lowercase
      if (/(.*[a-z].*)/.test(userId)) {
        progress += 30
      }

      // more than 8 digits
      if (userId.length >= 8) {
        progress += 40
      }

      return progress
    },
    checkSamePassword(){
      if (this.password1.length > 0 && this.password2.length > 0 && this.password1 !== this.password2){
        return false
      }
      return true
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/TotalVuesaxCustom.scss';
</style>

<style scoped>
@import "@/assets/scss/LoginView/LoginView.scss";
</style>