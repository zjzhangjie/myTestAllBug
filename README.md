#### 版本要求：

 - node =>8.0
 - npm >=5.6
 - vue >=2.5
 - webpack >=4.0
#### PreInstall：

> 如果安装了vue-cli,要先卸载,运行代码：npm uninstall vue-cli -g

``` sh
npm install webpack -g
npm install webpack-cli -g
npm install @vue/cli -g
npm install @vue/cli-service -g
npm install @vue/cli-service-global -g
npm install @vue/cli-init -g
```
#### 项目目录说明
```
|--root
|   |--dist  //存放bulid后的文件
|   |--public //相当于静态资源，不通过webpack打包，原来老版本的statics
|   |   |--favicon.ico //项目icon，浏览器标题栏的图标
|   |   |--index.html //项目入口html,打包时，js css 等资源会自动插入到这个文件
|   |--src 源码部分
|   |   |--assets //项目资源，会通过webpack打包压缩
|   |   |--components //组件
|   |   |--config //项目配置文件 eg:api等
|   |   |--routerInfo //模块路由信息，供路由入口调用
|   |   |--storeInfo //vuex 模块状态信息，供状态管理入口调用
|   |   |--style //项目样式文件  eg:common.less
|   |   |--tools //项目工具,用于存放通用工具方法
|   |   |--views //视图，本质上都是*.vue文件，与通用组件区分
|   |   |--App.vue //顶层vue入口
|   |   |--main.js //项目入口，webpack从该文件入手
|   |   |--router.js //路由入口文件
|   |   |--store.js //vuex 入口
|   |--tests 单元测试部分
|   |   |--unit
|   |   |   |--server 后台测试部分，主要测试接口
|   |   |   |--client 前端测试部分，主要测试模块功能、数据交互等
|   |--package.json //项目依赖包管理，babel、postcss 配置也在该文件内
|   |--vue.config.js//项目配置入口，删掉此文件项目也可以运行，@vue/cli-service 有一套默认配置，具体配置方法参考：
https://cli.vuejs.org/config/#vue-config-js
```
# commonfe
需要自己引用项目需要的其他模块，比如mockjs,axios,element-ui，vuetify等等

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```
