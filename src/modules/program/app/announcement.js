var $ = require('zepto');
const api = require('../../tools/api');
$(document).ready(function() {
  // 获取提交参数
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  }

  // formate time
  function formatTime(date, transform) {
    if( !date ){
      date = new Date();
    } else if( typeof date == 'number' ){
      date = new Date( date );
    } else if( isNaN(Date.parse(date)) ){
      date = new Date( Date.parse(date.replace(/-/g, "/")));
    } else{
      date = new Date( Date.parse(date) );
    }

    transform = transform || 'yyyy-MM-dd HH:mm';

    var mon = date.getMonth() + 1,
        dd = date.getDate(),
        hh = date.getHours(),
        mm = date.getMinutes(),
        ss = date.getSeconds();

    var year = date.getFullYear(),
        month = mon < 10 ? '0' + mon : mon,
        day = dd < 10 ? '0' + dd : dd,
        hour = hh < 10 ? '0' + hh : hh,
        minute = mm < 10 ? '0' + mm : mm,
        second = ss < 10 ? '0' + ss : ss;
        transform = transform.replace('yyyy',year)
        .replace('MM',month).replace('dd',day)
        .replace('HH',hour).replace('mm',minute).replace('ss', second);
        return transform;
  };

  $.ajax({
    type:'GET',
    // 生产环节
    // url: '/angeljoy-server/api/open/notice/sys/find',
    // 开发环节
    url: api('get_notice'),
    // 测试环节
    // url: '/angeljoy-server-test/api/open/notice/sys/find',
    // url: './js/test.json',
    data: { id: getQueryString("id"), type: getQueryString("type") },
    dataType: 'json',
    success: function(data) {
      // success callback
      $(".shadows").addClass("hidden")
      var res = data.date;
      $("#title").html(res.title);
      $("#date").html(formatTime(res.time));
      $("#container").html(res.content);
      $('#usr').html(res.from);
      document.title = res.title;
    },
    error: function(xhr, type) {
      console.log('ajax error');
    }
  });
});
