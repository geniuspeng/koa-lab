import * as Util from '../controllers/util';
const URI_INSIGHT = "http://10.103.8.246:9002";

export const suggest = async () => {
  let result = await Util.http_req({url:`${URI_INSIGHT}/sug`});
  return result;
}

export const getSearchDetail = async (search) => {
  let url = `${URI_INSIGHT}/search?keyword=[{${encodeURIComponent(search)}}]`;
  let detail = await Util.http_req({url:url, timeout: 10000});
  return detail;
}

export const getUserFigure = async (query) => {
  let params = []
  for (let [key,val] of Object.entries(query)) {
    params.push(`${key}=${val}`)
  }

  let url = `${URI_INSIGHT}/user?${params.join('&')}`;
  let detail = await Util.http_req({url:url, timeout: 5000});
  return detail;
}

export const getInterestFigure = async (query) => {
  let params = []
  for (let [key,val] of Object.entries(query)) {
    params.push(`${key}=${val}`)
  }

  let url = `${URI_INSIGHT}/interest?${params.join('&')}`;
  let detail = await Util.http_req({url:url, timeout: 50000});
  return detail;
}

export const getContentIncl = async (query) => {
  let params = []
  for (let [key,val] of Object.entries(query)) {
    params.push(`${key}=${val}`)
  }

  let url = `${URI_INSIGHT}/content?${params.join('&')}`;
  let detail = await Util.http_req({url:url, timeout: 5000});
  return detail;
}

export const getTopDocs = async (query) => {
  let params = []
  for (let [key,val] of Object.entries(query)) {
    params.push(`${key}=${val}`)
  }

  let url = `${URI_INSIGHT}/topDocs?${params.join('&')}`;
  let detail = await Util.http_req({url:url, timeout: 5000});
  return detail;
}