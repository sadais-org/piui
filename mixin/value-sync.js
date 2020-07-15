/**
 * 提供v-model双向绑定
 * 提供传入value属性，将同步到val中
 */
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
      // 同步value到val
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
