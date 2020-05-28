<template>
  <mask-content
    :is-show="isShow"
    :mask-closable="maskClosable"
    :hide-tab-bar="hideTabBar"
    @close="handleClose"
  >
    <view class="pi-scroll-container" @tap.stop>
      <view class="item pi-solid-bottom-1 pi-fz-32 pi-fw-500">
        <view class="item-btn" @tap="handleClose">取消</view>
        <view class="item-btn pi-primary" @tap="handleConfirm">确定</view>
      </view>
      <scroll-view
        class="pi-scroll pi-list border"
        scroll-y
        :scroll-into-view="`id-${val[keyField]}`"
        scroll-with-animation
      >
        <view
          v-for="(item, index) in items"
          :id="`id-${item[keyField]}`"
          :key="index"
          class="pi-list-item item border"
          @tap="handleChangeValue(item)"
        >
          <slot name="item" :item="item">
            <!-- 后备内容 -->
            {{ item[displayField] }}
          </slot>
          <view
            v-if="val && item[keyField] === val[keyField]"
            class="pi-icon-check pi-primary pi-fz-48 pi-fw-800"
          />
        </view>
      </scroll-view>
    </view>
  </mask-content>
</template>

<script>
import MaskContent from './mask-content.vue'
import ValueMixin from '../mixin/value-mixin.js'

export default {
  name: 'PiItemSelect',
  components: {
    MaskContent
  },
  mixins: [ValueMixin],
  props: {
    // 选项列表
    items: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
    // 选项id字段，默认为id
    keyField: {
      required: false,
      type: String,
      default: 'id'
    },
    // 选项显示字段，默认为name
    displayField: {
      required: false,
      type: String,
      default: 'name'
    },
    // 是否多选
    isMulti: {
      required: false,
      type: Boolean,
      default: false
    },
    // 是否显示
    isShow: {
      required: false,
      type: Boolean,
      default: false
    },
    // 点击蒙层是否允许关闭
    maskClosable: {
      required: false,
      type: Boolean,
      default: true
    },
    // 是否隐藏TabBar
    hideTabBar: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChangeValue(item) {
      this.val = item
    },
    handleClose() {
      this.$emit('close')
      // 关闭后还原初始值
      this.val = this.value
    },
    handleConfirm() {
      if (this.val) {
        this.$emit(
          'change',
          this.items.find(item => item[this.keyField] === this.val[this.keyField])
        )
      }
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-scroll-container {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 661rpx;
  background-color: #ffffff;

  .item {
    display: flex;
    justify-content: space-between;
    justify-items: center;
    min-height: 110rpx;
    padding: 0 32rpx;
    font-size: 32rpx;
    line-height: 110rpx;
    background-color: #ffffff;
    .item-btn {
      line-height: 110rpx;
    }
  }
}
</style>
