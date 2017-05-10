'use strict'

var path = require('path');
var makefont = require('makefont/lib');
var fs = require('fs');

exports.name = 'makefont';
exports.usage = '<command> [options]';
exports.desc = 'makefont';
exports.register = function (commander) {

  var argvPath = process.argv;
  var projectPath = fis.project.getProjectPath();
  var fontSrc = path.resolve(projectPath, '../../lib/KaiGenGothicCN-Light.ttf'); // 默认项目 lib 下的字体文件
  // /products/m3e2/weixin, /products/m3e2/weixin2.tpl =>
  // /page/products/m3e2/weixin.tpl, /page/products/m3e2/weixin2.tpl
  // /test/page/products/m3e2/weixin.php, /test/page/products/m3e2/weixin2.php
  // /static/products/m3e2/weixin/fonts/

  var sourceFiles;
  var staticTarget;
  var config = makefont.init(process.argv);

  if(argvPath.length === 4) {
    // 默认带指定项目参数
    sourceFiles = argvPath.pop().split(',');
    staticTarget = path.resolve(projectPath, 'static', sourceFiles[0], 'fonts/');
  }

  if (sourceFiles) {
    // 取默认第一个页面的静态路径
    config.target = staticTarget;
    config.source = [];
    for (var j = 0; j < sourceFiles.length; j++) {
      var tplPath = path.resolve(projectPath, 'test/page', sourceFiles[j] + '.php');
      var phpPath = path.resolve(projectPath, 'page', sourceFiles[j] + '.tpl');
      var tplExists = fs.existsSync(tplPath);
      var phpExists = fs.existsSync(phpPath);
      if (!tplExists || !phpExists) {
        console.error(sourceFiles[j], '路径错误，请重新输入');
        return;
      }

      config.source.push(tplPath);
      config.source.push(phpPath);
    }
  } else {
    config.target = path.resolve(projectPath, 'static/global/fonts');
    // 默认 *.php 和 *.tpl
    config.source = [path.join(projectPath, '/test'), path.join(projectPath, '/page')];
  }

  config.font = config.font || fontSrc;

  makefont.progress(config, function() {
    console.log('fontmin success!');
  });
}
