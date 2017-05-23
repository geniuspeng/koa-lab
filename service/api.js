import * as Util from '../controllers/util';
import mongodb from '../middleware/mongodb';
import config from '../config';

const API_APP = "http://a1.go2yd.com/Website";

export const login = async (ctx, url) => {
  let result = await Util.http_req({url:`${API_APP}/user/login${url}`});
  return result;
}

export const getUserSign = async (utk) => {
  let dbUrl, mongo;
  dbUrl = config.get('mongo').web_event;
  
  try {
    mongo = await mongodb.open(dbUrl);
  } catch (e) {
    return  {
      status: 'failed',
      code: 0,
      reason: 'mongo connect failed'
    };
  }

  try {
    let userinfo = await mongo
      .db('laboratory')
      .collection('user')
      .findOne({utk});

    mongodb.close(mongo);

    return {
      status: 'success',
      data: userinfo
    };
  } catch (e) {
    mongodb.close(mongo);
    return {
      status: 'failed',
      reason: e
    };
  }
}

export const getFateOfToday = async (sign) => {
  let dbUrl, mongo;
  dbUrl = config.get('mongo').web_event;

  let today = Util.formatDate(new Date());

  try {
    mongo = await mongodb.open(dbUrl);
  } catch (e) {
    return  {
      status: 'failed',
      code: 0,
      reason: 'mongo connect failed'
    };
  }

  try {
    let result = await mongo
      .db('laboratory')
      .collection('horoscope')
      .findOne({_id: today});

    mongodb.close(mongo);
    if (result && result.detail) {
      return {
        status: 'success',
        data: result.detail 
      };
    } else {
      return {
        status: 'failed',
        reason: '今日的运势尚未配置'
      }
    }

  } catch (e) {
    mongodb.close(mongo);
    return {
      status: 'failed',
      reason: e
    };
  }
}