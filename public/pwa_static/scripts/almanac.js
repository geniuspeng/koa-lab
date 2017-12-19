var Util = yidian.util;
// var HUB_URI = 'http://dev.yidianzixun.com:3040';
var HUB_URI = 'https://hub.go2yd.com';

var initialData = {"_id":"2017-09-10","lunar":{"time":"农历二零一七年七月廿一","year":"丁酉年","month":"己酉月","day":"辛丑日"},"good":{"keyword":"真心实意","content":{"top":["开光","祈福","求嗣"],"bottom":["斋醮","修造"]}},"bad":{"keyword":"添丁进口","content":{"top":["作灶","出火","进人口"],"bottom":["开渠","入宅"]}},"famous":{"text":"忠诚可以简练地定义为对不可能的情况的一种不合逻辑的信仰。  ","author":"门肯"},"detail":"定日宜晏饮、协议，忌医疗、诉讼及选将出师。晏饮是为了固定某种关系和达成某种共识，协议则是对双方的约定，故“定”日宜晏饮、协议；医疗、诉讼和出师则需随机应变，墨守定规的做法是注定要以失败而告终的，故“定”日忌医疗、诉讼和出师。","completed":true};

var Common = (function() {
  var ua = navigator.userAgent || '';
  var channels_subScribed = [];
  var is_ios = /iphone|ipad/i.test(ua);
  var is_qq = /QQ/i.test(ua);
  var is_weixin = /MicroMessenger/i.test(ua);
  var isAndroidClient = typeof container == 'object';
  var is_debug = location.search.indexOf('debug=1') > -1;
  var is_client = false;
  var client_share = {
    title: '黄历说，原来今天不适合……',
    img: 'http://si1.go2yd.com/get-image/0CLqWH4NM12',
    desc: '最新最详细宜忌详解，量身定做每日最贴心建议',
    link: location.origin + location.pathname
  };
  var user = {
    utk: '',
    hindex: 0,
    sign: ''
  };
  var entry_time = Date.now();

  var setCookie = function(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "=" + escape(value) + ";path=/;domain=yidianzixun.com;expires=" + exp.toGMTString();
  };

  var getCookie = function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  };

  var nightMode = function(info) {
    //夜间模式
    if (info && info.app_info && info.app_info.is_night || location.search.indexOf('is_night=1') > -1) {
      document.documentElement.classList.add('yidian-night');
    }
  };

  var largeFont = function(info) {
    //大字体
    if ($.os.android && info && info.app_info && info.app_info.font_scale > 1) {
      document.documentElement.classList.add('big-font');
    }
  };

  var _common = {
    is_debug: is_debug,
    user: user,
    is_ios: is_ios,
    is_weixin: is_weixin,
    isAndroidClient: isAndroidClient,
    entry_time: entry_time,
    client_share: client_share,

    setCookie: setCookie,
    getCookie: getCookie,

    sendLog: function(){
      //do nothing
    },


    is_client: function() {
      return is_client;
    },


    getRandomItem: function(arr) {
      if (!arr || !arr.length) return;
      var index = (Math.random() * arr.length) | 0;
      return arr[index];
    },

    //从当前url获取query参数
    getQueryFromUrl: function(name) {
      var reg = new RegExp('[?&]' + name + '=([^&]*)');
      var s = location.search.match(reg);
      return decodeURIComponent(s && s[1] || '');
    },


    //是否达到页面底部
    isAtPageBottom: function() {
      var $win = $(window);
      var $doc = $(document);
      if ($win.scrollTop() + $win.height() >= $doc.height()) {
        return true;
      }
      return false;
    },

    isAtPageTop: function() {
      if ($(window).scrollTop() <= 0) return true;
      return false;
    },

    storeDataToCache: function(key, value) {
      if (localStorage) {
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
      }
    },
    getDataFromCache: function(key) {
      if (localStorage) {
        var data = localStorage.getItem(key);
        try {
          var data = JSON.parse(data);
          return data;
        } catch (e) {
          return null;
        }
      } else {  
        return null;
      }
    },

    fetchData: function(url, query, cb) {
      var url = encodeURI(url + '?' + query);
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            var response = JSON.parse(request.response);
            console.log(response)
            var data = response.data;
            cb && cb(data)
          }
        } else {
          // Return the initial weather forecast since no data is available.
          // cb && cb()
        }
      };
      request.open('GET', url);
      request.send();
    },
    

    //对survey category按中文首字母排序
    reorderSurveysCategory: function(surveys) {
      var self = this;
      if (typeof ''.localeCompare === 'function') {
        self.reorderSurveysCategory = function(data) {
          data.forEach(function(item) {
            if (!item || !$.isArray(item.category)) return;
            item.category.sort(function(a, b) {
              return a.localeCompare(b);
            });
          });
        }
      } else {
        self.reorderSurveysCategory = function() {};
      }
    },
  };
 
  return _common;
})();

