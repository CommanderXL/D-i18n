// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import fastclick from 'fastclick'
import DI18n from 'di18n-translate'

// import 'common/stylus/index.styl'

Vue.prototype.di18n = new DI18n({
  locale: 'en',
  isReplace: false,
  messages: {
    en: {
      你好: 'Hello'
    },
    zh: {
      你好: '你好'
    }
  }
})

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
