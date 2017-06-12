import App from '../app.vue';
import Index from '../components/Index';
import Nest from '../components/Nest';
import Comets from '../components/Comets';
// import Blog from '../pages/blog';
// import Content from '../pages/content';
// import About from '../pages/about';
// import Sidebar from '../components/Sidebar';

export default [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '',
        name: 'home',
        component: Index
      },
      {
        path: 'nest',
        name: 'nest',
        component: Nest
      },
      {
        path: 'comets',
        component: Comets
      }
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
