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
      class="pi-regions-select pi-flex-column"
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
          <view class="item-btn" @tap.stop="handlePopupClose">取消</view>
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
      <pi-tabs v-if="val" v-model="tabCurrentItem" :items="getTabItems" />
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
              @tap.stop="handleSelectItem(region)"
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
  name: 'RegionsSelect',
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
      // `{}`
      default() {
        return regionsSelect.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      // `''`
      default() {
        return regionsSelect.customClass
      }
    },
    // 操作条（确定，取消按钮）位置，可选值：`top`
    toolbarPosition: {
      type: String,
      // `bottom`
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
    // 选项id字段
    keyField: {
      type: String,
      // `code`
      default: regionsSelect.keyField
    },
    // 选项显示字段
    displayField: {
      type: String,
      // `name`
      default: regionsSelect.displayField
    },
    // 默认值
    defaultValue: {
      type: Object,
      // `null`，单选是传`Object`，多选时传`Array`
      default: regionsSelect.defaultValue
    },
    // 是否显示title，可选值：`true`
    showTitle: {
      type: Boolean,
      // `false`
      default: regionsSelect.showTitle
    },
    // 标题
    title: {
      type: String,
      // `地区选择`
      default: regionsSelect.title
    },
    // 标题 padding，单位(rpx)
    titlePadding: {
      type: [String, Number],
      // `32rpx`
      default: regionsSelect.titlePadding
    },
    // 弹出选择层的高度，不可填百分比
    height: {
      type: String,
      // `50vh`
      default: regionsSelect.height
    },
    // 行高
    itemHeight: {
      type: [String, Number],
      // `110`
      default: regionsSelect.itemHeight
    },
    // 是否显示item下边框，可选值：`false`
    showItemBottomBorder: {
      type: Boolean,
      // `true`
      default: regionsSelect.showItemBottomBorder
    },
    // 行样式
    itemStyle: {
      type: Object,
      // `{}`
      default() {
        return regionsSelect.itemStyle
      }
    },
    // 是否点击确认的时候关闭弹窗，可选值`false`
    onConfirmClose: {
      type: Boolean,
      // `true`
      default: regionsSelect.onConfirmClose
    },
    /**
     * 弹窗的配置，默认选项请参照popup
     * ---------------------------------------------------------------------------------------------
     */
    // 控制弹窗的四个角圆角效果
    borderRadius: {
      type: [String, Number],
      // `0 0 0 0`
      default: regionsSelect.borderRadius
    },
    // 是否显示关闭图标，可选值 `false`
    showCloseIcon: {
      type: Boolean,
      // `true`
      default: regionsSelect.showCloseIcon
    },
    // 关闭图标的名称
    closeIconName: {
      type: String,
      // `close`
      default: regionsSelect.closeIconName
    },
    //  关闭图标的padding
    closeIconPadding: {
      type: [String, Number],
      // `32rpx 32rpx`
      default: regionsSelect.closeIconPadding
    },
    // 关闭图标的颜色
    closeIconColor: {
      type: String,
      // `#666666`
      default: regionsSelect.closeIconColor
    },
    // 关闭图标的大小
    closeIconSize: {
      type: [String, Number],
      // `42`
      default: regionsSelect.closeIconSize
    },
    // 关闭图标font-weight
    closeIconWeight: {
      type: [String, Number],
      // `800`
      default: regionsSelect.closeIconWeight
    },
    // 关闭图标位置，`tl`为左上角，`tr`为右上角，`bl`为左下角，`br`为右下角，若不指定，
    closeIconPosition: {
      type: String,
      // 若不指定，则按照弹出位置自动显示在合适的位置
      default: regionsSelect.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    /**
     * mask props
     * ---------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，单位为ms
    duration: {
      type: [Number, String],
      // `300`
      default: regionsSelect.duration
    },
    // 是否可以通过点击遮罩进行关闭，可选值`false`
    maskClosable: {
      type: Boolean,
      // `true`
      default: regionsSelect.maskClosable
    },
    // 是否隐藏TabBar，可选值`true`
    hideTabBar: {
      required: false,
      type: Boolean,
      // `false`
      default: regionsSelect.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效），可选值`true`
    appendToBody: {
      type: Boolean,
      // `false`
      default: regionsSelect.appendToBody
    },
    // 层级z-index
    zIndex: {
      type: [Number, String],
      // `100`
      default: regionsSelect.zIndex
    },
    // 背景颜色
    maskBackground: {
      type: String,
      // `rgba(0, 0, 0, .5)`
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
      // 点击取消
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
      // 点击确认事件
      // @arg `regions`
      this.$emit('confirm', this.regions)
      this.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-regions-select {
  height: 60vh;
}
</style>
