const fs = require('fs')
const gulp = require('gulp')
const through = require('through2')
const recursiveReaddir = require('./recursive-dir')
const gutil = require('gulp-util')
const LANG = require('./dist/lang/index.json')
const t = require('./t')

const F_NARGS = /\$t\(([\s\S]+)\)/g

const KEYS = Object.keys(LANG)
KEYS.forEach(key => {
  $t = t({
    locale: key,
    messages: LANG[key]
  })
  gulpTask(key, $t)
})

function gulpTask(key, t) {
  let $t = t 
  gulp.src(recursiveReaddir('./test'), {
      base: './test'
    })
    .pipe(through.obj(function (file, enc, cb) {
      if (file.isNull()) {
        this.push(file)
        return cb()
      }
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('Streaming not supported'))
        return cb()
      }
      if (file.isBuffer()) {
        let str = file.contents.toString()
        str = str.replace(F_NARGS, (match) => {
          return eval(match)
        })
        file.contents = new Buffer(str)
        this.push(file)
      }
      cb()
    }))
    .pipe(gulp.dest(`./dist/${key}`))
}