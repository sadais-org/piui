<template>
  <view class="marquee-item">
    <slot />
  </view>
</template>

<script>
// const TAG = 'PiMarqueeItem'
import { childInit } from '../../mixin/props-sync'
const extendMarquee = childInit('PiMarquee')
export default {
  name: 'PiMarqueeItem',
  mixins: [extendMarquee],
  data() {
    return {}
  },
  mounted() {
    this._parent.children.push(this)
  },
  beforeDestroy() {
    let targetIdx = -1
    this._parent.children.some((i, idx) => {
      if (i._uid === this._uid) {
        targetIdx = idx
        return true
      }
      return false
    })
    if (targetIdx !== -1) {
      this._parent.children.splice(targetIdx, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.marquee-item {
  position: relative;
  display: inline-block;
  font-size: 28rpx;
}

.marquee-item.vertical {
  width: 100%;
  height: auto;
}
</style>
