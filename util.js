const _ = module.exports
const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g

// 抽取定义的字段映射
_.getComment = function (str = '') {
  let pattern = /(?:\/\*|<!--)\s*<i18n>\s*(\{[\s\S]+?\})\s*<i18n>\s*(?:-->|\*\/)/ig
  let arr = []
  str.replace(pattern, (match, ...args) => {
    try {
      arr.push(JSON.parse(args[0]))
    } catch (e) {
      throw new Error('args[0] is not a string json')
    }
  })
  return arr
}

// 将抽取的字段映射转化为按语言分类的字段
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