<template>
  <view class="pi-steps" :style="[customStyle, { flexDirection: direction }]" :class="customClass">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="pi-steps-item"
      :style="itemStyle"
      :class="[itemClass, ['pi-steps-item-' + direction]]"
    >
      <!-- 圆点 -->
      <view
        v-if="mode === 'dot'"
        class="pi-steps-item-dot"
        :class="['pi-steps-item-dot-' + direction]"
        :style="{
          backgroundColor: index === current ? currentColor : index < current ? activeColor : color,
          width: size + 'rpx',
          height: size + 'rpx'
        }"
      />

      <!-- 数字-->
      <view
        v-if="mode === 'number'"
        class="pi-steps-item-number"
        :style="{
          backgroundColor:
            index === current ? 'currentColor' : current < index ? 'transparent' : activeColor,
          borderColor: index === current ? currentColor : index < current ? activeColor : color,
          width: size + 'rpx',
          height: size + 'rpx'
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
      <view v-if="mode === 'icon'">
        <pi-icon
          :style="{
            color: index === current ? currentColor : index < current ? activeColor : color
          }"
          :size="size"
          :name="item.icon"
        />
      </view>

      <!-- 文字 -->
      <view
        :class="['pi-steps-item-text-' + direction]"
        :style="{ color: index === current ? currentColor : index < current ? activeColor : color }"
      >
        <view>{{ item.name }}</view>
        <text class="pi-fz-20" style="word-break:break-all">{{ item.desc }}</text>
      </view>

      <!-- 中线 -->
      <view
        v-if="index < list.length - 1"
        class="pi-steps-item-line"
        :class="['pi-steps-item-line-' + mode]"
        :style="lineStyle"
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
const { steps } = getConfig()
export default {
  name: 'PiSteps',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return steps.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return steps.customClass
      }
    },
    // 自定义样式，对象形式（默认值：{}）
    itemStyle: {
      type: Object,
      default() {
        return steps.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    itemClass: {
      type: String,
      default() {
        return steps.customClass
      }
    },
    // 步骤条的类型，dot|number|icon
    mode: {
      type: String,
      default: steps.mode
    },
    // 步骤条的数据
    list: {
      type: Array,
      default() {
        return steps.list
      }
    },
    // 当前处于第几步
    current: {
      type: [Number, String],
      default: steps.current
    },
    // 激活步骤的颜色
    activeColor: {
      type: String,
      default: steps.activeColor
    },
    // 未激活的颜色
    color: {
      type: String,
      default: steps.color
    },
    // 当前步骤的颜色
    currentColor: {
      type: String,
      default: steps.currentColor
    },
    // 选中图标
    icon: {
      type: String,
      default: steps.icon
    },
    // 排列方向，row|column
    direction: {
      type: String,
      default: steps.direction
    },
    // 图标大小
    size: {
      type: String,
      default: steps.size
    }
  },
  data() {
    return {}
  },
  computed: {
    lineStyle() {
      let style = {}
      let size = this.size / 2 + 'rpx'
      this.direction === 'column' ? (style.left = size) : (style.top = size)
      return style
    }
  },
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.pi-steps {
  display: flex;
  .pi-steps-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    flex: 1;
    font-size: 26rpx;
    &-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      .pi-steps-item-line {
        position: absolute;
        left: 75%;
        z-index: 0;
        width: 50%;
      }
    }

    &-column {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      min-height: 120rpx;
      .pi-steps-item-line {
        position: absolute;
        top: 40%;
        z-index: 0;
        height: 50%;
      }
    }
    &-dot {
      border-radius: 50%;
      &-column {
        margin-top: 4rpx;
      }
    }
    &-number {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1px solid #8799a3;
      border-radius: 50%;
    }
    &-text-row {
      margin-top: 14rpx;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    &-text-column {
      width: 95%;
      margin-left: 14rpx;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
