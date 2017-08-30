# 开发
* 0,全局安装 fis3 cnpm i -g fis3
* 1,终端a：npm run dev
* 2,终端b：npm run server (fis3的常开server 不随fis3 -w 关闭 需 fis3 server stop 关闭)
* 2.33,终端b：npm run serverpath 查看 fis3 server 项目路径
* 2.66,修改 express.js 中 路径为 步骤3 中路径 (只需修改一次，fis3 server 目录不会变)
* 3,终端b：node express.js // 开启跨域服务器 localhost:3000

# 打包 (dist文件夹)
* 0.33, 终端: fis3 release -c (清理开发时的配置缓存)
* 0.66, 终端：fis3 release -u (使用独立缓存)
* 不执行以上操作，，可能导致 config 使用 dev 或 其他配置 非常垃圾
* dev：npm run builddev
* test：npm run buildtest
* prod：npm run buildprod