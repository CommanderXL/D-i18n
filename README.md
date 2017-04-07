## D-i18n

后处理翻译

### DONE

* 抽离全局翻译函数, `Vue`可通过全局的方式去挂载方法, `angular`可通过单独定义一个`service`, `React`?
* Map表维护(考虑到是在使用构建工具)
* 开发体验的提升(编译时开发的时候有实时替代功能，但是在一些没有集成`webpack`或`gulp`等构建工具的情况，如何进行实时的翻译) 
* 样式和图片. 在使用`framework`的情况下(**去了解framework完成数据双向绑定的原理**), 通过添加不同语言的`class`来进行样式或者图片的控制, 

### 技术方案梳理

`webpack`构建工具编译过程中, 抽取`map`表

* 技术栈
  * mvvm框架的使用(可直接利用数据的双向绑定)
    * webpack (i18n-path-loader)处理字符串的内容. 主要是图片和css样式方面的问题
1. 开发运行阶段：在开发环节可使用`webpack`插件:`i18n-path-loader`，在代码未编译的阶段规定好**图片的路径**及**class**。这样避免了在业务代码中去写过多的判断语句，去加载不同语言环境的图片或者样式。这样在预编译阶段即完成了这样的功能, 使原有的业务代码更加清晰

// TODO webpack插件的配置,能识别`i18n-path`这样的`loader`名称

使用:
```javascript
  webpack中配置, 以vue为例:
  module.exports = {
    ...
    loaders: {
      test: 'vue',
      loader: ['vue', 'i18n-path?locale=en']
    }
    ...
  }
  

图片路径:

  模板文件中
  <img src="/static/images/${locale}/loader.png"/>

  编译后 --->>>
  <img src="/static/images/en/loader.png"/>

  css文件中
  .box {
    background: url('/static/images/${locale}/loader.png')
  }

  编译后 --->>>
  .box {
    background: url('/static/images/en/loader.png')
  }

通过i18n-path-loader处理后的

class属性:

  <p class="box ${locale}">

  编译后 --->>>
  <p class="box en">
```

  * 非mvvm框架的使用
    * 使用gulp构建工具(静态文件内容翻译, 动态文件内容翻译)
1. 开发运行阶段，借助`gulp`构建工具，静态内容的翻译及替换工作同上文的`i18n-path-loader`.
    * 没有使用构建工具, 工具内容 (DOM节点的内容替换)
* 运行时和编译时的对比
  * 运行时(运行时工具)
  * 编译时(编译时构建工具)

翻译函数:

提供一个全局的翻译函数`T`.

```javascript
  const $t = new T({
    locale: 'en',    // 语言环境
    messages: {      // 语言映射表
      en: {
        你好: 'Hello, {person}'
      },
      zh: {
        你好: '你好, {person}'
      }
    }
  })
```

使用

```javascript
  // 静态内容翻译
  $t('你好')

  // 带参数的静态内容翻译
  $t('你好', {person: 'xl'})
```

映射表的维护:

映射表还是需要通过单独写入文件进行维护。(刚开始设想使用就近原则，哪里需要翻译，将映射关系写到相对的文件中，最后通过编译工具去完成`map`表的生成及维护工作，但是在实际业务项目当中，这种方式存在一定的缺陷，遂弃之)

```javascript
  --lang
  |--en.json 
  |--zh.json
```

### TODOS
 
* env环境的区别
* 动态翻译函数(通过全局注入一个翻译函数), 静态翻译函数(编译阶段直接进行文案的替换) locale文件必须是文件类型，否则翻译函数无法找到映射表
* 单/复数(pipe符号去识别)
* 样式和图片. 在不使用提供双向数据绑定的`framework`或者构建工具的情况下，则使用构建工具进行文本替换data-locale-class="${locale}" or data-locale="/static/img/${locale}/file.png"
* NPM包
* 弄明白vue框架的编译过程，然后添加动态翻译功能. 翻译函数(全局?), 模板上的静态文案编译的时候即完成翻译
* webpack的编译阶段,以及不同插件的执行时机

### Some Tips

* `live reload`和`hot reload`的区别
