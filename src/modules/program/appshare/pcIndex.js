const $ = require('jquery');
const template = require('template');
require('/src/modules/jquery.qrcode');
const ENV = require('/src/modules/env');
const api = require('/src/modules/tools/api');
$(() => {
  /*  变量  */
  const $qrCode = $('#qrCode');
  const $qrCell = $('#qrCell');
  const $releaseInfo = $('#releaseInfo');
  let downloadData = {}; // 下载对象
  /*  版本号render  */
  const versionRender = template.compile(`
    <p>版本号：{{version}}</p>
    <p>更新于：{{uploadTime}}</p>
  `);

  function init() {
    /*  初始化跳转二维码  */
    const url = ENV === 'DEV' ?
        'http://dev.version.royalnu.com/share/appshare' :
         window.location.origin + '/share/appshare';
    $qrCode.qrcode({
      render: 'canvas',
      width: 130,
      height: 130,
      text: url
    });
  }
  /*  获取最新的版本  */
  function toGetNewVersion() {
    const codeMap = {
      'DEV': 'IOS_ANGELLIFE_DEV',
      'TEST': 'IOS_ANGELLIFE_TEST',
      'PROD': 'IOS_ANGELLIFE'
    };
    $.ajax({
      type: 'get',
      url: api('get_ios_app_version'),
      data: { code: codeMap[ENV] },
      dataType: 'json',
      success(res) {
        downloadData = res;
        renderVersion(res);
      }
    }).error((err) => {
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
  function updateDownloadCount(cb) {
    $.ajax({
      url: '/angeljoy-server-dev/api/open/notice/ios_count',
      type: 'get',
      data: {
        code: downloadData.code,
        version: downloadData.version
      },
      success(res) {
        console.log('success');
        cb();
      }
    }).error((err) => {
      console.log(err);
    });
  }
  /*  主函数  */
  function main() {
    init();
    toGetNewVersion();
  }
  main();

  /**
   * 事件绑定
   * */
  $qrCell.on('click', () => { // 点击电脑下载
    if (!downloadData.filePath) return;
    window.open(downloadData.filePath);
  });
});
