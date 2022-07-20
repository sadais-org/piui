<template>
  <!-- 注意：slot内不能使用父组件data -->
  <view
    class="dropdown-tab-item pi-justify-center pi-align-center"
    :style="[getTabItemStyle]"
    :class="[{ opened: item.opened }]"
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

    <text class="pi-pd-right-12 pi-fz-28">
      {{ item.text }}
    </text>
    <pi-icon :class="{ rotate: item.opened }" name="arrow-down_fill" size="26" color="#999" />
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
  computed: {
    getTabItemStyle() {
      const styles = {}
      if (this.item.opened && this.item.activeColor) {
        styles.color = this.item.activeColor
      }
      return styles
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
  width: 100%;
  height: 100%;
  &.opened {
    color: $pi-primary-color;
  }
}

.rotate {
  transition: all $pi-animation-duration $pi-animation-timing-function;
  transform: rotate(180deg);
}
</style>
