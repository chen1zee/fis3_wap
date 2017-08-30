const $ = require('jquery');
const template = require('template');
const api = require('/src/modules/tools/api');
const ENV = require('/src/modules/env');
$(() => {
  const $topHeader = $('#topHeader');
  const $boardInfo = $('#boardInfo');
  const $boardBlindPeople = $('#boardBlindPeople');
  const $describePara = $('#describePara');
  const $assign = $('#assign');
  const $sharetimes = $('#sharetimes');
  const $downloadCount = $('#downloadCount');
  const $signButton = $('#signButton');
  const $mask = $('#mask');
  const $closeMask = $('#closeMask');
  const $openSafariTip = $('#openSafariTip');
  const $androidTip = $('#androidTip');
  const searchObj = searchToObj();

  function init() {

  }
  /*  获取地址栏数据  */
  function searchToObj() {
    const search = window.location.search.substring(1);
    const arr = search.split('&');
    const obj = {};
    arr.forEach((item) => {
      const itemArr = item.split('=');
      obj[itemArr[0]] = itemArr[1] || null;
    });
    return obj;
  }
  /*  判断微信&QQAPP内部打开  */
  function judgeWechatQQOpen(yesCb, noCb) {
    const u = navigator.userAgent.toLocaleLowerCase();
    if (u.indexOf('mqqbrowser') > -1 || u.indexOf('micromessenger') > -1) {
      console.log('微信');
      yesCb();
      return true;
    }
    console.log('非微信');
    noCb();
    return false;
  }
  /*  判断 Android Apple  */
  function judgeAndroidIos(andCb, iosCb) {
    const u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) { //android终端
      console.log('android 端');
      andCb();
      return 'android';
    }
    iosCb();
    return 'ios';
  }
  /*  请求牌局信息  */
  function toGetBoardInfo() {
    $.ajax({
      url: api('get_board_info'),
      data: {
        clubId: searchObj.clubId,
        queueId: searchObj.queueId
      },
      dataType: 'json',
      success(res) {
        res.data.blinds = res.data.blinds.replace(/000/g, 'K');
        res.data.ante = res.data.ante.toString().replace(/000/g, 'K');
        renderBoardInfo(res.data);
      }
    }).error((err) => {
      console.log(err);
    });
  }
  /*  渲染牌局信息  */
  function renderBoardInfo(data) {
    let html = template('topHeaderTemplate', {
      clubIcon: data.clubIcon || '../static/source/img/boardshare/head1@3x.png',
      clubName: data.clubName
    });
    $topHeader.html(html);
    html = template('boardInfoTemplate', { ...data });
    $boardInfo.html(html);
    html = template('boardBlindPeopleTemplate', { ...data });
    $boardBlindPeople.html(html);
    $describePara.text(data.content || '无牌局描述');
    html = template('assignTemplate', { ...data });
    $assign.html(html);
    $sharetimes.text(data.sharetimes);
    $downloadCount.text(data.downloadCount);
  }
  /*  ios 点击 报名  */
  function addShareTimes() {
    $.ajax({
      url: api('board_to_apply'),
      type: 'post',
      data: { queueId: searchObj.queueId },
      dataType: 'json',
      success(res) {}
    }).error((err) => {
      console.log(err);
    });
  }
  /*  制造 app 应用跳转url  */
  function makeAppUrl() {
    const hostMap = {
      'DEV': 'boardShareDev', // 开发
      'TEST': 'boardShareTest', // 测试
      'PROD': 'boardShareDefault' // 生产
    };
    return `AngelLife://${hostMap[ENV]}?type=texasQueue&clubId=${searchObj.clubId}&shareQueueId=${searchObj.queueId}`;
  }

  function main() {
    // toGetNewVersion();
    init();
    toGetBoardInfo();
  }
  main();

  /*  点击报名按钮  */
  $signButton.on('click', () => {
    judgeWechatQQOpen(() => { // 是 微信
      $('.cell-content').hide();
      $openSafariTip.show();
      $mask.show();
    }, () => { // 不是微信
      judgeAndroidIos(() => { // android
        $('.cell-content').hide();
        $androidTip.show();
        $mask.show();
      }, () => { // ios
        $signButton.text('等待中...');
        $signButton.attr('disabled', true);
        addShareTimes();
        window.setTimeout(() => {
          $signButton.attr('disabled', false);
          $signButton.text('报 名');
        }, 800);
        window.location.href = makeAppUrl();
      });
    })
  });
  /*  点击关闭蒙层  */
  $closeMask.on('click', () => {
    $mask.hide();
  });
});
