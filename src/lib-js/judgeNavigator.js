/**
 * 判断 浏览器
 * */
(function () {
  if(!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location.href = "html/pcindex.html";
  }
})();