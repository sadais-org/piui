<template>
  <view class="pi-collapse-item" :class="[customClass]" :style="[customStyle]">
    <!-- 标题 -->
    <view
      class="pi-collapse-item__title pi-justify-between pi-align-center"
      :class="{ disabled: disabled, border: border }"
      @tap="handleCollapseItemClick"
    >
      <!-- 左侧 -->
      <view class="pi-flex-column pi-lh-44">
        <!-- 一级标题 -->
        <slot name="title">
          <text v-if="title" class="text">{{ title }}</text>
        </slot>
        <!-- 二级标题 -->
        <text v-if="checkDesc" class="desc">{{ desc }}</text>
      </view>
      <!-- 右侧 -->
      <view class="pi-align-center pi-lh-44">
        <!-- 自定义内容 -->
        <slot name="value">
          <text v-if="checkValue" class="value">{{ value }}</text>
        </slot>
        <!-- 图标 -->
        <view class="icon pi-mg-left-8" :class="getIconClass">
          <pi-icon name="right" />
        </view>
      </view>
    </view>
    <!-- 内容 -->
    <view
      ref="animation"
      class="pi-collapse-item__content"
      :animation="animationData"
      @tap="handleContentClick"
    >
      <view :id="elId" :ref="elId" class="pi-collapse-item__content__text content-class">
        <slot />
      </view>
    </view>
    <pi-divider v-if="expanded && border" />
  </view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation')
const dom = uni.requireNativePlugin('dom')
// #endif
import { getConfig } from '../../config'
const { collapseItem } = getConfig()

/**
 * collapseItem 折叠面板Item
 * @description 通过折叠面板收纳内容区域（搭配pi-collapse使用）
 * @tutorial http://piui.sadais.com/docs/components/collapse.html
 * @event {Function}			change 			某个item被打开或者收起时触发
 * @example <pi-collapse-item :title="item.head" v-for="(item, index) in itemList" :key="index">{{item.body}}</pi-collapse-item>
 */
