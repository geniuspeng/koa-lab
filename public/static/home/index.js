//首页js
import 'main.styl';
import Search from './components/Search.vue';

$(function(){

  let a = 111;
  console.log(a);
  var vm = new Vue({
    el: '#main',
    template: '<component :is="curView"></component>',
    replace: false,
    data: {
      curView: 'Search'
    },
    components: {
      Search
    }
  });




});