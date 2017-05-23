import request from 'co-request';
import convert from 'koa-convert';
import crypto from 'crypto';

// 全局const变量
const SIGN_SECRET_HOME = '106a6c241b8797f52e1e77317b96a201' //home's md5

export const http_req = async (ops) => {
  ops = ops || {};
  ops.timeout = ops.timeout || 1000;
  //console.log(ops);
  var res = {};
  try {
    res = await (convert(request))(ops);
  } catch (e) {
    console.error(ops.url, e);
  }
  var data = res.body;
  if (typeof data == 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error(ops.url, e);
    }
  }
  return data;
};

export const get_platform = (agent) => {
  agent = agent || '';
  if (/(iphone)|(ipad)|(ipod)/i.test(agent)) {
    return 'ios';
  }
  if (/android/i.test(agent)) {
    return 'android';
  }
  return 'unknown';
};

export const utk2userid = async (utk) => {
  var data = await http_req({url: 'http://a4.go2yd.com/Website/session/utk-to-userid?utk=' + utk});
  if (data && data.status == 'success' && data.userid) {
    return '' + data.userid;
  }
  return '';
};

export const encode = (username, password) => {
  username = username.toLowerCase();
  let md5 = crypto.createHash("md5");
  md5.update(password)
  password = username + md5.digest("hex");

  for (let i = 0; i < 1000; i++) {
    let sha1 = crypto.createHash("sha1");
    sha1.update(password)
    password = sha1.digest("hex");
  }
  return password;
}

export const captcha_sign = (val, secret) => {
  if ('string' != typeof(val))
    throw new TypeError("Cookie value must be provided as a string.");
  if ('string' != typeof(secret))
    throw new TypeError("Secret string must be provided.");
  let cipher = crypto.createCipher('aes-256-cbc', secret);
  let crypted = cipher.update(val, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}
  

export const captcha_unsign = (val, secret) => {
  if ('string' != typeof(val))
    throw new TypeError("Cookie value must be provided as a string.");
  if ('string' != typeof(secret))
    throw new TypeError("Secret string must be provided.");
  let decipher = crypto.createDecipher('aes-256-cbc', secret);
  let dec = decipher.update(val, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}
  

export const setCookie = (ctx, cookie, httpOnly) => {
  if (!cookie) return
  let kv = cookie.split("=");
  if (kv[0] === 'JSESSIONID') {
    let opts = {
      expires: new Date(Date.now() + 2592000000),
      httpOnly: httpOnly == false ? false : true,
      domain: '.yidianzixun.com'
    };
    // console.log(captcha_sign(kv[1],SIGN_SECRET_HOME));
    ctx.cookies.set(
      kv[0],
      captcha_sign(kv[1], SIGN_SECRET_HOME),
      opts
    );
    console.log(ctx.cookies.get(kv[0]))
  }
}

export const formatDate = (date, fmt = 'yyyy-MM-dd') => {
  date = new Date(date);
  let o = {
      "M+": date.getMonth() + 1, //月份 
      "d+": date.getDate(), //日 
      "h+": date.getHours(), //小时 
      "m+": date.getMinutes(), //分 
      "s+": date.getSeconds(), //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

