export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 初始值
    value: {
      required: false
    }
  },
  data() {
    return {
      val: this.value
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(value) {
        this.val = value
      }
    }
  }
}
