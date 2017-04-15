import {
  loadScript
} from './loader'
import axios from 'axios'

let loaded = false
export let di18nLoader = {}
export let di18n = null

di18nLoader.initDI18n = function (cb, locale) {
  if (loaded) {
    cb && cb()
  } else {
    Promise.all([loadDI18n(), loadLocaleMessages()])
      .then((args) => {
        const DI18n = args[0]
        const messages = args[1]
        di18n = new DI18n({
          locale: locale,
          isReplace: false,
          messages
        })
      })
  }
}

// 异步加载di18n-translate
function loadDI18n() {
  return new Promise((resolve, reject) => {
    loadScript('http://127.0.0.1:8081/di18n.min.js')
      .then(() => {
        resolve(window.DI18n)
      })
  })
}

// 异步加载语言包
function loadLocaleMessages() {
  return new Promise((resolve, reject) => {
    axios.get('/static/lang.json')
      .then(data => {
        if (data.status === 200) {
          resolve(data.data)
        }
      })
  })
}

export default di18nLoader
