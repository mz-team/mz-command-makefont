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

    var argvPath = process.argv[3],
        projectPath = fis.project.getProjectPath(),
        fontSrc = path.resolve(projectPath, '../../lib/KaiGenGothicCN-Light.ttf'),
        fontSrcArr = [],
        // 文案文件路径，可以是目录，也可以是单个文件
        strTargetPath,
        // 字体文件生成目标路径
        fontDestPath,
        // 文件内容字符串
        strContent;
    fontSrcArr = getFontSrcArr(path.resolve(projectPath, '../../lib'), /\.ttf$/);
    if (argvPath == '-h') {
        var content = [
            '',
            'Usage: mz <command>',
            '',
            'Commands:',
            '',
            '   makefont                    Read the default text resource',
            '   makefont [pathname]         Read the [pathname] text resource',
            ''
        ].join('\n');
        return;
    }
    // 根据是否传递参数来决定生成的字体文件地址
    if (argvPath) {
        strTargetPath = path.join(path.resolve(projectPath, 'test/page'), argvPath + '.php');
        fontDestPath = path.join(path.resolve(projectPath, 'static'), argvPath, 'fonts');
        var strTargetPathStatus = fs.statSync(strTargetPath);
        if (!strTargetPathStatus.isFile() && !strTargetPathStatus.isDirectory()) {
            console.log('自定义路径错误，请检查！！');
            return;
        }
    } else {
        strTargetPath = path.resolve(projectPath, 'test');
        fontDestPath = path.resolve(projectPath, 'static/global/fonts');
    }
    if (!fs.existsSync(fontSrcArr[0])) {
        console.error('字体源文件路径错误，请在项目根目录运行，例如 /source/cn/ ');
        return false;
    }

    strContent = readFileContent(strTargetPath).join('');
    console.log('总共 %d 个原始字体文件,开始压缩中。。。。。。', fontSrcArr.length);
    for (var i = 0; i < fontSrcArr.length; i++) {
        var count = 0;
        var fontmin = new Fontmin()
            .src(fontSrcArr[i])
            .use(Fontmin.glyph({
                text: strContent + '\u000a\u000b\u000c\u000d\u000e\u000f\u0000\u0001'
            }))
            .use(Fontmin.ttf2eot())
            .use(Fontmin.ttf2woff())
            .use(Fontmin.ttf2svg())
            .dest(fontDestPath);
        fontmin.run(function(err, files) {
            if (err) {
                throw err;
            } else {
                console.log('恭喜，%d 个字体文件生成成功！', files.length);
            }
        })
    }
}

/**
 * 批量压缩字体
 * @param  {[type]} fontSrcArr [description]
 * @param  {[type]} strContent [description]
 * @return {[type]}            [description]
 */
// function fontMinify(fontSrcArr, strContent) {
//     var fontminArr = [];

// }

/**
 * 获取指定后缀名字体文件路径数组
 * @param string dir 字体文件目录
 * @param  {[type]} reg [description]
 * @return {[type]}     [description]
 */
function getFontSrcArr(dir, reg) {
    var tmpArr = [];
    travel(dir, function(fileList) {
        tmpArr = fileList.filter(function(elem) {
            return reg.test(elem);
        });
    });
    return tmpArr;
}

/**
 * 读取指定路径下的文件内容
 * @param  {string} dir 目标文件夹
 * @return {Array}      返回内容数组
 */
function readFileContent(dir) {
    var contents = [];
    var stats = fs.statSync(dir);
    if (stats.isDirectory(dir)) {
        travel(dir, function(fileList) {
            fileList.forEach(function(filePath) {
                var data = fs.readFileSync(filePath, 'utf-8');
                contents.push(data);
            });
        });
    } else {
        contents.push(fs.readFileSync(dir, 'utf-8'));
    }

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