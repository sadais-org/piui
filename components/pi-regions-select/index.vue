<template>
  <pi-popup
    ref="popup"
    :value="val"
    :border-radius="borderRadius"
    :show-close-icon="showTitle && showCloseIcon"
    :close-icon-name="closeIconName"
    :close-icon-padding="closeIconPadding"
    :close-icon-color="closeIconColor"
    :close-icon-size="closeIconSize"
    :close-icon-position="closeIconPosition"
    :safe-regions-inset-bottom="safeRegionsInsetBottom"
    :duration="duration"
    :mask-closable="maskClosable"
    :hide-tab-bar="hideTabBar"
    :append-to-body="appendToBody"
    :z-index="zIndex"
    :mask-background="maskBackground"
    @close="handlePopupClose"
  >
    <view
      class="pi-regionsSelect pi-flex-column"
      :style="[customStyle, { height: getHeight }]"
      :class="[customClass]"
    >
      <!-- 标题栏 -->
      <view
        v-if="showTitle"
        class="pi-justify-center pi-fz-32 pi-fw-500"
        :style="[{ padding: getTitlePadding }]"
      >
        <slot v-if="$slots.title" name="title" />
        <template v-else>{{ title }}</template>
      </view>
      <!-- 顶部操作条 -->
      <view
        v-if="toolbarPosition === 'top'"
        class="pi-justify-between pi-align-center pi-solid-bottom-1 pi-fz-32 pi-fw-500 pi-pd-32"
      >
        <slot v-if="$slots.toolbar" name="toolbar" />
        <template v-else>
          <view class="item-btn" @tap="handlePopupClose">取消</view>
          <pi-button
            type="secondary"
            size="small"
            :disabled="!isCompleted"
            :custom-style="{ padding: 0, backgroundColor: 'transparent' }"
            @tap="handleConfirm"
          >
            确定
          </pi-button>
        </template>
      </view>
      <pi-tabs v-model="tabCurrentItem" :items="getTabItems" />
      <swiper class="pi-scroll" :current="tabCurrent" @change="handleSwiperChange">
        <swiper-item v-for="item in getTabItems" :key="item.id">
          <!-- 选择区域 -->
          <scroll-view class="pi-h-100P" scroll-y scroll-with-animation>
            <view
              v-for="region in getRegions"
              :key="region.code"
              :style="[itemStyle, getItemStyle]"
              :class="{ 'pi-solid-bottom-1': showItemBottomBorder }"
              class="pi-justify-between pi-align-center pi-fz-30 pi-pd-lr-32"
              @tap="handleSelectItem(region)"
            >
              <slot name="item" :item="region">
                <!-- 后备内容 -->
                {{ region.name }}
              </slot>
              <pi-checkbox
                v-if="region.code === getSelectCode"
                :value="true"
                active-mode="fill"
                shape="round"
              />
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
      <!-- 顶部操作条 -->
      <pi-bottom-bar v-if="toolbarPosition === 'bottom'">
        <slot v-if="$slots.toolbar" name="toolbar" />
        <pi-button v-else :disabled="!isCompleted" width="100%" type="primary" @tap="handleConfirm">
          确定
        </pi-button>
      </pi-bottom-bar>
    </view>
  </pi-popup>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiRegionsSelect'
const { regionsSelect } = getConfig()
const PLEASE_SELECT_TIP = '请选择'

