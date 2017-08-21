import Router from 'koa-router';
import debug from 'debug';
import config from '../config';
import compose from 'koa-compose';

import * as Main from '../controllers/main';
import * as Api from '../controllers/api';

const router = new Router({});

router.get('/', Main.index);
router.get('/test', Main.test);

//公共API
router.post('/api/login', Api.login);


const routes = router.routes();
const allowedMethods = router.allowedMethods({
  throw: true,
  notImplemented: () => new Errors.notImplemented(),
  methodNotAllowed: () => new Errors.methodNotAllowed(),
});

export default () => compose([
  routes,
  allowedMethods,
]);