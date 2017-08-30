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
/*  打包配置  */
fis.match('::packager', {
  postpackager: fis.plugin('loader', {
    resourceType: 'mod',
    allInOne: {
      ignore: packagerIgnore,
    }
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
/*  modules -> js 文件编译  */
fis.match('src/(modules/**.js)', {
  isMod: true,
  parser: fis.plugin('babel-6.x', {
    sourceMaps: true
  }),
  release: '/static/$1',
});
/*  source -> * 文件  */
fis.match('src/(source/**.*)', {
  release: '/static/$1'
});


/**
 * 生产环境打包
 * */
fis.match('src/**.{js,less,png,jpg,jpeg}', {
  useHash: true
});
fis.match('src/**.{css,less}', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});
fis.match('src/{modules,lib-js}/**.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});
fis.match('src/**.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

function replaceEnv(content, ENV) { return content.replace(/exports\s*\=\s*\'[a-zA-Z]*\'/, "exports = '" + ENV + "'"); }
/*  不同环境配置不同环境变量  */
fis.media('dev').match('src/modules/env.js', {
  postprocessor: (content, file, settings) => replaceEnv(content, 'DEV')
});
fis.media('test').match('src/modules/env.js', {
  postprocessor: (content, file, settings) => replaceEnv(content, 'TEST')
});
fis.media('prod').match('src/modules/env.js', {
  postprocessor: (content, file, settings) => replaceEnv(content, 'PROD')
});