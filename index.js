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

  // 指定项目下的相对路径 /products/m3e2/weixin, /products/m3e2/weixin2.tpl
  var sourceFiles = argvPath.pop().split(',');
  var staticTarget = path.resolve(projectPath, 'static', sourceFiles[0], 'fonts/');

  var config = makefont.init(process.argv);

  if (config.font) {
    // 字体文件默认基于 static 目录之下
    config.target = path.resolve(path.resolve(projectPath, 'static'), config.font);
  } else {
    if (sourceFiles.length > 0) {
      // 取默认第一个页面的静态路径
      config.target = staticTarget;
    } else {
      config.target = path.resolve(projectPath, 'static/global/fonts');
    }
  }

  config.font = config.font || fontSrc;

  // 根据是否传递参数来决定生成的字体文件地址
  if (config.source) {
    // program.source 返回的是一个数组，这里要重新组装路径
    for (var i = 0; i < config.source.length; i++) {
      config.source[i] = path.join(projectPath, config.source[i]);
      var strTargetPathStatus = fs.statSync(config.source[i]);
      if (!strTargetPathStatus.isFile() && !strTargetPathStatus.isDirectory()) {
        console.log('自定义路径错误，请检查！！');
        return;
      }
    }
  } else {
    if (sourceFiles.length > 0) {
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
      // 默认 *.php 和 *.tpl
      config.source = [path.join(projectPath, '/test'), path.join(projectPath, '/page')];
    }
  }

  makefont.progress(config, function() {
    console.log('fontmin success!');
  });
}
