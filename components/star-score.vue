<template>
  <view class="star-wrap">
    <view
      v-for="(score, index) in stars"
      :key="index"
      class="pi-fz-48 star"
      :class="{ 'pi-icon-biaoxingfill': score, 'pi-icon-biaoxing': !score }"
      @tap="handleScore(index)"
    />
  </view>
</template>

<script>
export default {
  name: 'PiStarScore',
  props: {
    // 当前分数值
    value: {
      required: false,
      type: Number,
      default() {
        return 4
      }
    },
    // 最大分数值
    max: {
      required: false,
      type: Number,
      default() {
        return 5
      }
    }
  },
  data() {
    const stars = []
    for (let i = 0; i < this.max; i++) {
      stars.push(i < this.value)
    }
    return {
      stars
    }
  },
  methods: {
    handleScore(i) {
      this.stars = this.stars.map((star, index) => {
        return index <= i
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.star-wrap {
  .star {
    display: inline-block;
    &:not(:first-child) {
      padding-left: 16rpx;
    }
    &.pi-icon-biaoxingfill {
      color: $pi-primary-color;
    }
  }
}
</style>
