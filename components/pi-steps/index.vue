<template>
  <view class="pi-steps" :style="{ flexDirection: direction }">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="pi-steps-item"
      :class="['pi-steps-item-' + direction]"
    >
      <!-- 圆点 -->
      <view
        v-if="mode === 'dot'"
        class="pi-steps-item-dot"
        :style="{ backgroundColor: index <= current ? activeColor : color }"
      />

      <!-- 数字-->
      <view
        v-if="mode === 'number'"
        class="pi-steps-item-number"
        :style="{
          backgroundColor: current < index ? 'transparent' : activeColor,
          borderColor: current < index ? color : activeColor
        }"
      >
        <text
          v-if="current < index"
          :style="{
            color: current < index ? color : activeColor
          }"
        >
          {{ index + 1 }}
        </text>
        <pi-icon v-else :name="icon" color="#ffffff" />
      </view>

      <!-- 图标 -->
      <view v-if="mode === 'icon'" class="pi-steps-item-icon">
        <pi-icon
          :style="{
            color: current < index ? color : activeColor
          }"
          :size="size"
          :name="item.icon"
        />
      </view>

      <!-- 文字 -->
      <view
        :class="['pi-steps-item-text-' + direction]"
        :style="{ color: index <= current ? activeColor : color }"
      >
        {{ item.name }}
      </view>

      <!-- 中线 -->
      <view
        v-if="index < list.length - 1"
        class="pi-steps-item-line"
        :class="['pi-steps-item-line-' + mode]"
      >
        <pi-line :direction="direction" length="100%" :hair-line="false" :color="color" />
      </view>
    </view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiSteps'
const { select } = getConfig()
export default {
  name: 'PiSteps',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 步骤条的类型，dot|number|image|hollow
    mode: {
      type: String,
      default: 'dot'
    },
    // 步骤条的数据
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 主题类型, primary|success|info|warning|error
    type: {
      type: String,
      default: 'primary'
    },
    // 当前处于第几步
    current: {
      type: [Number, String],
      default: 0
    },
    // 激活步骤的颜色
    activeColor: {
      type: String,
      default: '#2979ff'
    },
    // 未激活的颜色
    color: {
      type: String,
      default: '#909399'
    },
    // 选中图标
    icon: {
      type: String,
      default: 'check'
    },
    // 排列方向，row|column
    direction: {
      type: String,
      default: 'column'
    },
    // 图标大小
    size: {
      type: String,
      default: '22'
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
$pi-steps-item-number-width: 34rpx;
$pi-steps-item-dot-width: 20rpx;
$pi-steps-item-icon-width: 40rpx;
.pi-steps {
  display: flex;
  .pi-steps-item {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
    &-row {
      display: flex;
      flex-direction: column;

      .pi-steps-item-line {
        position: absolute;
        left: 75%;
        z-index: 0;
        width: 50%;

        &-dot {
          top: calc(#{$pi-steps-item-dot-width} / 2);
        }

        &-number {
          top: calc(#{$pi-steps-item-number-width} / 2);
        }

        &-icon {
          top: calc(#{$pi-steps-item-icon-width} / 2);
        }
      }
    }

    &-column {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      min-height: 120rpx;

      .pi-steps-item-line {
        position: absolute;
        top: 75%;
        z-index: 0;
        height: 50%;

        &-dot {
          left: calc(#{$pi-steps-item-dot-width} / 2);
        }

        &-number {
          left: calc(#{$pi-steps-item-number-width} / 2);
        }

        &-icon {
          left: calc(#{$pi-steps-item-icon-width} / 2);
        }
      }
    }
    &-dot {
      width: $pi-steps-item-dot-width;
      height: $pi-steps-item-dot-width;
      background: color;
      border-radius: 50%;
    }
    &-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: $pi-steps-item-number-width;
      height: $pi-steps-item-number-width;
      overflow: hidden;
      border: 1px solid #8799a3;
      border-radius: 50%;
    }
    &-icon {
      width: $pi-steps-item-icon-width;
      height: $pi-steps-item-icon-width;
    }
    &-text-row {
      margin-top: 14rpx;
      text-align: center;
    }
    &-text-column {
      margin-left: 14rpx;
    }
  }
}
</style>
