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

首先，这个通用的**语言翻译函数**: [di18n-translate](https://www.npmjs.com/package/di18n-translate)。它所提供的功能就是静态和动态文案的翻译, 不依赖开发框架及构建工具。

```javascript
  npm install di18n-translate
```

```javascript
// 模块化写法
  const LOCALE = 'en'
  const DI18n = require('di18n-translate')
  const di18n = new DI18n({
    locale: LOCALE,     // 语言环境 
    isReplace: false,   // 是否开始运行时(适用于没有使用任何构建工具开发流程) 
    messages: {         // 语言映射表 
      en: {
        你好: 'Hello, {person}'
      },
      zh: {
        你好: '你好, {person}'
      }
    }
  })

  di18n继承于一个翻译类，提供了2个方法`$t`, `$html`:
 
  di18n.$t('你好', {person: 'xl'})   // 输出: Hello, xl
  di18n.$html(htmlTemp)   // 传入字符串拼接的dom, 返回匹配后的字符串，具体示例可见下文

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


接下来会结合具体的不同场景去说明下相应的解决方案：

###使用`MVVM`类的`framework`
使用了`MVVM`类的`framework`时，可以借助`framework`帮你完成`view`层的渲染工作, 那么你可以在代码当中轻松的通过代码去控制`class`的内容, 以及不同语言环境下的图片替换工作.

例如`vue`, **示例(1)**:
```javascript

main.js文件:

window.LOCALE = 'en'

```

```javascript

app.vue文件:
  <template>
    <p class="desc"
      :class="locale"   // locale这个变量去控制class的内容
      :style="{backgroundImage: 'url(' + bgImg + ')'}"  // bgImg去控制背景图片的路径
    ></p>
    <img :src="imgSrc"> // imgSrc去控制图片路径
  </template>

  <script>
    export default {
      name: 'page',
      data () {
        return {
          locale: LOCALE,
          imgSrc: require(`./${LOCALE}/img/demo.png`),
          bgImg: require(`./${LOCALE}/img/demo.png`)
        }
      }
    }
  </script>
```

这个时候你再加入翻译函数，就可以满足大部分的国际化的场景了,现在在`main.js`中添加对翻译函数`di18n-translate`的引用:

```javascript
main.js文件:

import Vue from 'vue'

window.LOCALE = 'en'
const DI18n = require('di18n-translate')
const di18n = new DI18n({
    locale: LOCALE,       // 语言环境
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

Vue.prototype.d18n = di18n

```

翻译函数的基本使用, 当然你还可以使用其他的方式集成到你的开发环境当中去: 
```javascript
app.vue文件:
  <template>
    <p class="desc"
      :class="locale"   // locale这个变量去控制class的内容
      :style="{backgroundImage: 'url(' + bgImg + ')'}"  // bgImg去控制背景图片的路径
    ></p>
    <img :src="imgSrc"> // imgSrc去控制图片路径
    <p>{{title}}</p>
  </template>

  <script>
    export default {
      name: 'page',
      data () {
        return {
          locale: LOCALE,
          imgSrc: require(`./${LOCALE}/img/demo.png`),
          bgImg: require(`./${LOCALE}/img/demo.png`),
          title: this.di18n.$t('你好')
        }
      }
    }
  </script>
```

使用`mvvm framework`进行国际化，上述方式应该是较为合适的，主要是借助了`framework`帮你完成`view`层的渲染工作, 然后再引入一个翻译函数去完成一些动态文案的翻译工作

这种国际化的方式算是运行时处理，不管是开发还是最终上线都只需要一份代码。

当然在使用`mvvm framework`的情况下也是可以不借助`framework`帮我们完成的`view`层的这部分的功能，而通过构建工具去完成, 这部分的套路可以参见下午的**示例3**

### 未使用`mvvm`框架，使用了构建工具(如`webpack`/`gulp`/`browserify`/`fis`)

#### 使用了前端模板

国际化的方式和上面说的使用`mvvm`框架的方式一致，因为有模板引擎帮你完成了`view`层的渲染.所以对于`样式`，`图片`，`class属性`的处理可以和上述方式一致, 动态文案的翻译需引入翻译函数。

这种国际化的方式也算是运行时处理，开发和最终上线都只需要一份代码。

#### 没有使用前端模板

因为没用使用前端模板，便少了对于`view`层的处理。这个时候你的`DOM`结构可能是在`html`文件中一开始就定义好的了，也可能是借助于`webpack`这样能允许你使用模块化进行开发，通过`js`动态插入`DOM`的方式。

接下来我们先说说没有借助`webpack`这样允许你进行模块化开发的构建工具，`DOM`结构直接是在`html`文件中写死的项目。这种情况下你失去了对`view`层渲染能力。那么这种情况下有2种方式去处理这种情况。

第一种方式就是可以在你自己的代码中添加`运行时`的代码。大致的思路就是在`DOM`层面添加属性，这些属性及你需要翻译的`map`表所对应的`key`值:

**示例(2)**:

`html`文件:
```javascript
  <div class="wrapper" i18n-class="${locale}">
    <img i18n-img="/images/${locale}/test.png">
    <input i18n-placeholder="你好">
    <p i18n-content="你好"></p>
  </div>
```
运行时:
```javascript
  <script src="[PATH]/di18-translate/index.js"></script>
  <script>
    const LOCALE = 'en'
    const di18n = new DI18n({
      locale: LOCALE,
      isReplace: true,   // 开启运行时
      messages: {
        en: {
          你好: 'Hello'
        },
        zh: {
          你好: '你好'
        }
      }
    })
  </script>
```
最后`html`会转化为:
```javascript
  <div class="wrapper en">
    <img src="/images/en/test.png">
    <input placeholder="Hello">
    <p>Hello</p>
  </div>
```

第二种方式就是借助于构建工具在代码编译的环节就完成国际化的工作,以`webpack`为例:

**示例(3)**:

`html`文件:
```javascript
  <div class="wrapper ${locale}">
    <img src="/images/${locale}/test.png">
    <p>$t('你好')</p>
  </div>
```

这个时候使用了一个`webpack`的`preloader`: [locale-path-loader](https://www.npmjs.com/package/locale-path-loader)，它的作用就是在编译编译前，就通过`webpack`完成语言环境的配置工作，在你的业务代码中不会出现过多的关于语言环境变量以及很好的解决了运行时作为`css`的`background`的图片替换工作, 具体的`locale-path-loader`的[文档请戳我](https://www.npmjs.com/package/locale-path-loader)

使用方法:

```javascript
  npm install locale-path-loader
```

`webpack 1.x` 配置:

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

`webpack 2` 配置:

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

经过`webpack`的`preloader`处理后，被插入到页面中的`DOM`最后成为:

```javascript
  <div class="wrapper en">
    <img src="/images/en/test.png">
    <p>Hello</p>
  </div>
```
但是使用这种方案需要在最后的打包环节做下处理，因为通过`preloader`的处理，页面已经被翻译成相对应的语言版本了，所以需要通过构建工具以及改变`preloader`的参数去输出不同的语言版本文件。当然构建工具不止`webpack`这一种，不过这种方式处理的思路是一致的。
这种方式属于编译时处理，开发时只需要维护一份代码，但是最后输出的时候会输出不同语言包的代码。当然这个方案还需要服务端的支持，根据不同语言环境请求，返回相对应的入口文件。关于这里使用`webpack`搭配`locale-path-loader`进行分包的内容可参见`vue-demo`:

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

接下来继续说下借助构建工具进行模块化开发的项目, 这些项目可能最后页面上的`DOM`都是通过`js`去动态插入到页面当中的。那么，很显然，可以在`DOM`被插入到页面前即可以完成`静态文案翻译`，`样式`, `图片替换`, `class属性`等替换的工作。

**示例(4)**:
`html`文件:
```javascript
  <div class="wrapper ${locale}">
    <img src="/images/${locale}/test.png">
    <p>$t('你好')</p>
  </div>
```

`js`文件:

```javascript
  let tpl = require('html!./index.html')
  let wrapper = document.querySelector('.box-wrapper')
  
  // di18n.$html方法即对你所加载的html字符串进行replace,最后相对应的语言版本
  wrapper.innerHTML = di18n.$html(tpl)
```

最后插入到的页面当中的`DOM`为:

```javascript
  <div class="wrapper en">
    <img src="/images/en/test.png">
    <p>Hello</p>
  </div>
```

这个时候动态翻译再借助引入的`di18n`上的`$t`方法

```javascript
  di18n.$t('你好')
```

这种开发方式也属于运行时处理，开发和上线后只需要维护一份代码。

### 没有使用任何`framework`及`构建工具`的纯静态，偏展示性的网页

这类网页的国际化，可以用上面提到的通过在代码中注入运行时来完成基本的国际化的工作, 具体内容可以参见**示例(2)**。
