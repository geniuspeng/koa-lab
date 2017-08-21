import { getUsers } from '../service/user';
import say from 'say';
import Aip from '../baidu-ai';
import fs from 'fs';

export const index = async (ctx, next) => {
  let data  = {
    users:getUsers()
  };
  let text = '虽然今天事情很多，很忙，可你常常还是会回忆从前，好的不好的对你来说都是异样的滋味。可工作归工作，还是要把正事先做好，要不然还是会出现许多麻烦呢！晚上的时候可以出去逛逛，舒缓一下心情。'
  say.speak(text);
  // Fire a callback once the text has completed being spoken
  say.speak('whats up, dog?', 'Good News', 1.0, function(err) {
    if (err) {
      return console.error(err);
    }

    console.log('Text has been spoken.');
  });
  console.log(111)
  console.log(data);
  await ctx.render('index.jade', data);
};

export const test = async (ctx, next) => {
  let AipSpeech = Aip.speech;
  // 设置APPID/AK/SK
  let APP_ID = "9890357";
  let API_KEY = "0wGEfNfnZjX1VOZYP6ejXfyx";
  let SECRET_KEY = "21441055c420648180098b2eba5ea58c";
  let client = new AipSpeech(APP_ID, API_KEY, SECRET_KEY);
  let text = '虽然今天事情很多，很忙，可你常常还是会回忆从前，好的不好的对你来说都是异样的滋味。可工作归工作，还是要把正事先做好，要不然还是会出现许多麻烦呢！晚上的时候可以出去逛逛，舒缓一下心情。';
// 语音合成
  let result = await client.text2audio(text);
  ctx.set('Content-Type', 'audio/mp3');
  ctx.body = result.data;
  // client.text2audio(text).then(function(result) {
  //     // console.log('<text2audio>: ' + JSON.stringify(result));
  //     // // 把data数据写入到文件
  //     // fs.writeFileSync('tts.mpVoice.mp3', result.data);
  //     ctx.body = {
  //       status: 'success'
  //     };
  // },(err) => {
  //   console.log(err);
  //   ctx.body = {
  //     status: 'failed'
  //   }
  // });
  // await ctx.render('test.html');
}
