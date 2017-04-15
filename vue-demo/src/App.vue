<template>
  <!--
    <i18n>
      {
        "我爱你": {
          "en": "I love deede {a}, {b}",
          "zh": "我爱你, {a}, {b}"
        }
      }
    <i18n>
  -->
  <div id="app" :class="dClass">
    <p class="img-wrapper" :style="{backgroundImage: 'url(' + bgImg + ')'}">
      <!--<img :src="img" width="50" height="50">-->
    </p>
    <h3 class="title" @click="show">{{title}}, DI18n</h3>
  </div>
</template>

<script type="text/ecmascript-6">
  import { di18nLoader, di18n } from './common/js/i18n'
  const LOCALE = 'en'
  export default {
    name: 'index-page',
    data () {
      return {
        title: '',
        dClass: LOCALE,
        img: require(`./images/${LOCALE}/${LOCALE}.png`),
        bgImg: require(`./images/${LOCALE}/${LOCALE}.png`)  // 如果这里直接写路径的话，并不会被url-loader所处理
      }
    },
    created () {
      // 异步加载js
      // 异步加载json
      di18nLoader.initDI18n(() => {}, 'en')
    },
    methods: {
      show () {
        console.log(di18n.$t('你好'))
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    width: 100%
    height: 100%
    // background: url('./images/${locale}/test.png') no-repeat
  h3
    height 30px
    text-align center
    font-size 20px
    // background: url('./images/${locale}/test.png') no-repeat
  .img-wrapper
    padding-top 30px
    padding-bottom 10px
    text-align center
    img
      width 50px
      height 50px
</style>