export default {
  name: 'PiCollapseItem',
  props: {
    // 标题
    title: {
      type: String,
      default: collapseItem.title
    },
    // 自定义内容
    value: {
      type: String,
      default: collapseItem.value
    },
    // 唯一标识
    name: {
      type: [Number, String],
      default: collapseItem.name
    },
    // 描述
    desc: {
      type: String,
      default: collapseItem.desc
    },
    // 是否禁用折叠面板
    disabled: {
      type: Boolean,
      default: collapseItem.disabled
    },
    // 是否显示内边框
    border: {
      type: Boolean,
      default: collapseItem.border
    },
    // 面板展开收起的过渡时间，单位ms
    duration: {
      type: Number,
      default: collapseItem.duration
    },
    // 自定义折叠面板列表的样式类名
    customClass: {
      type: String,
      default: collapseItem.customClass
    },
    // 自定义折叠面板列表的样式
    customStyle: {
      type: Object,
      default: () => {
        return collapseItem.customStyle
      }
    }
  },
  data() {
    return {
      elId: this.$pi.guid(), // 全局唯一标识符
      // uni.createAnimation的导出数据
      animationData: {},
      // 是否展开状态
      expanded: true,
      // 根据expanded确定是否显示border，为了控制展开时，cell的下划线更好的显示效果，进行一定时间的延时
      showBorder: false,
      // 是否动画中，如果是则不允许继续触发点击
      animating: false,
      // 父组件pi-collapse的参数
      parentData: {
        accordion: false,
        border: false
      }
    }
  },
  computed: {
    // 动态改变折叠面板的展开收起状态
    getIconClass() {
      return this.expanded ? 'up' : 'down'
    },
    // 检查自定义内容是否为空
    checkValue() {
      return !this.$pi.lang.isEmpty(this.value)
    },
    // 检查自定义描述是否为空
    checkDesc() {
      return !this.$pi.lang.isEmpty(this.desc)
    }
  },
  watch: {
    expanded(n) {
      clearTimeout(this.timer)
      this.timer = null
      // 这里根据expanded的值来进行一定的延时，是为了cell的下划线更好的显示效果
      this.timer = setTimeout(
        () => {
          this.showBorder = n
        },
        n ? 10 : 290
      )
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 异步获取内容，或者动态修改了内容时，需要重新初始化
    init() {
      // 初始化数据
      this.updateParentData()
      if (!this.parent) {
        return console.error('pi-collapse-item必须要搭配pi-collapse组件使用')
      }
      const { val, accordion } = this.parent
      if (accordion) {
        if (this.$pi.lang.isArray(val)) {
          return console.error('手风琴模式下，pi-collapse组件的value参数不能为数组')
        }
        this.expanded = this.name == val
      } else {
        if (!this.$pi.lang.isArray(val) && val !== null) {
          return console.error('非手风琴模式下，pi-collapse组件的value参数必须为数组')
        }
        this.expanded = (val || []).some(item => item == this.name)
      }
      console.log('折叠面板item初始化', val, accordion, this.expanded)
      // 设置组件的展开或收起状态
      setTimeout(() => {
        this.setContentAnimate()
      }, 200)
    },
    updateParentData() {
      // 传组件Name给父组件，用于组件展开或收起时，改变父组件的值
      this.getParentData('PiCollapse')
    },
    async setContentAnimate() {
      // 每次面板打开或者收起时，都查询元素尺寸
      // 好处是，父组件从服务端获取内容后，变更折叠面板后可以获得最新的高度
      const rect = await this.queryRect()
      const height = this.expanded ? rect.height : 0
      this.animating = true
      // #ifdef APP-NVUE
      const ref = this.$refs['animation'].ref
      animation.transition(
        ref,
        {
          styles: {
            height: height + 'px'
          },
          duration: this.duration,
          // 必须设置为true，否则会到面板收起或展开时，页面其他元素不会随之调整它们的布局
          needLayout: true,
          timingFunction: 'ease-in-out'
        },
        () => {
          this.animating = false
        }
      )
      // #endif

      // #ifndef APP-NVUE
      const animation = uni.createAnimation({
        timingFunction: 'ease-in-out'
      })
      animation
        .height(height)
        .step({
          duration: this.duration
        })
        .step()
      // 导出动画数据给面板的animationData值
      this.animationData = animation.export()
      // 标识动画结束
      this.sleep(this.duration).then(() => {
        this.animating = false
      })
      // #endif
    },
    handleContentClick() {
      this.$emit('content-click')
    },
    // 点击collapsehead头部
    handleCollapseItemClick() {
      if (this.disabled || this.animating) return
      // 设置本组件为相反的状态
      this.parent && this.parent.onChange(this)
    },
    /**
     * @description 进行延时，以达到可以简写代码的目的
     * @param {number} value 堵塞时间 单位ms 毫秒
     * @returns {Promise} 返回promise
     */
    sleep(value) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, value)
      })
    },
    // 查询内容高度
    queryRect() {
      return new Promise(resolve => {
        // #ifndef APP-NVUE
        this.$pi.common.queryRect(this, `#${this.elId}`).then(size => {
          resolve(size)
        })
        // #endif

        // #ifdef APP-NVUE
        // nvue下，使用dom模块查询元素高度
        // 返回一个promise，让调用此方法的主体能使用then回调
        dom.getComponentRect(this.$refs[this.elId], res => {
          resolve(res.size)
        })
        // #endif
      })
    },
    getParentData(parentName = '') {
      // 避免在created中去定义parent变量
      if (!this.parent) this.parent = {}
      this.parent = this.$pi.parent(this, parentName)
      if (this.parent.children) {
        // 如果父组件的children不存在本组件的实例，才将本实例添加到父组件的children中
        this.parent.children.indexOf(this) === -1 && this.parent.children.push(this)
      }
      if (this.parent && this.parentData) {
        // 历遍parentData中的属性，将parent中的同名属性赋值给parentData
        Object.keys(this.parentData).map(key => {
          this.parentData[key] = this.parent[key]
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-collapse-item {
  &__title {
    padding: 15px;
    // 边框
    &.border {
      position: relative;
      &:after {
        content: ' ';
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid rgb(214, 228, 239);
        color: rgb(214, 228, 239);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
    &:active {
      background-color: #f3f4f6;
    }
    .text {
      color: #303133;
    }
    .desc {
      font-size: 24rpx;
      color: #8c8c8c;
    }
    .icon {
      color: #909399;
      transition: transform 0.3s;
      &.up {
        transform: rotate(-90deg);
      }

      &.down {
        transform: rotate(90deg);
      }
    }
    &.disabled {
      cursor: not-allowed;
      .text,
      .icon {
        color: #cccccc;
      }
    }
  }
  &__content {
    overflow: hidden;
    height: auto;

    &__text {
      padding: 24rpx 30rpx;
      color: #606266;
      line-height: 36rpx;
    }
  }
}
</style>
