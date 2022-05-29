<template>
  <div class="center">
    <div class="d-flex justify-content-center fs-1">팔로잉 관리</div>
      <vs-table v-model="selected">
        <template #thead>
          <vs-tr>
            <vs-th style="max-width:50px;">
              <vs-checkbox
                :indeterminate="selected.length == followInfo.length" v-model="allCheck"
                @change="selected = $vs.checkAll(selected, followInfo)" />
            </vs-th>
            <vs-th>
              번호
            </vs-th>
            <vs-th>
              아이디
            </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr
            :key="i" v-for="(tr, i) in followInfo" :data="tr"
            :is-selected="!!selected.includes(tr)">
            <vs-td checkbox>
              <vs-checkbox :val="tr" v-model="selected" />
            </vs-td>
            <vs-td>
              {{ i + 1 }}
            </vs-td>
            <vs-td class="fs-5">
            {{ tr.username }}
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <div class="d-flex flex-wrap justify-content-end" >
        <vs-button trasparent danger style="height:40px;" @click="deleteClick">삭제</vs-button> 
        <vs-button trasparent style="height:40px;" @click="completeClick">완료</vs-button>
      
      </div>
    </div>
</template>

<script>
import drf from '@/api/drf';
import { mapGetters } from "vuex";
import axios from 'axios';
export default {
  name : 'FollowMyForm',
  data(){
    return {
      allCheck: false,
      selected: [],
      max : 10,
      page : 1,
      
    }
  },
  computed : {
    ...mapGetters(['getFollowings_info'])
  },
  methods : {
    deleteClick(){
      //console.log('실행됨')
      for(let i = 0 ; i < this.selected.length ; i++ ){
        axios({
        url:drf.accounts.follow(this.selected[i].username),
        headers : this.$store.getters.getAuthHeader,
        method : 'POST'
      })
      .then(() => {
        this.$store.dispatch('fetchFollowingsInfo',this.$store.getters.getCurrentUser.username)
        if(i == this.selected.length - 1){
          this.selected = []
        }
      })
      .catch(err => console.log(err))
      }
    },
    completeClick(){
      this.$emit('complete-click')
    }
  },
  props : {
    followInfo : Array,
  }
}
</script>

<style>

</style>