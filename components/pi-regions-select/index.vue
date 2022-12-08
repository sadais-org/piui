<template>
  <pi-popup-select
    :value="val"
    :custom-style="getPopupSelect.customStyle"
    :custom-class="getPopupSelect.customClass"
    :height="getPopupSelect.height"
    :show-title="getPopupSelect.showTitle"
    :title="getPopupSelect.title"
    :title-padding="getPopupSelect.titlePadding"
    :toolbar-position="getPopupSelect.toolbarPosition"
    :on-confirm-close="getPopupSelect.onConfirmClose"
    :on-cancel-close="getPopupSelect.onCancelClose"
    :confirm-btn="getConfirmBtn"
    :cancel-btn="getCancelBtn"
    :popup="getPopup"
    @close="handlePopupClose"
    @cancel="handleCancel"
    @confirm="handleConfirm"
    @closed="$emit('closed', $event)"
    @show="$emit('show', $event)"
    @showed="$emit('showed', $event)"
  >
    <view class="pi-h-100P pi-flex-column" :style="[customStyle]" :class="[customClass]">
      <slot name="header" />
      <pi-tabs v-if="val" v-model="tabCurrentItem" :items="getTabItems" />
      <swiper class="pi-scroll" :current="tabCurrent" @change="handleSwiperChange">
        <swiper-item v-for="item in getTabItems" :key="item.id">
          <!-- 选择区域 -->
          <scroll-view class="pi-h-100P" scroll-y scroll-with-animation>
            <view
              v-for="region in getRegions"
              :key="region[keyField]"
              :style="[itemStyle, getItemStyle]"
              :class="{ 'pi-solid-bottom-1': showItemBottomBorder }"
              class="pi-justify-between pi-align-center pi-fz-30 pi-pd-lr-32"
              @tap.stop="handleSelectItem(region)"
            >
              <slot name="item" :item="region">
                <!-- 后备内容 -->
                {{ region[displayField] }}
              </slot>
              <pi-checkbox
                v-if="region[keyField] === getSelectCode"
                :value="true"
                active-mode="fill"
                shape="round"
              />
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
      <slot name="footer" />
    </view>
  </pi-popup-select>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiRegionsSelect'
const { regionsSelect } = getConfig()
const PLEASE_SELECT_TIP = '请选择'

export default {
  name: 'PiRegionsSelect',
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
      type: [Object, String],
      default: regionsSelect.defaultValue
    },
    // 是否只绑定keyField的默认值，默认false
    keyDefaultValue: {
      type: Boolean,
      default: regionsSelect.keyDefaultValue
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
    // 弹窗选择参数设置
    popupSelect: {
      type: Object,
      default() {
        // 参照popup
        return regionsSelect.popupSelect
      }
    },
    // 确认按钮配置
    confirmBtn: {
      type: Object,
      default() {
        return regionsSelect.confirmBtn
      }
    },
    // 取消按钮配置
    cancelBtn: {
      type: Object,
      default() {
        return regionsSelect.cancelBtn
      }
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
    getPopupSelect() {
      return this.$pi.lang.mergeDeep(regionsSelect.popupSelect, this.popupSelect)
    },
    getConfirmBtn() {
      const regionsSelectConfirmBtn = this.$pi.lang.mergeDeep(
        regionsSelect.confirmBtn,
        this.popupSelect.confirmBtn
      )
      const mergeConfirmBtn = this.$pi.lang.mergeDeep(regionsSelectConfirmBtn, this.confirmBtn)
      mergeConfirmBtn.disabled = !this.isCompleted
      return mergeConfirmBtn
    },
    getCancelBtn() {
      const regionsSelectCancelBtn = this.$pi.lang.mergeDeep(
        regionsSelect.cancelBtn,
        this.popupSelect.cancelBtn
      )
      return this.$pi.lang.mergeDeep(regionsSelectCancelBtn, this.cancelBtn)
    },
    getPopup() {
      const regionsSelectPopup = this.$pi.lang.mergeDeep(
        regionsSelect.popup,
        this.popupSelect.popup
      )
      return this.$pi.lang.mergeDeep(regionsSelectPopup, this.popup)
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
    },
    regionsData: {
      handler(value) {
        this.init()
      }
    }
  },
  methods: {
    valid() {
      if (!this.$pi.lang.isEmpty(this.defaultValue)) {
        if (this.keyDefaultValue && this.$pi.lang.isObject(this.defaultValue)) {
          console.error(TAG, 'keyDefaultValue模式下defaultValue不能为对象类型')
          return false
        }
        if (!this.keyDefaultValue && !this.$pi.lang.isObject(this.defaultValue)) {
          console.error(TAG, '非keyDefaultValue模式下defaultValue必须为对象类型')
          return false
        }
      }
      return true
    },
    init() {
      if (!this.valid()) {
        return console.error(TAG, '默认值校验失败，跳过初始化')
      }
      console.log(TAG, '地区选择组件初始化')
      let defaultCode = ''
      if (!this.$pi.lang.isEmpty(this.defaultValue)) {
        defaultCode = this.keyDefaultValue ? this.defaultValue : this.defaultValue.code
      }
      const regions = this.$pi.regions.parseRegions(defaultCode, this.regionsData)
      this.regions = regions
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
    handleSelectItem(region) {
      const regionsKey = this.tabCurrentItem.id

      const isChange =
        (regionsKey === 'province' && this.regions.province.code !== region.code) ||
        (regionsKey === 'city' && this.regions.city.code !== region.code)

      if (isChange) {
        // 判断是否切换了省份和城市，如果切换了需要重新生成新的数据
        this.regions = this.$pi.regions.parseRegions(region.code, this.regionsData)
      } else {
        this.regions[regionsKey].code = region.code
        this.regions[regionsKey].name = region.name
        this.regions.code = region.code
      }
      setTimeout(() => {
        // 如果当前tab激活项不是最后一个，向右移动一项
        const tabIndex = this.getTabItems.findIndex(t => t.id === regionsKey)
        if (tabIndex !== this.getTabItems.length - 1) {
          this.tabCurrentItem = this.getTabItems[tabIndex + 1]
        }
      }, 200)
    },
    /**
     * @vuese 取消选择
     */
    handleCancel() {
      this.$emit('cancel')
      this.onCancelClose && this.handlePopupClose()
    },
    /**
     * @vuese
     * 确认选择
     */
    handleConfirm() {
      let selected = this.regions
      // 返回前生成一下name，方便使用
      this.regions.generateName()
      if (this.keyDefaultValue) {
        selected = selected[this.keyField]
      }
      // 点击确认事件
      this.$emit('confirm', selected, this.regions)
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
