<template>
  <div class="container-custom d-flex flex-column" >
    <div class="mb-1" id="player-container">
      <!-- 유튜브 영화 재생-->
      <iframe id="ytplayer" type="text/html" width="100%" height="500"
        :src="getYoutubeKey"
        frameborder="0"/>
    </div>
    <div class="d-flex flex-column flex-lg-row justify-content-lg-between mb-3">
      <div class="d-flex flex-column fs-5 movie-etc-info-container order-1 order-lg-0">
        <div>제목: <span class="movie-title">{{selectedMovie.title}}</span></div>
        <div>평점: <span>{{selectedMovie.vote_average}}</span> </div>
        <div>개봉날짜: <span>{{selectedMovie.release_date}}</span></div>
        <div>등급: <span v-if="selectedMovie.adult">청소년 관람 불가</span><span v-if="!selectedMovie.adult">청소년 관람 가능</span></div>
        <div>장르: <span v-for="(genre,idx) in selectedMovie.genres" :key="idx">[{{genre['name']}}]</span></div>
      </div>
      <div class="d-flex justify-content-end order-0 order-lg-1 mb-5">
        <div class="d-flex like-container justify-content-center align-items-center me-2 playlist-btn-container" @click="playlistClick">
          <div v-show="!getPlaylist_info.isLiked"><v-icon x-large>mdi-playlist-plus</v-icon></div>
          <div v-show="getPlaylist_info.isLiked"><v-icon x-large>mdi-playlist-remove</v-icon></div>
        </div>
        <div class="d-flex like-container justify-content-center align-items-center" @click="likeClick">
          <div v-if="!getLikeInfo.isLiked"><img src="@/assets/image/like-button.png" alt="" width="50px" class="d-block"></div>
          <div v-if="getLikeInfo.isLiked"><img src="@/assets/image/liked-button.png" alt="" width="50px" class="d-block"></div>
          <div class="ms-4 fs-2 like-count" >{{getLikeInfo.liked_cnt}}</div>
        </div>
      </div>
      
    </div>
    <h3>줄거리</h3>
    <p class="mt-2 fs-5" style="font-family: 'Hahmlet', serif;">{{selectedMovie.overview}}</p>
    <h3 class="mt-3">배우</h3>
    <div class="d-flex flex-wrap actor-container my-2 mb-5">
      <div v-for="(actor,idx) in selectedMovie.actors" :key="idx" class="actor-img-container my-3">
          <img :src="$store.getters.getImg_url + actor.profile_path" alt="배우사진" width="120px" 
        class="actor-img" onerror="this.src='https://png.clipart.me/istock/previews/9349/93493545-people-icon.jpg'">
        <div class="actor-img-name">{{actor.name}}</div>
      </div>
    </div>
    <h3>제작진</h3>
    <div class="d-flex flex-wrap actor-container mt-2 mb-5">
      <div v-for="(director,idx) in selectedMovie.directors" :key="idx" class="actor-img-container my-3">
        <img :src="$store.getters.getImg_url + director.profile_path" alt="제작진사진" width="120px" class="actor-img"
        onerror="this.src='https://png.clipart.me/istock/previews/9349/93493545-people-icon.jpg'">
        <div class="actor-img-name">{{director.name}}</div>
      </div>
    </div>
    <div class="fs-3">연관 영화</div>
    <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 row-cols-xxl-6" id="select-movie-container">
      <div class="col curser-pointer" v-for="(movie,idx) in getSameGenres " :key="idx" @click="modalClick(movie)">
        <vs-card type="2" >
          <template #title>
            <h3>{{movie.title}}</h3>
          </template>
          <template #img>
            <img :src="getImg_url + movie.poster_path" onerror="this.src='https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'">
          </template>
          <template #text>
            <p></p>
          </template>
          <template #interactions>
            <div class="d-flex align-items-center">
              <vs-button class="btn-chat" >
                <v-rating
                  color="orange" length="1" readonly
                  size="25" :value="5"
                ></v-rating>
                <span class="span fs-5 d-inline-block">
                  {{movie.vote_average}}
                </span>
              </vs-button>
            </div>
          </template>
        </vs-card>
      </div> 
    </div>
    <hr>
    <div class="d-flex justify-content-center">
      <h2>영화 한 줄평</h2>
    </div>   
      <movie-comment-form />
    <hr>
    <div class="ms-5"><h4>댓글: <span style="color:#FFD9C0;">{{getAllMovieCommentsCnt}}</span> 개</h4></div>
    <movie-comment-list-view />
  </div>
</template>

<script>
import MovieCommentForm from '@/components/DetailMovieView/MovieCommentForm.vue'
import MovieCommentListView from '@/components/DetailMovieView/MovieCommentListView.vue'
import {mapGetters} from 'vuex'
import drf from '@/api/drf'
import axios from 'axios'

export default {
  name: 'DetailView',
  data(){
    return{
      active : 0,
      isliked : false,
      liked_cnt : 0,
      isPlaylist : false,
      playlist_cnt : 0,
    }
  },
  props : {
    selectedMovie : Object,
    selected : Boolean,
  },
  components : {
    MovieCommentForm,
    MovieCommentListView
  },
  computed: {
    ...mapGetters(['getAllMovieCommentsCnt', 'getAuthHeader', 'getCurrentUser', 
    'getSelectedMovie', 'getSameGenres','getImg_url','getLikeInfo','getPlaylist_info','getProfile']),
    getYoutubeKey(){
      return `https://www.youtube.com/embed/${this.selectedMovie.youtube_key}?autoplay=1&mute=1&fs=1`
    },
    getLikedCnt(){
      return this.liked_cnt
    },
    getIsLiked(){
      return this.isliked
    }
  },
  watch : {
    $route(to,from){
      if(to.path != from.path) {
        //console.log(to.path + ' ' +from.path)
      }
    }
  },
  methods : {
    modalClick(movie){
      //비동기로 해당 영화에 대한 정보를 가져온다.
      this.$store.dispatch('fetchSelectedMovie',movie.id)
      this.$emit('update-detail-movie')
    },
    playlistClick(){
      axios({
        url : drf.movies.MoviePick(this.getSelectedMovie.id),
        method : 'POST',
        headers : this.getAuthHeader
      })
      .then(res => {
      
      if (res.data.pick_users.includes(this.getCurrentUser.pk)){
        this.isPlaylist = true
      } else {
        this.isPlaylist = false
      }
      this.$store.commit('SET_PLAYLIST_INFO',{
        isLiked : this.isPlaylist,
      })
       if(this.getCurrentUser.username === this.getProfile.username){
          this.$store.dispatch('fetchProfile',this.getCurrentUser.username)
        }
      
    })
    .catch (err => console.log(err))
    },
    likeClick(){
      const URL = drf.movies.likeMovie(this.getSelectedMovie.id)

      axios({
        url : URL,
        method : 'POST',
        headers : this.getAuthHeader
      })
      .then(res => {
        this.liked_cnt = res.data.like_users.length
        if (res.data.like_users.includes(this.getCurrentUser.pk)){
          this.isliked = true
        } else {
          this.isliked = false
        }
        this.liked_cnt = res.data.like_users.length
        this.$store.commit('SET_LIKE_INFO',{
          isLiked : this.isliked,
          liked_cnt : this.liked_cnt,
        })

        if(this.getCurrentUser.username === this.getProfile.username){
          this.$store.dispatch('fetchProfile',this.getCurrentUser.username)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  created(){
    
  },
  mounted(){
      
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/DetailMovieView/DetailMovieView.scss';

</style>