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

  var config = makefont.init(process.argv);

  if (config.font) {
    // 字体文件默认基于 static 目录之下
    config.target = path.resolve(path.resolve(projectPath, 'static'), config.font);
  } else {
    config.target = path.resolve(projectPath, 'static/global/fonts');
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
    // 默认 *.php 和 *.tpl
    config.source = [path.join(projectPath, '/test'), path.join(projectPath, '/page')];
  }

  console.log('start fontmin...');
  makefont.progress(config, function() {
    console.log('fontmin success!');
  });
}