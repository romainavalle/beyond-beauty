<template>
  <div class="__layout">
    <v-mobile v-if="isMobile"/>
    <v-desktop v-if="!isMobile" />
  </div>
</template>
<script>
if(process.browser){
  var sniffer = require('sniffer')
}
import { mapGetters, mapActions } from 'vuex'
  import vDesktop from '~/components/Desktop.vue'
  import vMobile from '~/components/Mobile.vue'
export default {
  data() {
    return {
      isMounted: false
    }
  },
  components: {
    vDesktop, vMobile
  },
  computed: {
    ...mapGetters(['isMobile'])
  },
  methods:{
    ...mapActions(['checkMobile'])
  },
  created() {
  },
  mounted() {
    this.isMounted = true
    this.checkMobile()

    console.log('%cMade with ❤️ 🧡 💛 💚 💙 💜', "font-weight: bold; color: #f7c8ae;");
    console.log('%c🖌 @LouisAnsa', "font-weight: bold; color: #f7b8b0;");
    console.log('%c🖌 @NahelMoussi', "font-weight: bold; color: #f7cfae;");
    console.log('%c⌨️ @RomainAvalle', "font-weight: bold; color: #f5d4a4;");
  }
}
</script>



