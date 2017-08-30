/**
 * 根据环境变量 返回对应api
 * */
const ENV = require('../env');
const requestList = {
  'get_notice': '/open/notice/sys/find', // [get] 获取通知
  'get_ios_app_version': '/open/notice/get_ios_app_version', // [get] 获取 APP 最新版本
  'update_ios_app_count': '/open/notice/ios_count', // [get] 更新下载次数
  'get_board_info': '/open/notice/share_board/get_board_info', // [get] 获取牌局信息
  'board_to_apply': '/open/notice/share_board/to_apply' // [post] 牌局分享 点击 报名
};

const head =  ENV === 'TEST' ? '/angeljoy-server-test/api' :
              ENV === 'PROD' ? '/angeljoy-server/api' :
              '/angeljoy-server-dev/api';
module.exports = function api(key) {
  return head + requestList[key];
};
