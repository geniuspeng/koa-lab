import { getUsers } from '../service/user';
import * as Util from './util';
import * as Api from '../service/api';
import request from 'co-request';
import convert from 'koa-convert';
import { ObjectId } from 'mongodb';
import mongodb from '../middleware/mongodb';

import config from '../config';


const isOnline = process.env.NODE_ENV === 'production';

export const login = async (ctx, next) => {
  let body = ctx.request.body;
  let username = body.username;
  let password = body.password;
  let query = [
    "username=" + username,
    "password=" + Util.encode(username, password),
    "platform=2",
    "version=999999",
    "appid=yidian"
  ];
  let url = '?' + query.join('&');
  let info = await Api.login(ctx,url);
  if(info.status == 'success' && info.cookie) {
    Util.setCookie(ctx, info.cookie);
  }
  ctx.body = info;
};



export const getUserSign = async (ctx, next) => {
  let query = ctx.query;
  let utk = query.utk;
  let res = await Api.getUserSign(utk);
  return ctx.body = res;
};

export const getFateOfToday = async (ctx, next) => { //根据获取今天所有星座的运势
  let key = 'today_horoscope';
  let detail = await memoryCache.wrap(key, () => {
    return Api.getFateOfToday();
  });
  return ctx.body = detail;
  
};

/*根据utk获取运势详情*/
export const getFateByUtk = async (ctx, next) => {
  let query = ctx.query;
  let utk = query.utk;
  let sign;
  let res = await Api.getUserSign(utk);
  let key = 'today_horoscope';
  let detail = await memoryCache.wrap(key, () => {
    return Api.getFateOfToday();
  });
  // let detail = await Api.getFateOfToday();
  if (res && res.status == 'success' && detail && detail.status == 'success'){
    sign = res && res.data && res.data.sign; 
    detail = detail.data;
    let info = detail.find((item, index) => {
      return sign == item.sign;
    }) || {
      ...detail[9],
      sign: '',
      birth: ''
    };

    ctx.body = {
      status: 'success',
      data: info
    }
  } else {
    if (res && res.status == 'failed') {
      ctx.body = res;
    } else if (detail && detail.status == 'failed') {
      ctx.body = detail;
    }  else {
      ctx.body = {
        status: failed,
        reason: '未知'
      }
    }
 
  }
}

