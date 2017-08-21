<template lang="html">
  <div>
    <input type="text" v-model="name">
    <span>{{name}}</span>
    <light-loader></light-loader>
  </div>
</template>

<script lang="babel">
  export default {
    props: [],
    data() {
      return {
        name: '312ddd'
      };
    }
   
  };
</script>

<style lang="stylus">
  span
    background #ff0000
</style>