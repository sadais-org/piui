<template>
  <view class="pi-scroll-container">
    <!-- #ifndef MP -->
    <slot name="title">
      <pi-navbar :show-home="false">{{ title }}</pi-navbar>
    </slot>
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
    <web-view v-if="webviewURL" :progress="true" :src="webviewURL" class="pi-scroll pi-safearea" />
    <!-- #endif -->
  </view>
</template>

<script>
const TAG = 'PiWebview'
export default {
  name: 'PiWebview',
  props: {
    title: {
      type: String
    },
    url: {
      type: String
    }
  },
  data() {
    return {
      webviewURL: ''
    }
  },
  watch: {
    url: {
      deep: true,
      immediate: true,
      handler(value) {
        value && this.init()
      }
    }
  },
  methods: {
    init() {
      // 设置标题
      if (this.title) {
        uni.setNavigationBarTitle({
          title: this.title
        })
      }
      if (!this.url) return
      // H5 url 需要加时间戳，否则会有缓存问题
      this.webviewURL = this.urlAddParam(this.url || '', {
        sadaisTimestamp: new Date().getTime() + '-' + Math.round(Math.random(1) * 10000)
      })
      console.log('webview页面即将打开以下URL:', this.webviewURL)
      // #ifdef APP-PLUS
      const wv = plus.webview.create('', 'custom-webview', {
        'plusrequire': 'none', // 禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
        'uni-app': 'none', // 不加载uni-app渲染层框架，避免样式冲突
        'top': uni.getSystemInfoSync().statusBarHeight + 44 // 放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
      })
      wv.loadURL(this.webviewURL)
      const currentWebview = this.$mp.page.$getAppWebview() // 获取当前页面的webview对象
      currentWebview.append(wv) // 一定要append到当前的页面里,才能跟随当前页面一起做动画，一起关闭
      // #endif
    },
    urlAddParam(url, params) {
      params = this.$pi.navi.objToUrl(params)
      if (url.indexOf('?') !== -1 && params) {
        url = url + params.replace('?', '&')
      } else {
        url = url + params
      }
      return url
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-scroll-container {
  background-color: #ffffff;
}
</style>
