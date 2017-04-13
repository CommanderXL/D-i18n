## DI18n

前端通用国际化解决方案

## 背景

前端技术日新月异，技术栈繁多。以前端框架来说有`React`, `Vue`, `Angular`等等，再配以`webpack`, `gulp`, `Browserify`, `fis`等等构建工具去满足日常的开发工作。同时在日常的工作当中，不同的项目使用的技术栈也会不一样。当需要对部分项目进行国际化改造时，由于技术栈的差异，这时你需要去寻找和当前项目使用的技术栈相匹配的国际化的插件工具。比如:

* `vue` + `vue-i18n`
* `angular` + `angular-translate`
* `react` + `react-intl`
* `jquery` + `jquery.i18n.property`

等等，同时可能有些页面没有使用框架，或者完全是没有进行工程化的静态前端页面。

为了减少由于不同技术栈所带来的学习相关国际化插件的成本及开发过程中可能遇到的国际化坑，在尝试着分析前端国际化所面临的主要问题及相关的解决方案后，我觉得是可以使用更加通用的技术方案去完成国际化的工作。

## 国际化所面临的问题

1.语言翻译
  * 静态文案翻译(前端静态模板文案)
  * 动态文案翻译(`server`端下发的动态数据)

2.样式
  * 不同语言文案长度不一样造成的样式错乱
  * 图片的替换

3.map表维护

4.第三方服务
  * SDK

5.本地化
  * 货币单位
  * 货币汇率
  * 时间格式

6.打包方案
  * 运行时
  * 编译后

## 解决方案

在日常的开发过程当中，遇到的最多的需要国际化的场景是：`语言翻译`,`样式`,`map表维护`及`打包方案`。接下来针对这几块内容并结合日常的开发流程说明国际化的通用解决方案。

首先来看下当前开发环境可能用的技术栈：

1. 使用了构建工具
  * `webpack`
  * `gulp`
  * `fis`
  * `browserify`
  * ...

基于这些构建工具，使用:
  * `Vue`
  * `Angular`
  * `React`
  * `Backbone`
  * ...
  * 未使用任何`framework`

2. 未使用构建工具
  * 使用了`jquery`或`zepto`等类库
  * 原生`js`


其中在第一种开发流程当中，可用的国际化的工具可选方案较多:

从框架层面来看，各大框架都会有相对应的国际化插件，例如：`vue-i18n`, `angular-translate`, `react-intl`等，这些插件可以无缝接入当前的开发环节当中。优点是这些框架层面的国际化插件使用灵活，可以进行静态文案的翻译，动态文案的翻译。缺点就是开发过程中使用不同的框架还需要去学习相对应的插件，存在一定的学习成本，同时在业务代码中可能存在不同语言包判断逻辑。

从构建工具层面来看, `webpack`有相对应的`i18n-webpack-plugin`, `gulp`有`gulp-static-i18n`等相应的插件。这些插件的套路一般都是在你自定义`map`语言映射表，同时根据插件定义好的需要被编译的代码格式，然后在代码的编译阶段，通过字符串匹配的形式去完成静态文案的替换工作。这些插件仅仅解决了静态文案的问题，比如一些`样式`,`图片替换`,`class`属性,以及`动态文案的翻译`等工作并没有做。
事实上，这些插件在编译过程中对于`样式`，`图片替换`, `class属性`等替换工作是非常容易完成的，而`动态文案的翻译`因为缺少`context`，所以不会选择使用这些编译插件去完成动态文案的翻译工作。相反，将`动态文案的翻译`放到运行时去完成应该是更加靠谱的。

但是换个角度，抛开基于这些构建工具进行开发的框架来说，构建工具层面的国际化插件可以很好的抹平使用不同框架的差异，通过将**国际化的过程从运行时转到编译时，在编译的过程中就完成大部分的国际化任务**，降低学习相对应国际化插件的成本,同时在构建打包环节可实现定制化。不过也存在一定的缺点，就是这些构建工具层面的国际化插件只能完成一些基本的静态文案的翻译，因为缺少`context`，并不能很好的去完成动态文案的翻译工作，它比较适用于一些纯静态，偏展示性的网页。

在第二种开发流程当中，可使用的国际化工具较少，大多都会搭配`jquery`这些类库及相对应的`jquery.i18n`或`i18next`等插件去完成国际化。

综合不同的构建工具，开发框架及类库，针对不同的开发环境似乎是可以找到一个比较通用的国际化的方案的。

这个方案的大致思路就是:通过构建工具去完成`样式`, `图片替换`, `class属性`等的替换工作，在业务代码中不会出现过多的因国际化而多出的变量名，同时使用一个通用的翻译函数去完成`静态文案`及`动态文案`的翻译工作，而不用使用不同框架提供的相应的国际化插件。简单点来说就是:

