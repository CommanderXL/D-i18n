const _ = module.exports
const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g

// 抽取定义的字段映射
_.getComment = function (str = '') {
  let pattern = /(\/\*|<!--)\s*<i18n>\s*(\{[\s\S]+\})\s*<i18n>\s*(-->|\*\/)/i
  return str.match(pattern)
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

_.parse = function () {

}

_.t = function (str, ...args) {
  if (args.length === 1 && args[0] === 'object') {
    args = args[0]
  } else {
    args = {}
  }

  if (!args || !args.hasOwnProperty) {
    args = {}
  }

  return str.replace(RE_NARGS, (match, prefix, i, index) => {
    let result = ''

    if (str[index - 1] === '{' && 
      str[index + match.length] === '}') {
      return i
    } else {
      result = args.hasOwnProperty(i) ? args[i] : match
      if (!result) {
        return ''
      }

      return result
    }
  })
}