<template>
  <view
    class="pi-steps pi-of-hidden"
    :style="[customStyle, { flexDirection: direction }]"
    :class="customClass"
  >
    <view
      v-for="(item, index) in getItems"
      :key="index"
      class="pi-steps-item"
      :style="itemStyle"
      :class="[itemClass, item.mode, direction, { active: index < val }]"
    >
      <view class="step-icon pi-flex-row-center" :style="[item.style]">
        <view class="step-icon-inner">
          <template v-if="item.mode === 'dot'">
            <view class="item-dot pi-radius-round" :style="[item.dotStyle]" />
          </template>
          <!-- 数字-->
          <template v-if="item.mode === 'number'">
            <text v-if="index >= val">
              {{ index + 1 }}
            </text>
            <pi-icon v-else name="check" color="#ffffff" />
          </template>
          <!-- 图标 -->
          <pi-icon
            v-if="item.mode === 'icon'"
            :custom-style="item.icon.customStyle"
            :custom-class="item.icon.customClass"
            :name="item.icon.name"
            :dot="item.icon.dot"
            :dot-radius="item.icon.dotRadius"
            :badge="item.icon.badge"
            :color="item.icon.color"
            :size="item.icon.size"
            :class-prefix="item.icon.classPrefix"
          />
        </view>
      </view>

      <!-- 文字 -->
      <view :class="['pi-steps-item-text']" :style="{ color: item.style.fontColor }">
        <slot
          name="item"
          :item="item"
          :index="index"
          :length="getItemsLength"
          :active="index < val"
        >
          <view>{{ item.name }}</view>
          <text v-if="item.desc" class="pi-fz-20 pi-mg-top-10" style="word-break:break-all">
            {{ item.desc }}
          </text>
        </slot>
      </view>

      <!-- 中线 -->
      <view
        v-if="items.length === 1 || index < items.length - 1"
        class="pi-steps-item-line"
        :style="[lineStyle, item.lineStyle]"
      >
        <pi-line
          :direction="direction"
          length="100%"
          :hair-line="false"
          :color="item.icon.color"
          border-style="dashed"
        />
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
    // 初始值
    value: {
      required: false
    },
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
    items: {
      type: Array,
      default() {
        return steps.items
      }
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
    // 排列方向，row|column
    direction: {
      type: String,
      default: steps.direction
    },
    // 圆点大小
    size: {
      type: String,
      default: steps.size
    },
    // 图标配置
    icon: {
      type: Object,
      default() {
        return steps.icon
      }
    }
  },
  data() {
    return {
      iconsRect: [],
      itemsRect: []
    }
  },
  computed: {
    getDotMaxSize() {
      return this.items.reduce((pre, cur) => {
        const icon = this.$pi.lang.mergeDeep(this.getIcon, cur.icon)
        const size = parseInt(icon.size || this.size, 10)
        return size > pre ? size : pre
      }, 0)
    },
    lineStyle() {
      const style = {}
      const size = this.getDotMaxSize / 2 - 2 + 'rpx'
      this.direction === 'column' ? (style.left = size) : (style.top = size)
      return style
    },
    getCurrentColor() {
      return this.currentColor || this.color
    },

    getIcon() {
      return this.$pi.lang.mergeDeep(steps.rightIcon, this.icon)
    },
    getItems() {
      const getSize = this.$pi.common.addUnit(this.size)
      const getDotMaxSize = this.$pi.common.addUnit(this.getDotMaxSize)

      return this.items.map((originitem, index) => {
        const item = { ...originitem, dotStyle: {} }
        const style = {}
        item.mode = item.mode || this.mode
        item.icon = this.$pi.lang.mergeDeep(this.getIcon, item.icon)
        if (item.mode === 'dot') {
          style.width = getDotMaxSize
          style.height = getDotMaxSize
          item.dotStyle.width = getSize
          item.dotStyle.height = getSize
        }
        if (item.mode === 'number') {
          style.width = getDotMaxSize
          style.height = getDotMaxSize
          style.color = '#ffffff'
        }
        if (index === this.val) {
          // 当前步骤
          style.fontColor = this.getCurrentColor
          if (item.mode === 'icon') {
            style.color = this.getCurrentColor
          } else if (item.mode === 'dot') {
            item.dotStyle.backgroundColor = this.getCurrentColor
          } else {
            style.backgroundColor = this.getCurrentColor
          }
          item.icon.color = this.getCurrentColor
        } else if (index < this.val && this.activeColor) {
          // 已激活步骤
          style.fontColor = this.activeColor
          if (item.mode === 'icon') {
            style.color = this.activeColor
          } else if (item.mode === 'dot') {
            item.dotStyle.backgroundColor = this.activeColor
          } else {
            style.backgroundColor = this.activeColor
          }
          item.icon.color = this.activeColor
        } else if (index > this.val) {
          // 未激活步骤
          style.fontColor = this.color
          if (item.mode === 'dot') {
            item.dotStyle.backgroundColor = this.color
          }
          if (item.mode === 'icon') {
            style.color = this.color
          }
          if (item.mode === 'number') {
            style.backgroundColor = this.color
          }
          item.icon.color = this.color
        }
        item.style = style
        item.lineStyle = {}
        if (
          this.direction === 'column' &&
          this.itemsRect.length &&
          this.iconsRect.length &&
          (this.itemsRect.length === 1 || index < this.itemsRect.length - 1) &&
          (this.iconsRect.length === 1 || index < this.iconsRect.length - 1)
        ) {
          // 动态计算线的位置和高度
          item.lineStyle.top = `${this.iconsRect[index].top -
            this.itemsRect[index].top +
            this.iconsRect[index].height +
            2}px`
          const nextIconsRectHeight = this.iconsRect[index + 1]
            ? this.iconsRect[index + 1].height
            : 0
          item.lineStyle.height = `${this.itemsRect[index].height - nextIconsRectHeight}px`
        }
        return item
      })
    },
    getItemsLength() {
      return this.items.length
    }
  },
  watch: {
    items: {
      deep: true,
      immediate: true,
      handler(value) {
        this.init()
      }
    }
  },
  mounted() {
    // 防止在某些组件slot里面还没渲染，导致获取不到正确的宽高
    setTimeout(() => {
      this.init()
    }, 200)
  },
  methods: {
    async init() {
      console.log(TAG, '初始化计算步骤条')
      if (!this.items?.length) return
      this.iconsRect = await this.$pi.common.queryRect(this, '.step-icon-inner', true)
      this.itemsRect = await this.$pi.common.queryRect(this, '.pi-steps-item', true)
      if (this.iconsRect.length !== this.itemsRect.length) {
        setTimeout(() => {
          this.init()
        }, 200)
      } else {
        console.log(TAG, '计算.pi-steps布局', this.itemsRect, this.iconsRect)
      }
    }
  }
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
    &.row {
      display: flex;
      flex-direction: column;
      align-items: center;
      .pi-steps-item-text {
        margin-top: 14rpx;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .pi-steps-item-line {
        position: absolute;
        left: 75%;
        z-index: 0;
        width: 50%;
      }
    }

    &.column {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: baseline;
      min-height: 120rpx;
      .pi-steps-item-text {
        width: 95%;
        margin-left: 14rpx;
        display: flex;
        flex-direction: column;
      }
      .pi-steps-item-line {
        position: absolute;
        z-index: 0;
      }
    }
    .item-dot,
    .step-icon {
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      z-index: 2;
    }

    &.active {
      .pi-steps-item-text {
        color: $pi-primary-color;
      }

      .item-dot {
        background-color: $pi-primary-color;
      }

      &.icon .step-icon {
        color: $pi-primary-color;
      }

      &.number .step-icon {
        background-color: $pi-primary-color;
      }
    }
  }
}
</style>
