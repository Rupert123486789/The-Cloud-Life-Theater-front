<template>
  <div class="error-container">
    <div class="error-text-box d-flex flex-column justify-content-start align-items-center mt-10">
      <h1>페이지 요청 오류!!</h1>
      <p>올바른 주소로 요청을 해주세요!</p>
  </div>

  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
@import '@/assets/scss/Totalscss.scss';
@import url('https://fonts.googleapis.com/css2?family=Single+Day&display=swap');


.error-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('https://img.freepik.com/free-vector/404-error-page-not-found-banner-with-cable-and-socket-or-cord-plug-for-website-blue_249405-130.jpg?w=1380');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  
  
  & .error-text-box{
    font-family: 'Single Day', cursive;
    margin : 0 auto;
    height: 80%;
  }
}

</style>