var bodyTpl = $('#body-tpl').html();
var canlendarTpl = $('#calendar-tpl').html();
var modalTpl = $('#modal-tpl').html();
var almanacTpl = $('#almanac-tpl').html();
var nodataTpl = $('#nodata-tpl').html();

function bindSaveStayTimeEvent() {
  if (typeof container === 'object') {
    var sended = false;
    window.yidian.saveStayTime = function() {
      if (sended) return;
      sended = true;
      var data = {
        utk: Common.user.utk,
        sign: Common.user.sign,
        stay_time: Date.now() - Common.entry_time,
        close_time: Date.now(),
      };
    };
    container.setWebviewCloseCallback('window.yidian.saveStayTime();');
  }
}

function showFailureIcon(){
  $('body').removeClass('loading').addClass('loading-failed');
  $('.network-err, .error').on('tap', function() {
    window.location.reload(true);
  });
}

function hideLoader() {
  $('body').removeClass('loading');
}

function showLoader() {
  $('body').addClass('loading').removeClass('loading-failed');
}

function hideBackBtn() {
  if (($.os.ios && Common.is_client()) || !Common.is_client()) {
    $('.header .back').hide();
  }
}
function hideShareBtn() {
  if (!Common.is_client()) {
    $('.share').hide();
  }
}
function formatTitleDate(date) {
  date = date && new Date(date);
  var title = date.getFullYear() + '年' + (((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)))+ '月' + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + '日';
  return title;
}

function showScrollDate() {
  $('#calendar_date').mobiscroll().date({
      theme: 'mobiscroll',     // Specify theme like: theme: 'ios' or omit setting to use default 
      mode: 'scroller',       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
      display: 'modal', // Specify display mode like: display: 'bottom' or omit setting to use default 
      lang: 'zh',       // Specify language like: lang: 'pl' or omit setting to use default
      minDate: new Date(2017,6,10),  // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
      maxDate: new Date(2020,11,31),   // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
      stepMinute: 5,  // More info about stepMinute: http://docs.mobiscroll.com/2-14-0/datetime#!opt-stepMinute
      onSelect: function(val) {
        renderCalendar(val);
        reRenderAlmanac(val);
        Common.sendLog({action_method: 'CLICK_WIDGET', action_source: {page: 'PageWapYellowCalendar'}, entity: {action_id: 'DateConfirm'}});
      },
      onCancel: function() {
        Common.sendLog({action_method: 'CLICK_WIDGET', action_source: {page: 'PageWapYellowCalendar'}, entity: {action_id: 'DateCancle'}});
      }
  }).trigger('click'); 
}

// function setMinHeight() {
//   let headerHeight = $('.header').height();
//   console.log(headerHeight)
//   $('#content').height(window.screen.availHeight)
// }

function renderTpl(tpl, data, selector) {
  data = data || {};
  selector = selector || '#content';
  $(selector).html(ejs.render(tpl, data));
}

