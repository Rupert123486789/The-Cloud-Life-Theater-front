<template>
<div class="center">
      <div class="d-flex justify-content-center fs-1">{{this.followChildInfo}} 목록</div>
      <vs-table>
        <template #thead>
          <vs-tr>
            <vs-th>
              번호
            </vs-th>
            <vs-th>
              아이디
            </vs-th>
            <vs-th>
              선택
            </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr class="review-detail-per-movie"
            :key="i" v-for="(tr, i) in $vs.getPage(followInfo, page, max)" :data="tr">
            <vs-td>
              {{ i + 1 }}
            </vs-td>
            <vs-td class="fs-5">
            {{ tr.username }}
            </vs-td>
            <vs-td>
              <vs-button transparent style="height:20px;" @click="goToProfile(tr.username)">v</vs-button>
          </vs-td>
          </vs-tr>
        </template>
        <template #footer>
          <vs-pagination v-model="page" :length="$vs.getLength(followInfo, max)" />
        </template>
      </vs-table>
    </div>
</template>

<script>
export default {
  name: 'FollowInfoForm',
  data(){
    return {
      max : 10,
      page : 1,
    }
  },
  methods:{
    goToProfile(username){
      this.$store.dispatch('fetchProfile',username)
      this.$emit('selectComplete')
    }
  },
  props : {
    followInfo : Array,
    followChildInfo : String,
  }
}
</script>

<style lang='scss'>

</style>