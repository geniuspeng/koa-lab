<template lang="html">
  <div>
    <!-- <canvas id="c"></canvas> -->
  </div>
</template>

<script lang="babel">

  import '../canvasjs/comets.js';
  export default {
    props: [],
    data () {
      return {
        name: '312ddd'
      };
    },
    mounted () {
      var c = document.querySelector('#c');
      init();
    }
   
  };
</script>

<style lang="stylus">
  span
    background #ff0000
</style>