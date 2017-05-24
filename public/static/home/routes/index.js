import App from '../app.vue';
import Index from '../components/Index';
// import Login from '../pages/login';
// import Signout from '../pages/signout';
// import Blog from '../pages/blog';
// import Content from '../pages/content';
// import About from '../pages/about';
// import Sidebar from '../components/Sidebar';
console.log(App)

export default [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '/',
        name: 'home',
        component: Index
      }
      // {
      //   path: '/login',
      //   component: Login,
      // },
      // {
      //   path: '/signout',
      //   component: Signout,
      // },
      // {
      //   path: '/blog',
      //   name: 'blog',
      //   components: {
      //     sidebar: Sidebar,
      //     content: Blog
      //   },
      // }
    ],
  },
];
