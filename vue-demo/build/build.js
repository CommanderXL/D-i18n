// https://github.com/shelljs/shelljs
require('shelljs/global')
var _ = require('lodash')
var async = require('async')
env.NODE_ENV = 'production'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')
var langArr = ['zh', 'en', 'jp']

// return console.log(webpackConfig.module.preLoaders)

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)

// 静态资源输出路径
function pathHandler(path, lang) {
  let pathArr = path.split('/')
  let filename = pathArr.pop()
  path = pathArr.concat([lang, filename])
  return path.join('/')
}

// preloader处理
function preloaderHandler(lang, loaderObj) {
  function localeReplace (txt) {
    return txt.replace(/locale=\w+/, `locale=${lang}`)
  }
  if (loaderObj.loaders) {
    loaderObj.loaders.forEach(item => {
      item = localeReplace(txt)
    })
  } else {
    loaderObj.loader = localeReplace(loaderObj.loader)
  }
}

// 编译
function webpackCompile(lang, webpackConfig, cb) {
  let config = _.cloneDeep(webpackConfig)
  if (config.module.preLoaders && !config.module.preLoaders.length) {
    config.module.preLoaders.forEach(loader => preloaderHandler(loader))
  }
  config.output.path = pathHandler(config.output.path, lang)
  config.output.publicPath += `${lang}/`
  config.plugins.forEach(plugin => {
    if (Object.keys(plugin)[0] === 'options') {
      plugin.options.filename = pathHandler(plugin.options.filename, lang)
    }
  })

  webpack(config, function (err, stats) {
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
    cb(null, lang)
  })
}

var spinner = ora('building for production...')
spinner.start()

async.each(langArr, (lang, cb) => {
  webpackCompile(lang, webpackConfig, cb)
}, err => {
  spinner.stop()
  err && console.log(err)
})