- 依据你使用的`构建工具` + 一个通用的`翻译函数`去完成前端国际化

首先，这个通用的**语言翻译函数**: [di18n-translate](https://www.npmjs.com/package/di18n-translate)。它所提供的功能就是静态和动态文案的翻译, 不依赖开发框架及构建工具。可见[demo](...)

```javascript
  npm install di18n-translate
```

```javascript
// 模块化写法
  const LOCALE = 'en'
  const DI18n = require('di18n-translate')
  const di18n = new DI18n({
    locale: LOCALE,     // 语言环境 
    isReplace: false,   // 是否进行替换(适用于没有使用任何构建工具开发流程) 
    messages: {         // 语言映射表 
      en: {
        你好: 'Hello, {person}'
      },
      zh: {
        你好: '你好, {person}'
      }
    }
  })
 
  di18n.$t('你好', {person: 'xl'})   // 输出: Hello, xl

// 外链形式
  <script src="./lib/di18n-translate/index.js"></script>
  <script>
    const LOCALE = 'en'
    const di18n = new DI18n({
      locale: LOCALE,
      isReplace: false,
      messages: {
        // 语言包
      }
    })
  </script>
```
这个时候你只需要将这个通用的翻译函数以适当的方式集成到你的开发框架当中去。

`静态/动态文案翻译`的问题解决了，国际化还有一个比较重要的地方就是**样式问题**，比如中文转英文后肯定会遇到文案过长的情况。那么可能需要精简翻译，使文案保持在一定的可接受的长度范围内。但是大部分的情况都是文案在保持原意的情况下无法再进行精简。这时必须要前端来进行样式上的调整，那么可能还需要设计的同学参与进来，对一些文案过多出现折行的情况再单独做样式的定义。在细调样式这块，主要还是通过不同的语言标识去控制不同标签的`class`，来单独定义样式。

```javascript
  // 中文环境
  <p class="desc"></p>

  // 英文环境下
  <p class="desc en"></p>

  // 日文环境下
  <p class="desc jp"></p>
```

在使用`framework`的情况下，`framework`一般都帮你做好了`view`层的渲染工作，那么你可以在代码当中轻松的通过代码去控制`class`的内容, 以及不同语言环境下的图片替换工作。

例如`vue`:
```javascript
  <template>
    <p class="desc"
      :class="locale"   // locale这个变量去控制class的内容
      :style="{backgroundImage: 'url(' + bgImg + ')'}" 
    ></p>
    <img :src="imgSrc"> // imgSrc去控制图片路径
  </template>

  <script>
    export default {
      name: 'page',
      data () {
        return {
          locale: 'en',
          imgSrc: require('./img/demo.png'),
          bgImg: './img/demo.png'
        }
      }
    }
  </script>
```

这个时候，你的业务代码中会多出很多这些关于语言环境的变量。

针对这个问题，我希望是在构建工作中去完成语言环境的配置，而不是将这个配置放到业务代码当中。

所以如果你是使用`webpack`进行构建的，那么可以使用[locale-path-loader](https://www.npmjs.com/package/locale-path-loader)这个`preloader`

它所做的**工作之一**是在文件编译阶段，就完成语言环境的配置工作，在你的业务代码中不会出现过多的关于语言环境变量以及很好的解决了运行时作为`css`的`background`的图片替换工作


```javascript
图片路径替换
  源文件
  <img src="/static/images/${locale}/loader.png"/>

  编译后
  <img src="/static/images/en/loader.png"/>

css文件中图片路径替换
  源文件
  .box {
    background: url('/static/images/${locale}/loader.png')
  }

  编译后
  .box {
    background: url('/static/images/en/loader.png')
  }

class属性:
  源文件
  <p class="box ${locale}">

  编译后
  <p class="box en">
```

这个`loader`还提供了另外的一个功能，提供了一种维护`map`的方式，当前大多数`map`表的维护工作是单独新建不同语言环境的文件夹:

```javascript
  |--lang
  |   |
  |   |--en.json
  |   |--zh.json
  |   |--jp.json
```

开发环节中，你需要在不同的`json`文件中去切换,完成`map`表的维护。
这个`loader`还提供了**另外一个功能**.就是在你开发目录中任意位置去写语言的映射表，而通过这个`preloader`去将散落在不同文件的语言映射表遍历出来，并生成一个总的语言表:

```javascript
  在模板文件中:
  <!--<i18n>
      {
        "我爱你": {
          "en": "I love you",
          "zh": "我爱你"
        }
      }
  <i18n>-->

  在js文件中:
  /*<i18n>
    {
      "你好": {
        "en": "Hello",
        "zh": "你好"
      }
    }
  <i18n>*/
```

最后通过这个`preloader`去遍历文件并根据配置路径生成最终的语言包`lang.json`:

```javascript
{
  "en": {
    "我爱你": "I love you",
    "你好": "Hello"
  },
  "zh": {
    "我爱你": "我爱你",
    "你好": "你好"
  }
}
```

`loader`使用方法:

```javascript
  npm install locale-path-loader
```

参数说明:

* `locale: String` 当前开发环境中语言包配置, 默认为`zh`, 完成`图片`,`css`,`class属性`的替换工作
* `inline: Boolean`  是否启用内联模式，即使用就近原则，`map`表分散在各文件中，由`loader`去遍历生成最终的`map`表
* `outputDir: String` 最终`lang.json`语言映射表生成的路径配置(如果开启了`inline`模式需要对此参数进行配置)

以`vue`为例:

webpack 1.x 配置:

```javascript
  module.exports = {
    ....
    preLoaders: [
      {
        test: /\.*$/,
        exclude: /node_modules/,
        loaders: [
          'eslint',
          'locale-path?outputDir=./src/common&locale=en&inline=true'
        ]
      } 
    ]
    ....
  }
```

webpack 2 配置:

```javascript
  module.exports = {
    ....
    module: {
      rules: [{
        test: /\.*$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [{
          loader: 'locale-path-loader',
          options: {
            locale: 'en',
            outputDir: './src/common',
            inline: true
          }
        }]
      }]
    }
    ....
  }
```

如果使用`gulp`作为构建工具，可以使用`gulp-locale-path`(还没写- -)这个插件去完成同样的功能.

到这里先简单总结下，**在使用构建工具并搭配`framework`进行开发时，通过构建工具完成`图片`,`css`,及`class属性`的路径替换工作，同时使用上文提供翻译函数基本上可以满足那些基于构建工具，但是不管是否使用`framework`的前端国际化的工作了**

接下来说说没有使用构建工具，偏静态展示性网页的国际化。

这个时候你可能没用`hot reload`或者`live reload`,也没有构建工具帮你完成变量的替换工作。那么在开发环境中如何同时进行不同语言环境的开发工作呢？

在上文提到的`di18n-translate`包中，除了提供了翻译函数外:

```javascript
  const DI18n = require('di18n-translate')
  const di18n = new DI18n({
    locale: 'en',       // 语言环境
    isReplace: false,   // 是否进行替换(适用于没有使用任何构建工具开发流程)
    messages: {         // 语言映射表
      en: {
        你好: 'Hello, {person}'
      },
      zh: {
        你好: '你好, {person}'
      }
    }
  })

  // 有参数
  di18n.$t('你好', {person: 'xl'})
```

其中当`isReplace`字段设为`true`时会开启`dom替换模式`,代码中插入的这一段`js`,用以替换`class`, `img`, `静态文案`等内容, 如下:

```javascript
通过属性配置:
  <p i18n-class="i18n">i18n-Class</p>

  <img src="" i18n-img="./imgs/${locale}/header-img.png" width="50" height="50">

  <div i18n-content="你好"></div>

  <input type="text" i18n-placeholder="你好">
```

`di18n`函数会通过属性选择器，将相对应的`dom`元素中需要做国际化的内容进行替换,
最后得到的结果是

```javascript
  <p class="i18n">i18n-Class</p>

  <img src="./imgs/en/header-img.png" width="50" height="50">

  <div>你好</div>

  <input type="text" placeholder="你好">

  需要动态翻译的内容就借助实例化的di18n.$t进行处理

  di18n.$t('你好', {person: 'xl'})   //输入: 你好, xl
```

以上就是在开发环节，使用不同技术栈的情况下一种更加通用的前端国际化方案。

最后说下打包环节的处理：

最终打包有2种方案:

* 不分语言环境最后打包到一个包中，翻译功能，图片替换, css路径，class属性等通过运行时进行处理, 后端只需要下发语言标识字段，前端通过语言标识字段去完成不同语言环境下的页面渲染工作
* 分语言环境将源文件最终编译到不同语言环境下，不同语言环境对应于不同的最后的包,虽然最终有不同语言版本的包，但是只需要维护同一份代码, 最后可能打包出来的目录结构是:

```javascript
  |--deploy
  |   |
  |   |---en
  |   |    |--app.js
  |   |    |--vendor.js
  |   |    |--index.html
  |   |---zh
  |   |    |--app.js
  |   |    |--vendor.js
  |   |    |--index.html
  |   |---jp
  |   |    |--app.js
  |   |    |--vendor.js
  |   |    |--index.html
  |   |----lang.json
```

不过这个方案需要服务端做一定的支持，根据不同语言环境请求，返回相对应的入口文件.这种分包打包方案的`demo`可以参见`/vue-demo`文件

DEMOS:

 * 基于`webpack`使用`vue`进行开发的`demo`，请参见`/vue-demo`文件夹

 * 不使用构建工具，偏纯静态页面展示的`demo`，请参见`/html-demo`文件夹

---
TODOS:
* `gulp-demo`
