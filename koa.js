import Koa from 'koa';
import convert from 'koa-convert';
import Router from 'koa-router';
import views from 'koa-views';
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import serve from "koa-static";
import compress from "koa-compress";
import json from 'koa-json';
import routes from './routes';
import send from './middleware/send';

//引用配置和api
import config from './config'

const app = new Koa();

//模板引擎中间件
app.use(views(`${__dirname}/views`, {
  extension: 'jade'
}));

app.use(bodyParser());
app.use(send());
// app.use(json());

//设置gzip
app.use(compress({
  threshold: 2048,
  flush: require("zlib").Z_SYNC_FLUSH
}));

//静态资源路径
app.use(convert(serve(__dirname + "/public/")));

//记录所用方式与时间
app.use(logger());

//错误处理
app.on('error', async (err, ctx) => {
  console.error('server error', err, ctx);
  ctx.status = 404;
  await ctx.render('404.html');
});

//路由注册中间件
app.use(routes());

//启动服务
app.listen(config.get('port'), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Koa2 server listening on port ` + config.get('port'));
  }
});
