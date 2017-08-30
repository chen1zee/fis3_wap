const $ = require('jquery');
const template = require('template');
const api = require('src/modules/tools/api');
const ENV = require('/src/modules/env');
$(() => {
  const userAgent = window.navigator.userAgent.toLocaleLowerCase();
  const tipWordHeight = 160;
  const wH = window.innerHeight;
  const $appFirstWrap = $('#appFirstWrap');
  const $downloadBtn = $('#downloadBtn');
  const $downloadBtn2 = $('#downloadBtn2');
  const $releaseInfo = $('#releaseInfo');
  const $androidDisabledTip = $('#androidDisabledTip');
  const $widgetLoading = $('#widgetLoading');
  let downloadData = {};
  /*  版本号render  */
  const versionRender = template.compile(`
    <p>版本号：{{version}}</p>
    <p>更新于：{{uploadTime}}</p>
  `);

  function init() {
    $appFirstWrap.css('height', wH);
  }
  /*  判断微信&QQAPP内部打开  */
  function judgeWechatQQOpen() {
    if (userAgent.indexOf('mqqbrowser') > -1 || userAgent.indexOf('micromessenger') > -1) {
      $appFirstWrap.css('marginTop', tipWordHeight);
      $downloadBtn2.hide();
      $appFirstWrap.css('height', wH - tipWordHeight);
      return true;
    }
    return false;
  }
  /*  判断 Android Apple  */
  function judgeAndroidIos() {
    const u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) { //android终端
      $downloadBtn2.hide();
      $androidDisabledTip.show();
    }
  }
  /*  最新版本  */
  function toGetNewVersion() {
    const codeMap = {
      'DEV': 'IOS_ANGELLIFE_KEFU_DEV',
      'TEST': 'IOS_ANGELLIFE_KEFU_TEST',
      'PROD': 'IOS_ANGELLIFE_KEFU'
    };
    $.ajax({
      type: 'get',
      url: api('get_ios_app_version'),
      data: { code: codeMap[ENV] },
      dataType: 'json',
      success(res) {
        $widgetLoading.hide();
        downloadData = res;
        $downloadBtn2.attr('href', res.installUrl);
        renderVersion(res);
      }
    }).error((err) => {
      $widgetLoading.hide();
      console.log(err);
    });
  }
  /*  渲染版本号等  */
  function renderVersion(res) {
    const uploadTime = res.uploadTime.split('+')[0].replace('T', ' ');
    $releaseInfo.html(versionRender({
      version: res.version,
      uploadTime
    }));
  }
  /*  更新下载次数  */
  function updateDownloadCount() {
    $.ajax({
      url: api('update_ios_app_count'),
      type: 'get',
      data: {
        code: downloadData.code,
        version: downloadData.version
      },
      success(res) {}
    }).error((err) => {
      console.log(err);
    });
  }
  /*  main  */
  const main = () => {
    toGetNewVersion();
    init();
    if (!judgeWechatQQOpen()) { // 非微信qq打开
      judgeAndroidIos();
    }
  };
  main();

  /*  绑定事件  */
  $downloadBtn2.on('click', (e) => {
    // console.log($downloadBtn.attr('href'));
    updateDownloadCount(); // 更新下载次数
    $downloadBtn2.hide();
    // if (!downloadData.filePath) return;
    // window.open(downloadData.installUrl);
    $downloadBtn.show();
    $downloadBtn.removeClass('downloaded').addClass('downloading');
    window.setTimeout(() => {
      $downloadBtn.removeClass('downloading').addClass('downloaded');
      $downloadBtn.text('正在安装，请按 Home 键在桌面查看');
    }, 5000);
  });
});
