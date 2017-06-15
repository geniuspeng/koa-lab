<template lang="html">
  <div>
    <!-- <canvas id="c"></canvas> -->
  </div>
</template>

<script lang="babel">
  import * as Canvas from '../canvasjs';
  console.log(Canvas)
  export default {
    props: [],
    data () {
      return {
        name: '312ddd'
      };
    },
    mounted () {
      var c = document.querySelector('#c');
      Canvas.comets()
    }
   
  };
</script>

<style lang="stylus">
  span
    background #ff0000
</style>