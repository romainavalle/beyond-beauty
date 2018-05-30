<template>
  <section class="Story">
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';
export default {
  data(){
    return {
    }
  },
  computed:{
    ...mapGetters(['currentPageId'])
  },
  methods:{
    ...mapActions(['setCurrentHomeSlideId'])
  },
  mounted(){
    this.setCurrentHomeSlideId(this.currentPageId)
  }
}

</script>

<style lang="stylus" scoped>
.Story
  height 100%
  overflow hidden
  position relative
  width 100%


</style>
