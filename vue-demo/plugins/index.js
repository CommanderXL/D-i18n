const F_NARGS = /\$t\([\s\S]+?\)/ig
const t = require('../../t')
const _ = require('../../util')
const langFn = require('../../lang')
const recursiveDir = require('../../recursive-dir')
const ConcatSource = require('webpack/lib/ConcatSource')
const fs = require('fs')

let num = 0

function FileListPlugin(options) {}

FileListPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    const {
      src,
      output,
      env,
      locale
    } = require('../i18n-config')
    let fileList = 'In this build:\n\n'
    // 保存在内存当中的map映射表
    let mapLang = langFn({
      srcDir: src,
      outputDir: output
    })
    // 当前locales文件
    let messages = mapLang[locale]
    // 翻译函数
    let $t = t({
      locale,
      messages
    })

    for (let filename in compilation.assets) {
      let content = compilation.assets[filename].source()
      /*let content = compilation.assets[filename].source()
      let source = content.replace(F_NARGS, (match, $1) => {
        return eval(match)
      })*/

      // app.js里面的文件没有变- - 所以这里不会触发hot-middleware
     /* compilation.assets[filename] = {
        source() {
          return source
        },
        size() {
          return fileList.length
        }
      }*/
    }

    // 内存当中生成lang.json文件
    /*compilation.assets['mapLang.js'] = {
      source: function () {
        return '123'
      },
      size: function () {
        return fileList.length
      }
    }
*/
    callback()
  })

  // 修改chunkhash
  compiler.plugin('compilation', compilation => {
    /*compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
      chunks.forEach(function (chunk) {
        chunk.files.forEach(function (file) {
          compilation.assets[file] = new ConcatSource("\/**Sweet Banner**\/", "\n", compilation.assets[file]);
        });
      });
      callback();
    })*/
    // 重置hash，强制浏览器刷新
    /*compilation.plugin('chunk-hash', (chunk, chunkHash) => {
      chunkHash.digest = () => {
        return `${new Date().valueOf()}`
      }
    })*/

    // loader已经将文件进行了加载,所以这里再去进行图片路径的替换不起作用
    compilation.plugin('build-module', (module) => {
      if (/\/vue-test\/src\//.test(module.resource)) {
        let content = fs.readFileSync(module.resource, 'utf8').toString()
        content.replace(/baohushili/, 'test')
      }
    })
  })
}

module.exports = FileListPlugin
