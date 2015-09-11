'use strict'

/**
 * 字体生成插件
 * 运行在对应版本的项目路径下面
 * @type {[type]}
 */
var fs = require('fs'),
    path = require('path'),
    Fontmin = require('fontmin');

exports.name = 'makefont';
exports.usage = '<command> [options]';
exports.desc = 'makefont';
exports.register = function(commander) {

    var projectPath = fis.project.getProjectPath();
    var targetPath = path.resolve(projectPath, 'test');
    var fontSrc = path.resolve(projectPath, '../../lib/KaiGenGothicCN-Light.ttf');
    if(!fs.existsSync(fontSrc)){
        console.error('字体源文件路径错误，请在项目根目录运行!!');
        return false;
    }
    var destPath = path.resolve(projectPath, 'static/global/fonts');
    var strArr = readFileContent(targetPath).join('');
    // minfy
    var fontmin = new Fontmin()
                    .src(fontSrc)
                    .use(Fontmin.glyph({
                        text: strArr
                    }))
                    .use(Fontmin.ttf2eot())
                    .use(Fontmin.ttf2woff())
                    .use(Fontmin.ttf2svg())
                    .dest(destPath);
    fontmin.run(function(err,files){
        if(err){
            throw err;
        }
    });
}

/**
 * 读取指定路径下的文件内容
 * @param  {string} dir 目标文件夹
 * @return {Array}      返回内容数组
 */
function readFileContent(dir) {
    var contents = [];
    travel(dir, function(fileList) {
        fileList.forEach(function(filePath) {
            var data = fs.readFileSync(filePath, 'utf-8');
            contents.push(data);
        });
    });
    return unique(contents.join('').split(''));
}


/**
 * 遍历文件夹目录
 * @param  {[type]}   dir      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function travel(dir, callback) {
    var fileList = [],
        folderList = [];
    var walk = function(filePath, fileList, folderList) {
        fs.readdirSync(filePath).forEach(function(file) {
            var pathname = path.join(filePath, file);
            var stats = fs.statSync(pathname);
            if (stats.isDirectory()) {
                walk(pathname, fileList, folderList);
                folderList.push(pathname);
            } else {
                fileList.push(pathname);
            }
        });
    }
    walk(dir, fileList, folderList);
    callback && callback(fileList, folderList);
}

/**
 * 数组去重
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function unique(arr) {
    var result = [],
        hash = {};
    for (var i = 0, len = arr.length; i < len; i++) {
        if (!hash[arr[i]]) {
            result.push(arr[i]);
            hash[arr[i]] = true;
        }
    }
    return result;
}