//重新选择日期时，二次渲染黄历
function reRenderAlmanac(date) {
  Common.fetchData(HUB_URI + '/horoscope/getalmanac', 'date=' + date, function(data) {
    $('.header .name').html(formatTitleDate(date));
    if (data) {
      renderTpl(almanacTpl, data, '.almanac');
    } else {
      // console.log('木有数据')
      renderTpl(nodataTpl);
    }
  });
}

function renderCalendar(date) {
  var param = date? 'date=' + date : null;
  Common.fetchData(HUB_URI + '/laboratory/getoneweek', param, function(data) {
    console.log(data)
    if (data && data.length == 15) {
      renderTpl(canlendarTpl, {
        canlendarList: data
      },'.calendar');
      // console.log($('.calendar-piece').width())
      var scroll = $('.calendar-piece').width() * 4;
      $('.calendar').scrollLeft(scroll);
    }
  });
}

function appendReflow() {
  if (!Common.is_client()) {
    var $reflow = $('<div class="bottom-reflow download-btn">'
      + '<div class="leftSide">'
        + '<div class="img logo"></div>'
        + '<h3 class="title">一点资讯</h3>'
        + '<h4 class="subTitle">为你私人定制的资讯客户端</h4>'
      + '</div>'
      + '<span class="open-btn">立即打开</span>'
      + '</div>'
    );
    $('body').append($reflow).addClass('share-page');
    $('#main').css('padding-bottom', '56px');
    $('body').on('tap', '.download-btn', function(e) {
      console.log('点击立即打开');
      var urlApi = 'http://m.yidianzixun.com';
      var dataApi = 'http://m.yidianzixun.com';
      var deeplink_url = urlApi + '/deeplink/redirect';
      var deeplink_data = {
        'wuid': Common.getCookie('wuid') || '',
        'uid': '',
        'distribution_channel': 'webpages34',
        'deep_message': {
          'action_method': 'OPEN_URL',
          'url': dataApi + '/client/almanac'
        }
      };
      var url = deeplink_url + '?deep_data=' + JSON.stringify(deeplink_data);
      Common.sendLog({
        action_method: 'OPEN_DOWNLOAD_PAGE',
        action_source: {
          card: 'CardWapBottom'
        } 
      });
      window.location.href = url;
    });
  }
}

function init() {
  bindSaveStayTimeEvent();
  appendReflow();
  hideBackBtn();
  addEventHandlers();
  getAlmanac();
  //注册sw
  registSw();
}
init();

function getAlmanac() {
  var url = HUB_URI + '/horoscope/getalmanac';
  // TODO add cache logic here
  if ('caches' in window) {
    caches.match(url).then(function(response) {
      if (response) {
        response.json().then(function updateFromCache(json) {
          var data = json.data;
          // results.created = json.query.created;
          updateAlmanac(data);
        });
      }
    });
  };

  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        var response = JSON.parse(request.response);
        console.log(response)
        var data = response.data;
        updateAlmanac(data);
      }
    } else {
      // Return the initial weather forecast since no data is available.
      updateAlmanac(initialData);
    }
  };
  request.open('GET', url);
  request.send();
}

function updateAlmanac(data) {
  if (data && data.good.content && data.bad.content) { //有数据
    // console.log(JSON.stringify(data))
    $.extend(data, {is_client: Common.is_client()});
    renderTpl(bodyTpl, data);

    setTimeout(function() {
      hideLoader();
      hideShareBtn();
      //获取日历信息
      // renderCalendar();
    }, 30);
  }
}

/*****************注册service worker*****************/
const sendMessageToSW = (msg) => {
  return navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage(msg);
} 
function registSw() {
  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/service-worker.js')
             .then(() => { console.log('Service Worker Registered'); })
             .then(() => sendMessageToSW('hello sw!'));
  }
}

