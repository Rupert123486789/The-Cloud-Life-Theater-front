<template>
  <div>
  <div class="recommend-container">
    <div class="container-md total-movies-container">
    <div class="row d-flex">
      <div class="col-12 col-md-6"><h1 class="page-title d-inline-block fw-bold">영화 추천</h1>&nbsp;
        <span class="d-none d-md-inline-block fs-5">알고리즘을 기반으로 영화를 추천해드립니다.!</span> 
      </div>
      
      <div class="col-12 col-md-6 d-flex search-btm-container justify-content-end align-items-end p-0 ">
        <div class="menu-box d-flex align-items-center pointer custom-border mx-1" :class="{'is-selected':isLikedBased}" @click="selectLikedBased">좋아요 기반 추천</div>
        <div class="menu-box d-flex align-items-center pointer custom-border mx-1" :class="{'is-selected':isLocationBased}" @click="selectLocationBased">위치 기반 추천</div>
        <div class="menu-box d-flex align-items-center pointer custom-border mx-1" :class="{'is-selected':isColorBased}" @click="selectColorBased">컬러 기반 추천</div>
      </div>
      <div class="line"></div>
    </div>
    <hr>
  </div>
  </div>
  <liked-based-formview v-if="isLikedBased"/>
  <location-baed-form v-if="isLocationBased"/>
  <color-based-form v-if="isColorBased"/>
</div>
</template>

<script>
import LikedBasedFormview from '@/components/RecommendedView/LikedBasedFormview.vue'
import LocationBaedForm from '@/components/RecommendedView/LocationBaedForm.vue'
import ColorBasedForm from '@/components/RecommendedView/ColorBasedForm.vue'
export default {
  components: { LikedBasedFormview ,LocationBaedForm,ColorBasedForm},
  name: 'RecommendedView',
  data() {
    return {
      isLikedBased : true,
      isLocationBased : false,
      isColorBased : false,
    }
  },
  methods : {
    selectLikedBased(){
      this.isLikedBased = true
      this.isLocationBased = false
      this.isColorBased = false
    },
    selectLocationBased(){
      this.isLikedBased = false
      this.isLocationBased = true
      this.isColorBased = false
    },
    selectColorBased(){
      this.isLikedBased = false
      this.isLocationBased = false
      this.isColorBased = true
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/recommended/recommended.scss';
</style>