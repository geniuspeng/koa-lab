<template lang="html">
  <div>
    <canvas id="canvas"></canvas>
    <div class="text">仿知乎动态粒子效果背景</div>
  </div>
</template>

<script lang="babel">
  import { Circle, currentCirle } from '../canvasjs/nest.js';
  export default {
    props: [],
    data() {
      return {
        name: '132'
      };
    },
    mounted() {
      //更新页面用requestAnimationFrame替代setTimeout
      window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

      let canvas = document.querySelector('canvas');
      let ctx = canvas.getContext('2d');
      let w = canvas.width = canvas.offsetWidth;
      let h = canvas.height = canvas.offsetHeight;
      let circles = [];
      let current_circle = new currentCirle(0, 0)

      let draw = function () {
          ctx.clearRect(0, 0, w, h);
          for (let i = 0; i < circles.length; i++) {
              circles[i].move(w, h);
              circles[i].drawCircle(ctx);
              for (let j = i + 1; j < circles.length; j++) {
                  circles[i].drawLine(ctx, circles[j])
              }
          }
          if (current_circle.x) {
              current_circle.drawCircle(ctx);
              for (let  k = 1; k < circles.length; k++) {
                  current_circle.drawLine(ctx, circles[k])
              }
          }
          requestAnimationFrame(draw)
      }

      let init = function (num) {
          for (var i = 0; i < num; i++) {
              circles.push(new Circle(Math.random() * w, Math.random() * h));
          }
          draw();
      }
      window.addEventListener('load', init(60));
      window.onmousemove = function (e) {
          e = e || window.event;
          current_circle.x = e.clientX;
          current_circle.y = e.clientY;
      }
      window.onmouseout = function () {
          current_circle.x = null;
          current_circle.y = null;

      };
    }
   
   };
</script>

<style lang="stylus">

</style>