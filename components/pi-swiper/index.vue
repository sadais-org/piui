<template>
  <view class="pi-width-100P" :style="[customStyle]" :class="[customClass]" />
</template>

<script>
import { systemInfo } from '../../tools/system'

import { getConfig } from '../../config'
const { swiper } = getConfig()

const TAG = 'PiStatusBar'

export default {
  name: TAG,
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return swiper.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return swiper.customClass
      }
    }
  },
  computed: {}
}
</script>
