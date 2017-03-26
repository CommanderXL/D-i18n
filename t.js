const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g

function t(options) {
  let locale = options.locale || 'zh'
  let messages = options.messages || {}
  function _t(key, ...args) {
    let str = messages[key]

    if (args.length === 1 && typeof args[0] === 'object') {
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

  return _t
}


module.exports = t