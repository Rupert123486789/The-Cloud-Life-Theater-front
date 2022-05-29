<template>
  <div class="logout-container d-flex justify-content-center align-items-center h-100" style="marging: 0 auto;">
    <h1 class="fs-1">로그아웃 중입니다...</h1>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LogoutView',
  methods: {
      ...mapActions(['logout']),
      openNotification(position = null, color) {
          this.$vs.notification({
            color,
            position,
            title: '로그아웃 완료',
            text: '정상적으로 로그아웃 되었습니다.'
          })
        },
    },
    computed: {
      ...mapGetters(['getIsLoggedIn'])
    },
    created() {
      if (this.getIsLoggedIn) {
        //this.openNotification('top-center','success')
        //this.logout()
      } else {
        alert('잘못된 접근')
        this.$router.back()
      }
    },  
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Single+Day&display=swap');

.logout-container {
  font-family: 'Single Day', cursive;
}
</style>