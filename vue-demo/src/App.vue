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
    <p class="img-wrapper">
      <img :src="img" width="50" height="50">
    </p>
    <h3 class="title">{{title}}, DI18n</h3>
  </div>
</template>

<script type="text/ecmascript-6">
  const LOCALE = 'en'
  // require(`./images/${LOCALE}/en.png`)
  export default {
    name: 'index-page',
    data () {
      return {
        title: this.di18n.$t('你好'),
        dClass: LOCALE,
        img: require(`./images/${LOCALE}/${LOCALE}.png`)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    width: 100%
    height: 100%
    background: url('./images/${locale}/test.png') no-repeat
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
