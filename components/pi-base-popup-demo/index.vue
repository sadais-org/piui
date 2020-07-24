<template>
  <pi-popup
    :value="val"
    :mask="popup.mask"
    :z-index="popup.zIndex"
    :border-radius="popup.borderRadius"
    :show-close-icon="popup.showCloseIcon"
    :close-icon-name="popup.closeIconName"
    :close-icon-padding="popup.closeIconPadding"
    :close-icon-color="popup.closeIconColor"
    :close-icon-size="popup.closeIconSize"
    :close-icon-position="popup.closeIconPosition"
    :safe-area-inset-bottom="popup.safeAreaInsetBottom"
    :mask-closable="popup.maskClosable"
    :hide-tab-bar="popup.hideTabBar"
    @close="handlePopupClose"
  />
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
import { createCustomPropsByConfig } from '../../mixin/component-custom'
const TAG = 'PiBasePopupDemo'
const { demo } = getConfig()

export default {
  name: TAG,
  // 混入v-model
  // 混入自定义样式customStyle和customClass
  mixins: [ValueSync, createCustomPropsByConfig(demo)],
  props: {
    // 弹窗的配置，默认选项请参照popup
    popup: {
      type: Object,
      default() {
        return calendar.popup
      }
    }
  },
  computed: {},
  methods: {
    handlePopupClose() {
      this.val = false
      this.$emit('close')
      this.handleEmitChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-select {
}
</style>
