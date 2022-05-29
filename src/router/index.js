import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UserMyPage from '@/views/UserMyPage.vue'
import LoginView from '@/views/LoginView.vue'
import DetailMovieView from '@/views/DetailMovieView.vue'
import SignUpView from '@/views/SignUpView.vue'
import TotalMovies from '@/views/TotalMovies.vue'
import CreateReviewView from '@/views/CreateReviewView.vue'
import ReviewDetail from '@/views/ReviewDetail.vue'
import TotalReviewPerMovieView from '@/views/TotalReviewPerMovieView.vue'
import TotalReviewView from '@/views/TotalReviewView.vue'
import ReviewDetailTotal from '@/views/ReviewDetailTotal.vue'
import CreateReviewTotal from '@/views/CreateReviewTotal.vue'
import LogoutView from '@/views/LogoutView.vue'
import UpdateReviewTotalForm from '@/views/UpdateReviewTotalForm.vue'
import RecommendedView from '@/views/RecommendedView.vue'
import NotFound404 from '@/views/NotFound404.vue'

import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/my-page/:username',
    name: 'my_page',
    component: UserMyPage
  },
  {
    path: '/login',
    name: 'login',
    component : LoginView
  },
  {
    path: '/logout',
    name: 'logout',
    component : LogoutView
  },
  {
    path: '/detail',
    name:'detail',
    component : DetailMovieView
  },
  {
    path:'/signup',
    name: 'signup',
    component : SignUpView
  },
  {
    path:'/movies',
    name:'movies',
    component: TotalMovies
  },
  {
    path:'/review-create',
    name: 'review_create',
    component: CreateReviewView
  },
  {
    path:'/review-detail',
    name: 'review_detail',
    component: ReviewDetail
  },
  {
    path:'/total-review-per-movie',
    name: 'total_review_per_movie',
    component: TotalReviewPerMovieView
  },
  {
    path:'/total-review',
    name: 'total_review',
    component: TotalReviewView
  },
  {
    path:'/total-review-detail/:review_id',
    name: 'total_review_detail',
    component: ReviewDetailTotal
  },
  {
    path:'/total-review-create/:movie_id',
    name: 'total_review_create',
    component: CreateReviewTotal
  },
  {
    path:'/total-review-update/:movie_id',
    name: 'total_review_update',
    component: UpdateReviewTotalForm
  },
  {
    path:'/recommended',
    name: 'recommended',
    component: RecommendedView
  },
  {
    path: '/404',
    name:'NotFound404',
    component : NotFound404
  },
  {
    path:'*',
    redirect : '/404',
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    to,
    from,
    savedPosition
    return { x: 0, y: 0 }
  },
})

router.beforeEach((to, from, next) => {
  // 이전 페이지에서 발생한 에러메시지 삭제
  store.commit('SET_AUTH_ERROR', null)
  
  const { getIsLoggedIn } = store.getters

  const noAuthPages = ['login', 'signup']

  const isAuthRequired = !noAuthPages.includes(to.name)
  
  //console.log(from.name)
  
  //로그인이 되어있는데 로그인이나 회원가입을 할려고한다면
  if (!isAuthRequired && getIsLoggedIn) {
    next({ name: 'home' })
  }
  if (isAuthRequired && !getIsLoggedIn) {
    if(from.name !== 'logout'){
      alert('저희 서비스를 정상적으로 이용하기 위해서는 로그인이 필요합니다.')
    }
    store.commit('SET_RETURN_PAGE_INFO',to.name)
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
