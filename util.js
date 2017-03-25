const _ = module.exports

_.getComment = function (str) {
  let pattern = /(\/\*|<!--)\s*<i18n>\s*(\{[\s\S]+\})\s*<i18n>\s*(-->|\*\/)/i
  return str.match(pattern)
}