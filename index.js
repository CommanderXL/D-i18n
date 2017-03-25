require('shelljs/global')
const path = require('path')
const fs = require('fs')
const recursiveDir = require('./recursive-dir')
const _ = require('./util')

const LANG_DIR = './dist/lang'
const LANG_FILE = path.join(LANG_DIR, '/index.json')

let files = recursiveDir('./test')

let lang = {}
files.forEach((item, index) => {
  let data = fs.readFileSync(item, 'utf8')
  let res = _.getComment(data)

  if (res) {
    lang = Object.assign(lang, JSON.parse(res[2]))
  }
})

rm('-rf', LANG_DIR)
mkdir('-p', LANG_DIR)
touch(LANG_FILE)

fs.writeFile(LANG_FILE, JSON.stringify(_.getLangJSON(lang, {})), (err, res) => {
  if (err) throw err
  console.log('File has been writed in')
})