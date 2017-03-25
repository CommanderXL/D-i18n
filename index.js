require('shelljs/global')
const path = require('path')
const fs = require('fs')
const recursiveDir = require('./recursive-dir')
const _ = require('./util')

let files = recursiveDir('./test')

files.forEach((item, index) => {
  let data = fs.readFileSync(item, 'utf8')
  let res = _.getComment(data)

  res && console.log(JSON.parse(res[2]))
})

rm('-rf', './dist/lang')
mkdir('-p', './dist/lang')
touch('./dist/lang/index.js')