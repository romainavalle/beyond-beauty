<template>
  <section class="container">
  </section>
</template>

<script>
import Blob from '~/assets/js/Blob'
if (process.browser) {
  var dat = require('dat.gui')
}
export default {
  methods:{
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    mouseMove(e) {
      let blobPos = this.blob.position;
      let diff = { x: e.clientX - blobPos.x, y: e.clientY - blobPos.y };
      let dist = Math.sqrt((diff.x * diff.x) + (diff.y * diff.y));
      let angle = null;
      if(dist < this.blob.radius && this.hover === false) {
        let vector = { x: e.clientX - blobPos.x, y: e.clientY - blobPos.y };
        angle = Math.atan2(vector.y, vector.x);
        this.hover = true;
      } else if (dist > this.blob.radius && this.hover === true){ 
        let vector = { x: e.clientX - blobPos.x, y: e.clientY - blobPos.y };
        angle = Math.atan2(vector.y, vector.x);
        this.hover = false;
      }
      
      if(typeof angle == 'number') {
        let nearestPoint = null;
        let distanceFromPoint = 10 ;
        this.blob.points.forEach((point)=> {
          point.color = 'red'
          if(Math.abs(angle - point.angle) < distanceFromPoint) {
            nearestPoint = point;
            distanceFromPoint = Math.abs(angle - point.angle);
          } 
        })
        if(nearestPoint) {
          let strengthVec = { x: this.oldMousePoint.x - e.clientX, y: this.oldMousePoint.y - e.clientY };
          let strength = Math.min(Math.sqrt((strengthVec.x * strengthVec.x) + (strengthVec.y * strengthVec.y)) / 20 , 50);
          //
          nearestPoint.color = 'blue'
          nearestPoint.acceleration = (strength * (this.hover ? -1 : 1));
          nearestPoint.render()
        }
      }
      
      this.oldMousePoint.x = e.clientX;
      this.oldMousePoint.y = e.clientY;
    }
  },
  mounted() {
    //console.log(window)
    window.gui = new dat.default.GUI({name: 'Blob'});
    this.canvas = document.createElement('canvas');
    this.$el.appendChild(this.canvas);
    
    this.blob = new Blob(this.canvas)

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    
    this.oldMousePoint = { x: 0, y: 0};
    this.hover = false;
  
    window.addEventListener('mousemove', this.mouseMove.bind(this));
    
    this.blob.canvas = this.canvas;
    this.blob.init();
    this.blob.render();
  }
}

</script>

<style>

</style>
