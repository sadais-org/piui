/**
 * ! UNIAPP 组件model不支持自定义prop和event，只支持使用默认的value和input
 * 提供v-model双向绑定
 * 提供传入value属性，将同步到val中
 */
export default {
  model: {
    prop: 'value',
    event: 'input'
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
  },
  methods: {
    handleEmitChange() {
      this.$emit('input', this.val)
      this.$emit('change', this.val)
    }
  }
}
