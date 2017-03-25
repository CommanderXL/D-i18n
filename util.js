const _ = module.exports

_.getComment = function (str = '') {
  let pattern = /(\/\*|<!--)\s*<i18n>\s*(\{[\s\S]+\})\s*<i18n>\s*(-->|\*\/)/i
  return str.match(pattern)
}

_.getLangJSON = function (srcObj = {}, resObj = {}) {
  let keys = Object.keys(srcObj)

  keys.forEach(key => {
    let _keys = Object.keys(srcObj[key])
    _keys.forEach(_key => {
      !resObj[_key] && (resObj[_key] = {})
      !resObj[_key][key] && (resObj[_key][key] = '')
      resObj[_key][key] = srcObj[key][_key]
    })
  })

  return resObj
}