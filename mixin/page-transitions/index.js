import './index.css'

export function create(setting) {
  return {
    // #ifdef H5
    data() {
      return {
        pageBefore: '',
        pageAfterStart: '',
        isPageBack: false
      }
    },
    onLaunch: function() {
      // 监听浏览器返回按钮
      window.addEventListener(
        'popstate',
        e => {
          this.isPageBack = true
        },
        false
      )
      // 如果有页面自定义权重配置
      setting && this.init()
      // 页面默认是隐藏的，一开始先执行一次显示的逻辑
      this.handlePageShow()
      // 页面进入前
      this.$router.beforeEach((toPage, fromPage, next) => {
        let toDepth = toPage.path.split('/').filter(v => !!v).length
        let fromDepth = fromPage.path.split('/').filter(v => !!v).length
        let type = toDepth > fromDepth ? 'forward' : 'back'
        // 如果配置tab的优先级，使用设置判断是前进还是后退
        if (toPage.meta.pageIndex && fromPage.meta.pageIndex) {
          type = toPage.meta.pageIndex >= fromPage.meta.pageIndex ? 'forward' : 'back'
        }
        this.pageBefore = `animation-${type}`
        this.pageAfterStart = `animation-afterstart-${type}`
        setTimeout(this.handlePageHide(next))
      })
      // 页面进入完毕
      this.$router.afterEach(() => {
        // 标记当前页面为返回模式
        this.isPageBack = false
        setTimeout(this.handlePageShow, 50)
      })
    },
    methods: {
      init() {
        this.$router.options.routes.forEach(item => {
          const indexSetting = setting[item.meta.pagePath]
          item.meta.pageIndex = indexSetting
        })
      },
      handlePageHide(callback) {
        setTimeout(() => {
          this.pageBefore = this.isPageBack ? 'animation-back' : this.pageBefore
          this.pageAfterStart = this.isPageBack ? 'animation-afterstart-back' : this.pageAfterStart

          const classList = document.querySelector('uni-page').classList
          classList.add(this.pageBefore, 'animation-leave')
          classList.remove('animation-show')
          setTimeout(() => {
            classList.remove(this.pageBefore, 'animation-leave')
            callback && callback()
          }, 300)
        }, 20)
      },
      handlePageShow() {
        const classList = document.querySelector('uni-page').classList
        classList.add(this.pageAfterStart, 'animation-before')
        setTimeout(() => {
          classList.add('animation-enter', 'animation-after', 'animation-show')
          setTimeout(() => {
            classList.remove(
              'animation-before',
              'animation-after',
              'animation-enter',
              this.pageAfterStart
            )
          }, 300)
        }, 20)
      }
    }
    // #endif
  }
}
