const $ = require('jquery');
const template = require('template');
$(() => {
  const data = {
    name: '一个组件',
    addressList: [
      {
        name: '第一个地址',
        belong: '中国'
      },
      {
        name: '第二个地址',
        belong: '美国'
      },
    ]
  };
  const render = template.compile($('#widgetTestComponent').html());
  $('#app').html(render(data));


});