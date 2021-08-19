<template>
  <view class="marquee-item">
    <slot />
  </view>
</template>

<script>
// const TAG = 'PiMarqueeItem'
export default {
  name: 'PiMarqueeItem',
  data() {
    return {
      direction: ''
    }
  },
  mounted() {
    this.$parent.children.push(this)
    this.direction = this.$parent.direction
  },
  beforeDestroy() {
    let targetIdx = -1
    this.$parent.children.some((i, idx) => {
      if (i._uid === this._uid) {
        targetIdx = idx
        return true
      }
      return false
    })
    if (targetIdx !== -1) {
      this.$parent.children.splice(targetIdx, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.marquee-item {
  position: relative;
  display: inline-block;
}

.marquee-item.vertical {
  width: 100%;
  height: auto;
}
</style>
