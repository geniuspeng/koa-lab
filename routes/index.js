import compose from 'koa-compose';

// Import all routes
import home from './main';

export default () => compose([
  home(),
]);