/****************为dom元素绑定事件*********************/
function addEventHandlers() {
  $('#content').on('click', '.select-body .line-item', function(e) {
    e.stopPropagation();
    var isdefault = $('#isdefault').val();
    // console.log(isdefault)
    var i = $(this).data('index');
    var selected = SING_ARR[i];
    if (isdefault == 'true') {
      // var birth = BIRTH_ARR[i];
      $('.modal-wrap').html(ejs.render(modalTpl, {
        selected: selected
      })).show();

      Common.user.utk = yidian.utk;
      Common.user.sign = selected;
      Common.user.hindex = i;
    } else {
      renderTpl(detailTpl, yidian.horoArr[i]);
    }

  });
  $('body').on('click', '.calendar .calendar-piece', function(e) {
    console.log($(e.currentTarget).data('key'))
    var key = $(e.currentTarget).data('key');
    $(e.currentTarget).addClass('highlight').siblings().removeClass('highlight');
    if (key == 'more') {
      Common.sendLog({action_method: 'CLICK_WIDGET', action_source: {page: 'PageWapYellowCalendar'}, entity: {action_id: 'MoreDate'}});
      showScrollDate();
    } else {
      reRenderAlmanac(key);
    }
  });
  //点击分享黄历
  $('body').on('tap', '.share', function(e) {
    Common.sendLog({action_method: 'CLICK_WIDGET', action_source: {page: 'PageWapYellowCalendar'}, entity: {action_id: 'ShareYellowCalendar'}});
    e.stopPropagation();
    var title = Common.client_share.title;
    var img = Common.client_share.img;
    var link = Common.client_share.link;
    var desc = Common.client_share.desc;
    // Util.share(title, desc, link, img);
    // Log.share();
  });
  //点击查看今日运势
  $('body').on('tap', '.goto-yunshi', function(e) {
    // Common.sendLog({action_method: 'CLICK_WIDGET', action_source: {page: 'PageWapYellowCalendar'}, entity: {action_id: 'TodaysFortune'}});
    // var url = location.origin + '/client/horoscope?utk=' + Common.user.utk;
    // window.location.href = url;
    // Util.openUrl(url);
    new Promise(function(resolve, reject) {
      Notification.requestPermission(function(result) {
        if (result !== 'granted') return reject(Error("Denied notification permission"));
        resolve();
      })
    }).then(function() {
      return navigator.serviceWorker.ready;
    }).then(function(reg) {
      return reg.sync.register('syncTest');
    }).then(function() {
      console.log('Sync registered');
    }).catch(function(err) {
      console.log('It broke');
      console.log(err.message);
    });
  });


  $('body').on('tap', '.backto-almanac', function(e) {
    var url = location.origin + '/client/almanac';
    window.location.href = url;
    // Util.openUrl(url);
  });
  $('.header').on('click', '.set-date', function(e) {
    Common.sendLog({action_method: 'CLICK_WIDGET', action_source: {page: 'PageWapYellowCalendar'}, entity: {action_id: 'SetDate'}});
    showScrollDate();
  });
  $('body').on('touchmove', '.calendar', function(e) {
    // console.log('move')
    Common.sendLog({action_method: 'CLICK_WIDGET', action_source: {page: 'PageWapYellowCalendar'}, entity: {action_id: 'SlideDate'}});
  });


  $('.header').on('tap', '.back', function(e) {
    if (Common.isAndroidClient && container.closeWebviewWindow) {
      container.closeWebviewWindow();
    }
  });
  window.addEventListener('offline', function(e) {
    console.log('离线了')
    Notification.requestPermission().then((grant) => {
      if (grant !== 'granted') return;
      const notification = new Notification("网络挂掉了哦~", {
        body: '虽然离线了，但是我还可以访问',
        icon: 'http://si1.go2yd.com/get-image/0Gp8bLbHOkK'
      });

    })
  });
  window.addEventListener('message', function(e) {
    console.log('from sw')
    console.log(e)
  });

}