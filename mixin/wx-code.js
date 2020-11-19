export default {
  // #ifdef MP
  data() {
    return {
      code: '' // 微信login获取的code
    }
  },
  created() {
    this.getWxLoginCode()
  },
  methods: {
    async getWxLoginCode() {
      const [, { code }] = await uni.login({
        provider: 'weixin'
      })
      console.log('获取微信授权code为：', code)
      this.code = code
    },
    async codeRefresh() {
      const session = await uni.checkSession()
      console.log('检查微信session是否过期，结果：', session)
      const [, { errMsg }] = session
      if (errMsg !== 'checkSession:ok') {
        await this.getWxLoginCode()
      }
      return true
    }
  }
  // #endif
}
