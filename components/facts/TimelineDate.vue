<template>
  <li class="TimelineDate">
    <button v-text="fact.year" @click="setCurrentFact(num)"></button>
  </li>
</template>

<script>


import { mapActions } from 'vuex'
export default {
  name: "TimelineDate",
  data(){
    return {
    }
  },
  props: ['fact', 'num'],
  computed:{

  },
  methods:{
    ...mapActions(['setCurrentFact']),
    show(){
    },
    hide(){
    }
  },
  mounted(){
  }
}

</script>

<style lang="stylus" scoped>
.TimelineDate
  position relative
  width 160 * $unitH
  display block
  text-align center
  button
    font-size 20 * $unitH
    font-weight $semi
    color $color-black
    opacity .5
</style>
