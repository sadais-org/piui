# PiUI

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![stars](https://img.shields.io/github/stars/sadais-org/piui?style=flat-square&logo=GitHub)](https://github.com/sadais-org/piui)
[![forks](https://img.shields.io/github/forks/sadais-org/piui?style=flat-square&logo=GitHub)](https://github.com/sadais-org/piui)
[![issues](https://img.shields.io/github/issues/sadais-org/piui?style=flat-square&logo=GitHub)](https://github.com/sadais-org/piui/issues)
[![release](https://img.shields.io/github/v/release/sadais-org/piui?style=flat-square)](https://gitee.com/xuqu/uView/releases)
[![license](https://img.shields.io/github/license/sadais-org/piui?style=flat-square)](https://en.wikipedia.org/wiki/MIT_License)


PiUI是基于uniapp，高质量UI移动组件库，基于 `vue.js` 语法，可编译到不同的平台

* 高效开发
* 灵活扩展，丰富的属性配置
* 提供 50+ 高质量组件，覆盖移动端各类场景
* 高性能
* 完善的文档和示例
* 按需引入
* 支持主题定制

## Website 网站

[官方文档：https://piui.sadais.com/](https://piui.sadais.com/)

[GITHUB仓库：https://github.com/sadais-org/piui](https://github.com/sadais-org/piui)

[GITEE仓库：https://gitee.com/org-sadais/piui](https://gitee.com/org-sadais/piui)

`欢迎大家star和fork，你的支持是我们持续更新的动力！`

`扫码体验[piui]小程序`

![](https://sadais-oss.oss-cn-hangzhou.aliyuncs.com/piui/qrcode.jpeg)

## Background 背景

uniapp提供的vue语法（不完全支持），能比原生的写法（小程序原生语法作为对比）提高30%的效率。

但是仅仅使用uniapp提供的基础组件，是远远支撑不了现代移动端的业务复杂度。

借助`piui`的能力，可以让您基于uniapp，再增加至少50%的效率提升。

## Install 安装

### 使用脚手架【推荐】
基于`vue-cli`脚手架创建，更加通用的`vue`项目配置，接入更加快捷，可以做到零配置直接运行，其中引入了`sadais-core`

#### 步骤1： vue-cli安装（如果安装了可以跳过）
可以使用下列任一命令安装最新的`vue-cli`包：


```bash
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```
安装之后，你就可以在命令行中访问 `vue` 命令。你可以通过简单运行 `vue`，看看是否展示出了一份所有可用命令的帮助信息，来验证它是否安装成功。


你还可以用这个命令来检查其版本是否正确：
```bash
vue --version
```

#### 步骤2：文件生成
项目初始化我们通过vue-cli进行生成，以下项目名我使用my-project做示例，名字可以自定义
```bash
vue create -p sadais-org/uni-preset-vue my-project
```
命令输入后，选择默认模板，回车

#### 步骤3：项目启动
在本地启动服务器来开发你的应用
```bash
cd my-project && npm run dev
```

### 非脚手架项目引入（HbuilderX / Uniapp Vue-Cli工程）

> 已初始化的项目，可以通过以下方式接入piui

`piui` `@sadais/piui-tool` 源码都以[es6](https://es6.ruanyifeng.com/) 语法编写，如果是 `vue-cli` 工程，必须在`vue.config.js`中声明其[显式转译](https://cli.vuejs.org/zh/config/#transpiledependencies)

```js
// vue.config.js
module.exports = {
  transpileDependencies: ['@sadais/piui-tool', 'sadais-piui']
}
```

#### 步骤1：安装piui
安装`piui`，以及`piui工具库`
```bash
yarn add sadais-piui @sadais/piui-tool
```

#### 步骤2：引入piui
```js
import Vue from 'vue';
import piui from "sadais-piui";

// 全局属性配置
const piuiConfig = {}

Vue.use(piui, piuiConfig);
```
#### 步骤3：引入piui样式文件
在App.vue文件中引入
```css
@import 'sadais-piui/scss/index.scss';
```
在uni.css文件中引入
```css
@import 'sadais-piui/scss/variable.scss';
```

#### 步骤4：通过easycom模式全局按需引入
修改uniapp的pages.json文件，增加配置

```json
"easycom": {
  "^pi-(.*)": "sadais-piui/components/pi-$1/index.vue"
}
```

## Usage 使用方法

配置easycom规则后，自动按需引入

## Maintainers 成员

[@zhangzhenfei](https://github.com/zhangzhenfei)

## Contributing 贡献

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Issue 规范
issue 仅用于提交 Bug 或 Feature 相关的内容，其它内容可能会被直接关闭。

在提交 issue 之前，请搜索相关内容是否已被提出。

请说明 PiUI 和 Vue 的版本号，并提供操作系统和浏览器信息。推荐使用  生成在线 demo，这能够更直观地重现问题。

## Pull Request 规范
请先 fork 一份到自己的项目下，不要直接在仓库下建分支。

commit 信息要以[组件名]: 描述信息 的形式填写，例如 [Navbar]: fix xxx bug。

执行 npm run build 后可以正确打包文件。

提交 PR 前请 rebase，确保 commit 记录的整洁。

如果是修复 bug，请在 PR 中给出描述信息。

## License

MIT © 2021 zhangzhenfei

## 微信群

请扫码进群

![](https://m.sadais.com/piui/WechatIMG411.jpeg)
