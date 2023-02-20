<template>
  <view class="pi-dropdown pi-rela pi-w-100P" :class="[customClass]" :style="[customStyle]">
    <view>
      <pi-tabs
        :value="activeItem"
        :items="tabs"
        :show-slider-bar="false"
        show-item-split-line
        :stretch="stretch"
        :height="tabHeight"
        active-text-color="inherit"
      >
        <!-- 注意：slot内不能使用父组件data -->
        <dropdown-tab
          slot="item"
          slot-scope="{ item, index }"
          :item="item"
          class="pi-w-100P pi-h-100P"
          @click="handleClickTab(item, index)"
        />
      </pi-tabs>
    </view>
    <!-- 展示dropdownItem下的数据 -->
    <view
      class="pi-dropdown-content"
      :class="[contentClass]"
      :style="[contentStyle, contentCombinationStyle]"
    >
      <slot />
    </view>

    <!-- 遮罩层 -->
    <view
      v-if="!closed"
      class="pi-fixed pi-dropdown-mask"
      :class="[show ? getMask.animationShow : getMask.animationHide]"
      :style="[
        {
          'z-index': getMask.zIndex,
          'top': maskAlignTop ? containerRect.top + containerRect.height + 'px' : '-9999px',
          'background': getMask.background,
          'animation-duration': getDuration.css
        }
      ]"
      @touchmove.stop.prevent="() => {}"
      @tap.stop.prevent="closeMask"
    />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { parentInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'
import { parseDuration } from '@sadais/piui-tool/tools/common'
import DropdownTab from './components/dropdown-tab.vue'

const TAG = 'PiDropdown'
const { dropdown } = getConfig()

export default {
  name: 'PiDropdown',
  components: {
    DropdownTab
  },
  mixins: [
    ValueSync,
    parentInit([
      'itemHeight',
      'keyField',
      'displayField',
      'disabledField',
      'selectedImg',
      'selectedCheckbox'
    ])
  ], // 注入value与val，进行双向绑定
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
    },
    // 标签是否均分布局，可选值 `true`
    stretch: {
      type: Boolean,
      // `false`
      default() {
        return dropdown.stretch
      }
    },
    // 标签的高度，单位rpx
    tabHeight: {
      type: [String, Number],
      // `80`
      default() {
        return dropdown.tabHeight
      }
    },
    // -------------以下属性为子组件pi-dropdown-item继承用--------------
    // 行高 值为数字，则单位默认rpx
    itemHeight: {
      type: [String, Number],
      // 110
      default: dropdown.itemHeight
    },
    // 选项id字段
    keyField: {
      type: String,
      // `id`
      default: dropdown.keyField
    },
    // 选项显示字段
    displayField: {
      type: String,
      // `text`
      default: dropdown.displayField
    },
    // 选项禁用字段，默认为disabled
    disabledField: {
      type: String,
      // `text`
      default: dropdown.disabledField
    },
    // 选中图标的配置
    selectedImg: {
      type: Object,
      default() {
        // 参照img
        return dropdown.selectedImg
      }
    },
    // 选中checkbox配置
    selectedCheckbox: {
      type: [Object, String],
      default() {
        // 参照checkbox
        return dropdown.selectedCheckbox
      }
    },
    // 是否需要蒙层顶部对齐组件，可选值 `false`
    maskAlignTop: {
      type: Boolean,
      // `true`
      default() {
        return dropdown.maskAlignTop
      }
    }
  },
  data() {
    return {
      containerRect: { left: 0, right: 0, top: 0 }, // 容器的位置

      tabs: [], // 下拉菜单
      activeItem: {}, // 当前选中项

      show: false, // 是否显示节点
      showed: false, // 是否显示动画执行完毕
      closed: true, // 是否已关闭（用来防止val为false的情况，动画无法执行）
      submiting: false // 正在更新值（防止快速切换提交）
    }
  },
  computed: {
    contentCombinationStyle() {
      const { containerRect, closed } = this
      return {
        top: `${containerRect.height}px`,
        left: `-${containerRect.left}px`,
        width: `${this.$pi.system.systemInfo.windowWidth}px`,
        zIndex: !closed ? 101 : -1
      }
    },
    getMask() {
      return this.$pi.lang.mergeDeep(dropdown.mask, this.mask)
    },
    getDuration() {
      return parseDuration(this.getMask.duration, dropdown.mask.duration)
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
  },
  methods: {
    init() {
      console.log(TAG, 'init')
      let hasValueChange = false
      const val = this.$pi.lang.cloneDeep(this.val)
      this.tabs = this._children.map((item, index) => {
        if (this.val[index] === undefined) {
          this.val[index] = ''
        }
        // 同步父子组件的值
        if (this.val[index] !== item.val) {
          console.log(TAG, 'Dropdown和DropdownItem绑定值不一致，即将同步')
          item.emitChange(this.val[index])
        }
        const currentOption = item.options?.find(
          opt => !opt.clearable && opt[item.getKeyField] === this.val[index]
        )
        const newItem = {
          showIcon: item.showIcon,
          iconOption: item.getIconOption,
          id: item._uid,
          text: currentOption ? currentOption[item.getDisplayField] : item.title,
          disabled: item.disabled,
          opened: false,
          activeColor: this.activeColor
        }
        return newItem
      })
      if (hasValueChange) {
        this.val = val
        this.handleEmitChange()
      }
    },
    // 显示当前Tab
    async handleClickTab(item) {
      if (item.disabled) return
      if (this.submiting) return console.log(TAG, '你点得太快了')
      if (this.show && item.id === this.activeItem.id) {
        this.closeMask()
        return
      }
      // 更新打开的tab标志
      this.tabs = this.tabs.map(tab => {
        tab.opened = tab.id === item.id
        return tab
      })
      this.activeItem = item
      // 每次点击都重新更新父容器的位置
      this.containerRect = await this.$pi.common.queryRect(this, '.pi-dropdown', false)
      this.openMask()
      this._children.forEach(child => {
        child.show = child._uid === item.id
      })
    },
    openMask() {
      if (this.show) return
      console.log(TAG, '显示下拉菜单遮罩层')
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
      console.log(TAG, '隐藏下拉菜单遮罩层')
      this._children.forEach(child => {
        child.show = false
      })
      this.show = false
      this.showed = false
      this.tabs = this.tabs.map(tab => {
        tab.opened = false
        return tab
      })
      setTimeout(() => {
        this.closed = true
        this.submiting = false
        this.getMask.hideTabBar && uni.showTabBar()
      }, this.getDuration.js)
    },
    // 关闭弹窗并返回结果
    submit() {
      this.submiting = true
      this.closeMask()
      setTimeout(() => {
        // 延迟执行，防止父子组件的值同步不上
        const submitVal = this._children.map(item => item.val)
        this.val = submitVal // 把最终结果传给绑定的v-model值
        this.handleEmitChange()
      }, 20)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-dropdown {
  .pi-dropdown-content {
    position: absolute;
    background: #ffffff;
  }
  .pi-dropdown-mask {
    left: -9999px;
    right: -9999px;
    bottom: -9999px;
  }
}
</style>
