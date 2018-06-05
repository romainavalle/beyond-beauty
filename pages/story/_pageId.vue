<template>
  <section class="Story">
    <v-story-top></v-story-top>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import vStoryTop from '~/components/story/StoryTop.vue'
export default {
  data(){
    return {
    }
  },
  components: { vStoryTop },
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
