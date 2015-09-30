
# mz-command-makefont 基于mz-fis框架的饿字体压缩工具

### 特性

对`mz-fis`项目中的`source/{{语言版本}}`项目下面`test`文件夹下面的文件内容进行字体压缩，从根目录下面`lib`目录下所有的`.ttf`的字体源文件抽取字体，生成到对应{{语言版本的}}`/static/global/fonts/`文件夹中

### Demo

``` bash
$ cd i18n-m/source/cn
$ mz makefont
```

其中`i18n-m/lib`下面存放为压缩的字体源文件

`i18n-m/source/cn/static/global/fonts`下面存放生成压缩过后的字体文件


### 使用字体

``` css
@font-face {
  font-family: 'Source Han Sans';
  src: url('fonts/KaiGenGothicCN-Light.eot');
  src:
    url('fonts/KaiGenGothicCN-Light.eot?#font-spider') format('embedded-opentype'),
    url('fonts/KaiGenGothicCN-Light.woff') format('woff'),
    url('fonts/KaiGenGothicCN-Light.ttf') format('truetype'),
    url('fonts/KaiGenGothicCN-Light.svg') format('svg');
  font-weight: normal;
  font-style: normal;
}
// css reset
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,
fieldset,input,textarea,p,blockquote,th,td {
  margin: 0;
  padding: 0;
  font-family: 'Source Han Sans','Hiragino Sans GB', STXihei, "Microsoft YaHei", SimSun, Heiti, sans-serif;
}
```

## License 

(The MIT License)

Copyright (c) 2015 Heaven &lt;lichenbuliren@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.