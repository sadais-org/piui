<template>
  <view class="dropdown-tab-item" :class="[{ opened: item.opened }]">
    <!-- 注意：slot内不能使用父组件data -->
    <view
      class="pi-align-center"
      :style="{ color: item.opened && item.activeColor ? item.activeColor : 'inherit' }"
      @tap.stop="handleClick"
    >
      <pi-icon
        v-if="item.showIcon"
        :name="item.iconOption.name"
        :dot="item.iconOption.dot"
        :badge="item.iconOption.badge"
        :color="item.iconOption.color"
        :size="item.iconOption.size"
        :class-prefix="item.iconOption.classPrefix"
        :custom-style="item.iconOption.customStyle"
        :custom-class="`pi-mg-right-8 ${item.iconOption.customClass}`"
      />

      <text class=" pi-pd-right-8 pi-fz-28">
        {{ item.text }}
      </text>
      <pi-icon :class="{ rotate: item.opened }" name="unfold" size="26" />
    </view>
  </view>
</template>

<script>
const TAG = 'PiDropdownTab'

export default {
  name: TAG,
  props: {
    item: {
      required: true,
      default() {
        return {}
      }
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-tab-item {
  font-size: 33rpx;
  &.opened {
    color: $pi-primary-color;
  }
}

.rotate {
  transition: all $pi-animation-duration $pi-animation-timing-function;
  transform: rotate(180deg);
}
</style>