export default {
  name: TAG,
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
        return regionsSelect.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return regionsSelect.customClass
      }
    },
    toolbarPosition: {
      type: String,
      default: regionsSelect.toolbarPosition,
      validator: function(value) {
        return ['top', 'bottom'].includes(value)
      }
    },
    // 区域数据（数据不全）
    regionsData: {
      type: Array,
      default() {
        return regionsSelect.regionsData
      }
    },
    // 选项id字段，默认为id
    keyField: {
      type: String,
      default: regionsSelect.keyField
    },
    // 选项显示字段，默认为text
    displayField: {
      type: String,
      default: regionsSelect.displayField
    },
    // 默认值
    defaultValue: {
      type: Object,
      default: regionsSelect.defaultValue
    },
    // 是否显示title（默认：true）
    showTitle: {
      type: Boolean,
      default: regionsSelect.showTitle
    },
    // 标题（默认：日期选择）
    title: {
      type: String,
      default: regionsSelect.title
    },
    // 标题 padding（默认：24rpx）
    titlePadding: {
      type: [String, Number],
      default: regionsSelect.titlePadding
    },
    // 弹出选择层的高度，不可填百分比（默认：'50vh'）
    height: {
      type: String,
      default: regionsSelect.height
    },
    // 行高（默认：'110rpx'）
    itemHeight: {
      type: [String, Number],
      default: regionsSelect.itemHeight
    },
    // 是否显示item下边框（默认：'true'）
    showItemBottomBorder: {
      type: Boolean,
      default: regionsSelect.showItemBottomBorder
    },
    // 行样式（默认：'{}'）
    itemStyle: {
      type: Object,
      default() {
        return regionsSelect.itemStyle
      }
    },
    // 是否点击确认的时候关闭弹窗（默认：'true'）
    onConfirmClose: {
      type: Boolean,
      default: regionsSelect.onConfirmClose
    },
    /**
     * 弹窗的配置，默认选项请参照popup
     * ---------------------------------------------------------------------------------------------
     */
    // 控制弹窗的四个角圆角效果（默认'0 0 0 0'）
    borderRadius: {
      type: [String, Number],
      default: regionsSelect.borderRadius
    },
    // 是否显示关闭图标，默认（true）
    showCloseIcon: {
      type: Boolean,
      default: regionsSelect.showCloseIcon
    },
    // 关闭图标的名称，默认（close）
    closeIconName: {
      type: String,
      default: regionsSelect.closeIconName
    },
    closeIconPadding: {
      type: [String, Number],
      default: regionsSelect.closeIconPadding
    },
    // 关闭图标的颜色，默认（'#666666'）
    closeIconColor: {
      type: String,
      default: regionsSelect.closeIconColor
    },
    // 关闭图标的大小，默认（'42rpx'）
    closeIconSize: {
      type: [String, Number],
      default: regionsSelect.closeIconSize
    },
    closeIconWeight: {
      type: [String, Number],
      default: regionsSelect.closeIconWeight
    },
    // 关闭图标位置，tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
    closeIconPosition: {
      type: String,
      default: regionsSelect.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    // 顶部安全适配（状态栏高度，默认true）
    safeRegionsInsetTop: {
      type: Boolean,
      default: regionsSelect.safeRegionsInsetTop
    },
    // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
    safeRegionsInsetBottom: {
      type: Boolean,
      default: regionsSelect.safeRegionsInsetBottom
    },
    /**
     * mask props
     * ---------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，单位为ms，默认（500）
    duration: {
      type: [Number, String],
      default: regionsSelect.duration
    },
    // 是否可以通过点击遮罩进行关闭，默认（true）
    maskClosable: {
      type: Boolean,
      default: regionsSelect.maskClosable
    },
    // 是否隐藏TabBar，默认（false）
    hideTabBar: {
      required: false,
      type: Boolean,
      default: regionsSelect.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）,默认（false）
    appendToBody: {
      type: Boolean,
      default: regionsSelect.appendToBody
    },
    // 层级z-index，（默认1000）
    zIndex: {
      type: [Number, String],
      default: regionsSelect.zIndex
    },
    // 背景颜色（默认'rgba(0, 0, 0, .5)'）
    maskBackground: {
      type: String,
      default: regionsSelect.maskBackground
    }
  },
  data() {
    return {
      tabCurrentItem: { id: 'province', text: PLEASE_SELECT_TIP },
      regions: {
        province: { name: '', code: '' },
        city: { name: '', code: '' },
        county: { name: '', code: '' },
        code: ''
      }
    }
  },
  computed: {
    getHeight() {
      return this.$pi.common.addUnit(this.height)
    },
    getTitlePadding() {
      return this.$pi.common.addUnit(this.titlePadding)
    },
    getItemStyle() {
      const itemHeight = this.$pi.common.addUnit(this.itemHeight)
      return {
        height: itemHeight,
        lineHeight: itemHeight
      }
    },
    tabCurrent() {
      return this.getTabItems.findIndex(t => t.id === this.tabCurrentItem.id)
    },
    getRegions() {
      const regionsKey = this.tabCurrentItem.id
      const regions = this.regions[regionsKey].regions || []
      return regions
    },
    getSelectCode() {
      const regionsKey = this.tabCurrentItem.id
      return this.regions[regionsKey].code
    },
    getTabItems() {
      const { province, city, county } = this.regions
      const tabs = [{ id: 'province', text: province.name || PLEASE_SELECT_TIP }]
      if (province.name) {
        tabs.push({ id: 'city', text: city.name || PLEASE_SELECT_TIP })
      }
      if (city.name) {
        tabs.push({ id: 'county', text: county.name || PLEASE_SELECT_TIP })
      }
      return tabs
    },
    isCompleted() {
      return this.getTabItems.findIndex(t => t.text === PLEASE_SELECT_TIP) === -1
    }
  },
  watch: {
    defaultValue: {
      deep: true,
      immediate: true,
      handler(value) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      if (this.defaultValue) {
        const regions = this.$pi.regions.parseRegions(this.defaultValue.code, this.regionsData)
        this.regions = regions
      }
      // 默认都是展示tab最后一个列表
      this.tabCurrentItem = this.getTabItems[this.getTabItems.length - 1]
    },
    handlePopupClose() {
      this.val = false
      this.$emit('close')
      this.handleEmitChange()
    },
    handleSwiperChange(e) {
      const detail = e.detail
      if (detail.source === 'touch') {
        this.tabCurrentItem = this.getTabItems[detail.current]
      }
    },
    handleSelectItem(item, index) {
      const regionsKey = this.tabCurrentItem.id

      const isChange =
        (regionsKey === 'province' && this.regions.province.code !== item.code) ||
        (regionsKey === 'city' && this.regions.city.code !== item.code)
      if (isChange) {
        // 判断是否切换了省份和城市，如果切换了需要重新生成新的数据
        this.regions = this.$pi.regions.parseRegions(item.code, this.regionsData)
      } else {
        this.regions[regionsKey].code = item.code
        this.regions[regionsKey].name = item.name
        this.regions.code = item.code
      }
      setTimeout(() => {
        // 如果当前tab激活项不是最后一个，向右移动一项
        const tabIndex = this.getTabItems.findIndex(t => t.id === regionsKey)
        if (tabIndex !== this.getTabItems.length - 1) {
          this.tabCurrentItem = this.getTabItems[tabIndex + 1]
        }
      }, 200)
    },
    handleConfirm() {
      this.regions.generateName()
      this.$emit('confirm', this.regions)
      this.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-regionsSelect {
  height: 50vh;
}
</style>
