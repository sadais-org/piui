<template>
  <view
    v-if="show"
    class="pi-skeleton-wrap"
    :style="[customStyle, skeletonContainStyle]"
    :class="[customClass]"
    @touchmove.stop.prevent
  >
    <view
      v-for="(node, index) in skeletonNodes"
      :key="index"
      :class="[animation ? 'skeleton-fade' : '']"
      :style="{
        width: node.width + 'px',
        height: node.height + 'px',
        backgroundColor: nodeBackground,
        borderRadius: node.borderRadius,
        position: 'absolute',
        top: node.top - skeletonContainNode.top + 'px',
        left: node.left - skeletonContainNode.left + 'px'
      }"
    />
  </view>
</template>

<script>
/**
 * skeleton 状态栏
 * @description 骨架屏
 * @property {String} background 是否显示模态框 default: transparent
 * @example <pi-skeleton />
 */
import { systemInfo } from '@sadais/piui-tool/tools/system'
import { getConfig } from '../../config'
const { skeleton } = getConfig()

const TAG = 'PiSkeleton'

export default {
  name: 'PiSkeleton',
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return skeleton.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return skeleton.customClass
      }
    },
    // 是否显示骨架屏
    show: {
      required: false,
      type: Boolean,
      // false
      default: skeleton.show
    },
    // 是否显示加载动画
    animation: {
      required: false,
      type: Boolean,
      // true
      default: skeleton.animation
    },
    // 骨架容器选择器
    containerSkeletonSelector: {
      required: false,
      type: String,
      // .pi-skeleton
      default: skeleton.containerSkeletonSelector
    },
    // 矩形骨架选择器
    rectSkeletonSelector: {
      required: false,
      type: String,
      // .pi-skeleton-rect
      default: skeleton.rectSkeletonSelector
    },
    // 圆形骨架选择器
    circleSkeletonSelector: {
      required: false,
      type: String,
      // .pi-skeleton-circle
      default: skeleton.circleSkeletonSelector
    },
    // 圆角骨架选择器
    roundSkeletonSelector: {
      required: false,
      type: String,
      // .pi-skeleton-round
      default: skeleton.roundSkeletonSelector
    },
    // round 圆角骨架的圆角大小
    borderRadius: {
      type: [String, Number],
      // 12
      default: skeleton.borderRadius
    },
    // 背景颜色
    background: {
      required: false,
      type: String,
      default: skeleton.background
    },
    // 骨架背景颜色
    nodeBackground: {
      required: false,
      type: String,
      default: skeleton.nodeBackground
    }
  },
  data() {
    return {
      skeletonContainNode: {
        width: systemInfo.windowWidth,
        height: systemInfo.windowHeight,
        top: 0,
        right: 0
      },
      skeletonNodes: []
    }
  },
  computed: {
    getBorderRadius() {
      return this.$pi.common.addUnit(this.borderRadius)
    },
    skeletonContainStyle() {
      return {
        position: 'fixed',
        backgroundColor: this.background,
        width: this.skeletonContainNode.width + 'px',
        height: this.skeletonContainNode.height + 'px',
        top: this.skeletonContainNode.top + 'px',
        left: this.skeletonContainNode.left + 'px'
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.handleSelectorQuery()
    }, 500)
  },
  methods: {
    handleSelectorQuery() {
      // 在微信小程序中，如果把骨架屏放入组件中使用的话，需要调in(this)上下文为父组件才有效
      let query = ''
      // #ifdef MP-WEIXIN
      query = uni.createSelectorQuery().in(this.$parent)
      // #endif
      // #ifndef MP-WEIXIN
      query = uni.createSelectorQuery()
      // #endif
      query
        .selectAll(this.containerSkeletonSelector)
        .boundingClientRect()
        .exec(res => {
          console.log(TAG, '骨架屏节点信息查询：', res)
          if (!res || !res[0] || !res[0][0]) {
            console.warn(
              TAG,
              '骨架屏容器节点查询失败,请检查容器节点配置是否正确：',
              this.containerSkeletonSelector
            )
            return
          }
          this.skeletonContainNode = {
            ...res[0][0],
            top: res[0][0].bottom - res[0][0].height
          }
        })
      this.handleNodeQuery('rect')
      this.handleNodeQuery('circle')
      this.handleNodeQuery('round')
    },
    handleNodeQuery(selector) {
      const selectorMap = {
        rect: this.rectSkeletonSelector,
        circle: this.circleSkeletonSelector,
        round: this.roundSkeletonSelector
      }
      // 在微信小程序中，如果把骨架屏放入组件中使用的话，需要调in(this)上下文为父组件才有效
      let query = ''
      // #ifdef MP-WEIXIN
      query = uni.createSelectorQuery().in(this.$parent)
      // #endif
      // #ifndef MP-WEIXIN
      query = uni.createSelectorQuery()
      // #endif
      query
        .selectAll(selectorMap[selector])
        .boundingClientRect()
        .exec(res => {
          let borderRadius = 0
          if (selector === 'round') {
            borderRadius = this.borderRadius
          }
          if (selector === 'circle') {
            borderRadius = '50%'
          }
          this.skeletonNodes = this.skeletonNodes.concat(
            res[0].map(r => ({ ...r, borderRadius, type: selector }))
          )
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton-fade {
  width: 100%;
  height: 100%;
  background: rgb(194, 207, 214);
  animation-name: blink;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: $pi-disabled-opacity;
  }

  100% {
    opacity: 1;
  }
}
</style>
