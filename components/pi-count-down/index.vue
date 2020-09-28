<template>
  <view
    class="pi-width-100P"
    :style="[customStyle, { height: `${statusBarHeight}px`, background: background }]"
    :class="[customClass]"
  />
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const { countDwon } = getConfig()

const TAG = 'PiCountDown'

export default {
  name: TAG,
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值，接收一个时间戳
    value: {
      required: false
    },
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return countDwon.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return countDwon.customClass
      }
    },
    autoplay: {
      type: Boolean,
      default() {
        return countDwon.autoplay
      }
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(value) {
        this.autoplay && this.run()
      }
    }
  },
  methods: {
    run() {}
  }
}
</script>
