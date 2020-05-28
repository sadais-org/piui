<template>
  <view v-if="items" class="switch-btn">
    <text
      v-for="item in items"
      :key="item[keyField]"
      :class="{ active: val[keyField] === item.id }"
      @tap="handleTapItem(item)"
    >
      {{ item[displayField] }}
    </text>
  </view>
</template>

<script>
import ValueMixin from '../mixin/value-mixin.js'
export default {
  name: 'SwitchBtn',
  mixins: [ValueMixin],
  props: {
    // 选项列表
    items: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
    // 选项id字段，默认为id
    keyField: {
      required: false,
      type: String,
      default: 'id'
    },
    // 选项显示字段，默认为text
    displayField: {
      required: false,
      type: String,
      default: 'text'
    }
  },
  computed: {
    currentIndex() {
      return this.items.findIndex(item => item[this.keyField] === this.val[this.keyField])
    }
  },
  methods: {
    handleTapItem(item) {
      this.val = item
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-btn {
  position: relative;
  background-color: #f6f7f9;
  border: 2rpx solid #f2f2f2;
  border-radius: 500000rpx;

  & > text {
    position: relative;
    z-index: 2;
    display: inline-block;
    padding: 8rpx 24rpx;
    font-size: 30rpx;
    text-align: center;
    transition: all 0.3s ease-in-out;
    &.active {
      color: #ffffff;
      background: #43a047;
      border-radius: 500000rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
