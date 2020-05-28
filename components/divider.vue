<template>
  <view class="divider" :style="{ height: height, background: background }" />
</template>

<script>
export default {
  name: 'Divider',
  props: {
    height: {
      type: String,
      default: '12rpx'
    },
    background: {
      type: String,
      default: '#f5f5f5'
    }
  }
}
</script>
