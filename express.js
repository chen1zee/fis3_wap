const express = require('express');
const httpProxyMiddleware = require('http-proxy-middleware');
const app = express();

/*  ！！！换成fis3 server   */
app.use(express.static('C:/Users/chen1zee/AppData/Local/.fis3-tmp/www'));
// app.use(express.static('./dist'));
app.use(httpProxyMiddleware('/angeljoy-server', {
  target: 'http://120.77.180.41',
  changeOrigin: true,
  pathRewrite: {
    '^/angeljoy-server': '/angeljoy-server',
  }
}));

console.log(3000);
app.listen(3000);
