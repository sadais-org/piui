<template>
  <pi-popup
    ref="popup"
    :value="val"
    :position="getPopup.position"
    :border-radius="getPopup.borderRadius"
    :show-close-icon="showTitle && getPopup.showCloseIcon"
    :close-icon="getPopup.closeIcon"
    :safe-area-inset-bottom="getPopup.safeAreaInsetBottom"
    :mask="getPopup.mask"
    :hide-tab-bar="getPopup.hideTabBar"
    :append-to-body="getPopup.appendToBody"
    :z-index="getPopup.zIndex"
    :background="getPopup.background"
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
          <view class="item-btn pi-fz-28 pi-mg-left-100" @tap.stop="handlePopupClose">取消</view>
          <pi-button
            type="secondary"
            size="small"
            :disabled="!isCompleted"
            :custom-style="{
              padding: 0,
              marginLeft: '100rpx',
              marginRight: '100rpx',
              backgroundColor: 'transparent'
            }"
            @click="handleConfirm"
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
      <!-- 顶部操作条, 底部安全区域由popup控制 -->
      <pi-bottom-bar v-if="toolbarPosition === 'bottom'" :safe-area="false">
        <slot v-if="$slots.toolbar" name="toolbar" />
        <pi-button
          v-else
          :disabled="!isCompleted"
          width="100%"
          type="primary"
          @click="handleConfirm"
        >
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
    // 弹窗参数设置
    popup: {
      type: Object,
      default() {
        // 参照popup
        return regionsSelect.popup
      }
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
    getPopup() {
      return this.$pi.lang.mergeDeep(regionsSelect.popup, this.popup)
    },
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
