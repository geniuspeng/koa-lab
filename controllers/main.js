import { getUsers } from '../service/user';
import Aip from '../baidu-ai';
import fs from 'fs';
import { http_req } from './util';

export const index = async (ctx, next) => {
  let data  = {
    users:getUsers()
  };
  console.log(data);
  await ctx.render('index.jade', data);
};

export const test = async (ctx, next) => {
  let AipSpeech = Aip.speech;
  // 设置APPID/AK/SK
//   let APP_ID = "9890357";
//   let API_KEY = "0wGEfNfnZjX1VOZYP6ejXfyx";
//   let SECRET_KEY = "21441055c420648180098b2eba5ea58c";
//   let client = new AipSpeech(APP_ID, API_KEY, SECRET_KEY);
//   let text = '虽然今天事情很多，很忙，可你常常还是会回忆从前，好的不好的对你来说都是异样的滋味。可工作归工作，还是要把正事先做好，要不然还是会出现许多麻烦呢！晚上的时候可以出去逛逛，舒缓一下心情。';
// // 语音合成
//   let result = await client.text2audio(text);
//   ctx.set('Content-Type', 'audio/mp3');
//   ctx.body = result.data;
  await ctx.render('test.html');
};

export const pwa = async (ctx, next) => {
  await ctx.render('pwa/index.html');
};

export const almanac = async (ctx, next) => {
  let now = new Date();
  let title = now.getFullYear() + '年' + (((now.getMonth() + 1) < 10 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1)))+ '月' + (now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate()) + '日';
  await ctx.render('pwa/almanac.jade', {
    is_dev: process.env.NODE_ENV === 'development',
    title: title
  });
}
