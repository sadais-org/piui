<template>
  <view class="pi-dropdown pi-rela pi-w-100P">
    <view
      class="pi-rela pi-w-100P pi-h-100P pi-solid-bottom-2 pi-bg-white"
      style="z-index: 6;"
      :class="[customClass]"
      :style="[
        customStyle,
        {
          borderRadius: show
            ? `${customStyle.borderRadius} ${customStyle.borderRadius} 0 0`
            : customStyle.borderRadius
        }
      ]"
    >
      <!-- tabs从dropdownItem中获取其name的值 -->
      <scroll-view
        class="pi-srcoll pi-w-100P pi-h-100P"
        scroll-x
        :scroll-left="scrollLeft"
        scroll-with-animation
      >
        <view class="pi-align-center pi-h-100P">
          <view
            v-for="(item, index) in tabs"
            :key="item._uid"
            class="pi-dropdown-tab-item pi-pd-lr-20 pi-text-nowrap pi-h-100P pi-align-center"
            :style="[{ color: show && item._uid === currentId ? activeColor : '' }]"
            @tap="handleClickTab(item, index)"
          >
            <!-- todo 当前项存在value中高亮选项 目前还有问题，当插槽位置在中间时可能有问题 -->
            <pi-icon
              v-if="item.icon"
              class="pi-mg-right-6"
              :color="item.selected ? activeColor : ''"
              :name="item.icon"
              size="36"
            />
            <text
              class="pi-pd-right-8 pi-fz-28"
              :style="{ color: item.selected ? activeColor : '' }"
            >
              {{ item.name }}
            </text>
            <pi-icon :class="{ rotate: show && item._uid === currentId }" name="unfold" size="16" />
          </view>
        </view>
      </scroll-view>
      <!-- 展示dropdownItem下的数据 -->
      <view
        v-show="show"
        :class="[contentClass]"
        :style="[
          { top: customStyle.height, left: 0, background: '#fff' },
          contentStyle,
          {
            borderRadius: show
              ? `0 0 ${contentStyle.borderRadius} ${contentStyle.borderRadius}`
              : contentStyle.borderRadius
          }
        ]"
        class="pi-abso pi-w-100P"
      >
        <view class="pi-dropdown-content pi-mg-top-6">
          <slot />
        </view>
      </view>
    </view>

    <!-- 遮罩层 -->
    <view
      v-if="!closed"
      class="pi-fixed masktest"
      :class="[
        show ? getMask.animationShow : getMask.animationHide,
        getMask.hideTabBar ? 'include-tabbar' : 'exclude-tabbar'
      ]"
      :style="[
        {
          'zIndex': 1,
          'background': getMask.background,
          'animation-duration': getDuration.css
        }
      ]"
      @touchmove.stop.prevent
      @tap.stop.prevent="closeMask"
    />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { parentInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'
import { parseDuration } from '@sadais/piui-tool/tools/common'

const TAG = 'PiDropdown'
const { dropdown } = getConfig()

export default {
  name: TAG,
  mixins: [ValueSync, parentInit(['value', 'tabs'])], // 注入value与val，进行双向绑定
  props: {
    // 初始值
    value: {
      required: false,
      default() {
        return []
      }
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      default() {
        // {}
        return dropdown.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      default() {
        // ''
        return dropdown.customClass
      }
    },
    // 自定义样式，对象形式
    contentStyle: {
      type: Object,
      default() {
        // {}
        return dropdown.contentStyle
      }
    },
    // 自定义样式类，字符串形式
    contentClass: {
      type: String,
      default() {
        // ''
        return dropdown.contentClass
      }
    },
    // 蒙层参数设置
    mask: {
      type: Object,
      default() {
        // 参照mask
        return dropdown.mask
      }
    },
    // 默认选中色
    activeColor: {
      type: String,
      default() {
        // ''
        return dropdown.activeColor
      }
    }
  },
  data() {
    return {
      tabs: [], // 下拉菜单
      currentId: '', // id

      show: false, // 是否显示节点
      showed: false, // 是否显示动画执行完毕
      closed: true, // 是否已关闭（用来防止val为false的情况，动画无法执行）

      // 位置计算
      tabsWidth: 0, // 组件区域宽度
      tabRects: [], // 标签节点信息
      activeIndex: 0 // 当前选中项
    }
  },
  computed: {
    getMask() {
      return this.$pi.lang.mergeDeep(dropdown.mask, this.mask)
    },
    getDuration() {
      return parseDuration(this.getMask.duration, dropdown.mask.duration)
    },
    activeRect() {
      const rect = {
        left: 0,
        width: 0
      }
      if (!this.tabRects.length) return rect
      const activeIndex =
        this.activeIndex >= this.tabRects.length ? this.tabRects.length - 1 : this.activeIndex
      rect.left = this.tabRects.slice(0, activeIndex).reduce((previous, current) => {
        return previous + current.width
      }, 0)
      rect.width = this.tabRects[activeIndex].width
      return rect
    },
    scrollLeft() {
      // 计算当前激活item移动到容器中心距离左边距离
      const scrollLeft = this.activeRect.left - this.tabsWidth / 2 + this.activeRect.width / 2
      return scrollLeft < 0 ? 0 : scrollLeft
    }
  },
  watch: {
    // 界面根据值的变化而变化
    value: {
      immediate: false,
      handler(val) {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
    this.tabsInit()
  },
  methods: {
    async tabsInit() {
      const srollWrapRect = await this.$pi.common.queryRect(this, '.pi-dropdown', false)
      if (srollWrapRect) {
        this.tabsWidth = srollWrapRect.width
      }
      this.tabRects = await this.$pi.common.queryRect(this, '.pi-dropdown-tab-item', true)
    },
    init() {
      // 给下面的选项设置选中效果
      this._children.forEach((item, index) => {
        item.val = this.value[index] || ''
      })
      // 定义新的对象数组渲染界面
      this.tabs = this._children.map((item, index) => {
        const currentItem = item.option.filter(opt => opt.id === this.value[index]) // 获取当前已被选择的项

        const newItem = {
          icon: item.icon || '',
          _uid: item._uid,
          name: currentItem[0]?.name || item.name,
          selected: !!currentItem[0]?.id
        }
        return newItem
      })
    },
    // 显示当前Tab
    handleClickTab(item, index) {
      this.activeIndex = index
      this.openMask()
      this.currentId = item._uid
      this._children.forEach(child => {
        const showTab = child._uid === item._uid
        child.showOption(showTab)
      })
    },
    openMask() {
      if (this.show) return
      console.log(TAG, '显示弹窗层')
      this.closed = false
      this.show = true
      this.showed = false
      this.getMask.hideTabBar && uni.hideTabBar()
      setTimeout(() => {
        this.showed = true
      }, this.getDuration.js)
    },
    // 仅关闭窗口，不作数据操作
    closeMask() {
      if (!this.show || !this.showed) return
      console.log(TAG, '关闭弹窗层')
      this.show = false
      this.showed = false
      setTimeout(() => {
        this.closed = true
        this.getMask.hideTabBar && uni.showTabBar()
      }, this.getDuration.js)
    },
    // 关闭弹窗并返回结果
    handleChangeSubmit() {
      this.closeMask()
      const submitVal = []
      this._children.forEach(item => {
        submitVal.push(item.val)
      })
      this.val = submitVal // 把最终结果传给绑定的v-model值
      this.handleEmitChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-dropdown {
  z-index: 2;
  .pi-dropdown-content {
    left: 0;
    box-shadow: 0 10rpx 10rpx rgba(0, 0, 0, 0.1);
  }
  .pi-dropdown-tab-item {
    transition: all $pi-animation-duration $pi-animation-timing-function;
  }
  .current {
    color: #ff9900;
  }
  .rotate {
    transform: rotate(180deg);
  }
}
</style>
