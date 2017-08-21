//首页js
import 'main.styl';
import Util from './util.js';
import VueRouter from 'vue-router';
import routes from './routes';
import store from './store';
import canvasTools from '../canvastools';
// import Header from './components/Header'

Vue.use(VueRouter);
Vue.use(canvasTools);

const router = new VueRouter({
  routes,
  // mode: 'history',
});
router.beforeEach((to, from, next) => {
  let path = to.path;
  // let isLogin = Boolean(store.state.user.id) // true用户已登录， false用户未登录
  // console.log(isLogin)
  // if (!isLogin && path !== '/login') {
  //     return next({ path: '/login' })
  // }
  next()
});

let a = 111;
console.log(a);
let vm = new Vue({
  store,
  router,
}).$mount('#main');
