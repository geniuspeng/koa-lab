import compose from 'koa-compose';
import send from 'koa-send';

const sender = async (ctx, next) => {
  ctx.send = send;
  await next();
};

export default () => compose([
  sender,
]);