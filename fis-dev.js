const ignorePaths = require('./config/ignorePaths');
const noReleasePaths = require('./config/noReleasePaths');
const commonJsConfig = require('./config/commonJsConfig');
const packagerIgnore = require('./config/packagerIgnore');

/**
 * 开发环境
 * */
/*  转相对路径  */
fis.hook('relative');
fis.match('**', { relative: true });
/*  mod.js Common.js 模块化  */
fis.hook('commonjs', commonJsConfig);
/*  不产出文件  */
noReleasePaths.forEach(path => fis.match(path, { release: false }));
/*  忽略编译(只编译src文件)  */
fis.set('project.ignore', ignorePaths);
/*  打包配置 (只进行引用)  */
fis.match('::packager', {
  postpackager: fis.plugin('loader', {
    resourceType: 'mod',
  }),
});
/*  less 文件编译  */
fis.match('src/(**).less', {
  release: '/static/$1',
  preprocessor : fis.plugin("autoprefixer",{
    "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"]
  }),
  parser: fis.plugin('less'),
  rExt: '.css'
});
/*  html 文件编译  */
fis.match('src/html/(**.html)', {
  release: '$1'
});
/*  lib-js(非Common标准)编译  */
fis.match('src/(lib-js/**.js)', {
  release: '/static/$1'
});
/*  modules 中 js文件声明为 mod 加载  */
fis.match('src/(modules/**.js)', {
  isMod: true,
  release: '/static/$1'
});
/*  source -> * 文件  */
fis.match('src/(source/**.*)', {
  release: '/static/$1'
});

