<template>
  <div class="blob">
  </div>
</template>

<script>
import Blob from '~/assets/js/blob/Blob'
import ResizeHelper from '~/assets/js/utils/ResizeHelper'
if (process.browser) {
  var dat = require('dat.gui')
}
export default {
    name: "blob",
    props:['debug'],
    methods:{
    resize(w, h) {
      this.canvas.width = w
      this.canvas.height = h
    }
  },
  mounted() {
    //console.log(window)
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')

    this.blobs = []
    for (let index = 0; index < 8; index++) {
      const blob = new Blob(this.canvas, false)
      this.blobs.push(blob)
    }
    TweenMax.ticker.addEventListener('tick', ()=>{
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.blobs.forEach(element => {
        element.render();
      });
    })

  }
}

</script>

<style>

</style>
