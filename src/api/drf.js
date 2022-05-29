//const HOST = 'http://localhost:8000/api/v1/'
const HOST = 'https://thecloudlifetheater.herokuapp.com/api/v1/'

const ACCOUNTS = 'accounts/'
const MOVIES = 'movies/'
const REVIEWS = 'community/'
export default {
  accounts : {
    login: () => HOST + ACCOUNTS + 'login/',
    logout : () => HOST + ACCOUNTS + 'logout/',
    signup : () => HOST + ACCOUNTS + 'signup/',
    currentUserinfo : () => HOST + ACCOUNTS + 'user/',
    updateUsername : (username) => HOST + ACCOUNTS + 'update/' + username + '/',
    passwordChange : () => HOST + ACCOUNTS + 'password/change/',
    getUserProfieInfo : (username) => HOST + ACCOUNTS + 'profile/'+ username + '/',
    follow : (username) => HOST + ACCOUNTS + username + '/follow/',
    followInfo : (username) => HOST + ACCOUNTS + username + '/follow_info/'
  },

  movies : {
    allMovies: () => HOST +  MOVIES + 'all_movies/all/',
    selectedMovie : (movie_id) => HOST + MOVIES + movie_id + '/',
    getMovieAllComments : (movie_id) => HOST + MOVIES + movie_id + '/movie_comments/',
    createMovieComment : (movie_id) => HOST + MOVIES + movie_id + '/movie_comments/',
    updateMovieComment : (movie_id,comment_id) => HOST + MOVIES + movie_id + '/movie_comments/'+ comment_id + '/',
    deleteMovieComment : (movie_id,comment_id) => HOST + MOVIES + movie_id + '/movie_comments/'+ comment_id + '/',
    likeMovie : (movie_id) => HOST + MOVIES + movie_id + '/movie_like/',
    likeUsersInfo : (movie_id) => HOST + MOVIES + movie_id + '/like_users/',
    MoviePick : (movie_id) => HOST + MOVIES + movie_id +'/movie_pick/',
    MoviePickUser : (movie_id) => HOST + MOVIES + movie_id +'/pick_users/',
    getGernes : () => HOST + MOVIES + 'genres/',
    setVisitCount : (username) => HOST + MOVIES + 'index/' + username + '/',
    getAllMoviesOfType : (type) => HOST + MOVIES + 'all_movies/' + type + '/',
    getLikedBasedRecommended : (username) => HOST + MOVIES + 'recommend/like/' + username + '/',
    getdisLikedBasedRecommended : (username) => HOST + MOVIES + 'recommend/little_like/' + username + '/',
    getSunRecommended : () => HOST + MOVIES + 'recommend/sun/',
    getRecommendColorTest : (number) => HOST + MOVIES + 'recommend/color_test/' + number + '/',
  },

  review : {
    allReviews: () => HOST + REVIEWS + '',
    reviewCreate : (movie_id) => HOST + REVIEWS + movie_id + '/review_create/',
    reviewGet : (review_id) => HOST + REVIEWS + review_id + '/',
    reviewUpdate : (review_id) => HOST + REVIEWS + review_id + '/',
    reviewDelete : (review_id) => HOST + REVIEWS + review_id + '/',
    allReviewsPerMovie : (movie_id) => HOST + REVIEWS + movie_id + '/review_all/',
    getReviewComment : (review_id) => HOST + REVIEWS + review_id + '/review_comments/',
    CreateReviewComment : (review_id) => HOST + REVIEWS + review_id + '/review_comments/',
    updateReviewComment : (review_id,comment_id) => HOST + REVIEWS + review_id + '/review_comments/' + comment_id + '/',
    deleteReviewComment : (review_id,comment_id) => HOST + REVIEWS + review_id + '/review_comments/' + comment_id + '/',
    likeReview : (review_id) => HOST + REVIEWS + review_id + '/review_like/',
    ReviewLikeInfo : (review_id) => HOST + REVIEWS + review_id + '/like_users/',
  }

}