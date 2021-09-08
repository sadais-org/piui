<template>
  <view class="pi-waterfall">
    <view class="left-column"><slot name="left" :items="leftItems" /></view>
    <view class="right-column"><slot name="right" :items="rightItems" /></view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiWaterfall'
const { waterfall } = getConfig()

export default {
  name: 'PiWaterfall',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    value: {
      // 瀑布流数据
      type: Array,
      required: true,
      default: function() {
        return []
      }
    },
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return waterfall.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return waterfall.customClass
      }
    },
    // 每次向结构插入数据的时间间隔，单位ms
    wait: {
      type: [Number, String],
      default: waterfall.wait
    },
    // id值，用于清除某一条数据时，根据此idKey名称找到并移除
    keyField: {
      type: String,
      default: waterfall.keyField
    }
  },
  data() {
    return {
      totalItems: [],
      leftItems: [],
      rightItems: []
    }
  },
  computed: {
    items() {
      return this.$pi.lang.cloneDeep(this.val)
    }
  },
  watch: {
    items: {
      deep: false,
      immediate: false,
      handler(nVal, oVal) {
        // 取差值，即这一次数组变化新增的部分
        const startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0
        // 拼接上原有数据
        this.totalItems = this.totalItems.concat(nVal.slice(startIndex))
        this.handleAppendItem()
      }
    }
  },
  mounted() {
    this.totalItems = this.$pi.lang.cloneDeep(this.val)
    this.handleAppendItem()
  },
  methods: {
    async handleAppendItem() {
      if (!this.totalItems.length) return
      const leftRect = await this.$pi.common.queryRect(this, '.left-column', false)
      const rightRect = await this.$pi.common.queryRect(this, '.right-column', false)
      console.log(TAG, leftRect, rightRect)
      // 如果左边小于或等于右边，就添加到左边，否则添加到右边
      const item = this.totalItems[0]
      // 解决多次快速上拉后，可能数据会乱的问题，因为经过上面的两个await节点查询阻塞一定时间，加上后面的定时器干扰
      // 数组可能变成[]，导致此item值可能为undefined
      if (!item) return
      if (leftRect.height < rightRect.height) {
        this.leftItems.push(item)
      } else if (leftRect.height > rightRect.height) {
        this.rightItems.push(item)
      } else {
        // 这里是为了保证第一和第二张添加时，左右都能有内容
        // 因为添加第一张，实际队列的高度可能还是0，这时需要根据队列元素长度判断下一个该放哪边
        if (this.leftItems.length <= this.rightItems.length) {
          this.leftItems.push(item)
        } else {
          this.rightItems.push(item)
        }
      }
      // 移除临时列表的第一项
      this.totalItems.splice(0, 1)
      // 如果临时数组还有数据，继续循环
      if (this.totalItems.length) {
        setTimeout(() => {
          this.handleAppendItem()
        }, this.wait)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-waterfall {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.left-column,
.right-column {
  flex: 1;
}
</style>
