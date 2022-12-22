<template>
  <view class="table-wrap">
    <view class="table">
      <view class="row">
        <view v-for="(col, idx) in cols" :key="idx" class="head"
        :class="{fixed: !!col.fixed}" 
        :style="[col.style, cellStyle, leftMap[idx], rightMap[idx]]">
          {{ col.name }}
        </view>
      </view>
      <view class="table-body" :data-empty-text="emptyText">
        <block v-if="data.length > 0">
          <view v-for="(row, idx) in data" :key="idx" class="row" :class="{ odd: stripe && idx % 2 > 0 }">
            <view
              v-for="(col, colIdx) in cols"
              :key="colIdx"
              class="cell"
              :class="{fixed: !!col.fixed}"
              :style="[leftMap[colIdx], rightMap[colIdx]]"
            >
              <div class="cell-content-wrap-ph" :style="[{ width: col.style.width }]">
                <image v-if="col.slot && col.slot.type === 'img'" :src="row[col.prop]" :style="[col.slot.style]" />
                <image v-else-if="col.slot && col.slot.type === 'rank' && idx < col.slot.condition" :src="row[col.prop]" :style="[col.slot.style]" />
                <block v-else>{{ row[col.prop] }}</block>
              </div>
              <div class="cell-content-wrap" :style="[cellContentWrapStyle]">
                <image v-if="col.slot && col.slot.type === 'img'" :src="row[col.prop]" :style="[col.slot.style]" />
                <image v-else-if="col.slot && col.slot.type === 'rank' && idx < col.slot.condition" :src="row[col.prop]" :style="[col.slot.style]" />
                <block v-else>{{ row[col.prop] }}</block>
              </div>
            </view>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import { getConfig } from '../../config'
const { table: tableConfig } = getConfig()
export default {
  name: 'PiTable',
  props: {
    // 列配置项
    columns: {
      type: Array,
      // `[]`
      default: () => tableConfig.columns
    },
    // 表格数据源
    data: {
      type: Array,
      // `[]`
      default: () => tableConfig.data
    },
    // 无数据提示语
    emptyText: {
      // `'暂无数据'`
      default: tableConfig.emptyText
    },
    // 是否条纹显示
    stripe: {
      // `true`
      default: tableConfig.stripe
    }
  },
  data() {
    return {
      cellPadding: 16,
      leftMap: {},
      rightMap: {}
    }
  },
  computed: {
    cellStyle() {
      return {
        padding: `${this.cellPadding}rpx`
      }
    },
    cellContentWrapStyle() {
      return {
        left: `${this.cellPadding}rpx`,
        width: `calc(100% - ${this.cellPadding * 2}rpx)`
      }
    },
    cols() {
      const list = (this.columns || []).map(i => {
        const t = { ...i }
        const w = (t.width && `${t.width}rpx`) || 'auto'
        t.style = { width: w }
        return t
      })
      return list
    },
    reCompute() {
      return this.cols.length + this.data.length
    }
  },
  watch: {
    reCompute: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.computeColumnWidth()
        })
      }
    }
  },
  methods: {
    computeColumnWidth() {
      const query = uni.createSelectorQuery().in(this)
      query
        .selectAll('.head')
        .boundingClientRect()
        .exec(res => {
          const list = res[0] || []
          let left = 0
          const isLeft = i => i.fixed === true || i.fixed === 'left'
          const isRight = i => i.fixed === 'right'
          const leftMap = {}
          for (let i = 0; i < list.length; i++) {
            const col = this.cols[i]
            leftMap[i] = { left: isLeft(col) ? `${left}px` : 'auto' }
            left += isLeft(col) ? list[i].width : 0
          }
          const rightMap = {}
          let right = 0
          for (let i = list.length - 1; i >= 0; i--) {
            const col = this.cols[i]
            rightMap[i] = { right: isRight(col) ? `${right}px` : 'auto' }
            right += isRight(col) ? list[i].width : 0
          }
          this.leftMap = leftMap
          this.rightMap = rightMap
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-wrap {
  position: relative;
  width: 100%;
  overflow: auto hidden;
}
.table {
  display: table;
  min-width: 100%;
  background: #ffffff;
  border: none;
  box-sizing: border-box;
}

$even-row-color: #f4f8fd;
.row {
  display: table-row;
  border: none;
  background: inherit;
  &.odd {
    background: $even-row-color;
  }
}
.head {
  display: table-cell;
  padding: 16rpx;
  background: $even-row-color;
  white-space: nowrap;
  text-align: center;
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
  border: none;
}

$fixed-shadow: 0 0 40rpx rgba(11, 101, 209, 0.2);
.head.fixed {
  position: sticky;
  left: 0;
  z-index: 1;
  box-shadow: $fixed-shadow;
}

.cell {
  position: relative;
  display: table-cell;
  padding: 16rpx;
  background: inherit;
  overflow: hidden;
}

.cell.fixed {
  position: sticky;
  left: 0;
  z-index: 1;
  box-shadow: $fixed-shadow;
}

.cell-content-wrap-ph {
  opacity: 0;
  white-space: normal;
  word-wrap: break-word;
  overflow: hidden;
  text-align: center;
  font-size: 28rpx;
  line-height: 1.5;
}
.cell-content-wrap {
  position: absolute;
  top: 0;
  left: 16rpx;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: normal;
  word-wrap: break-word;
  overflow: hidden;
  font-size: 28rpx;
  color: #333333;
  line-height: 1.5;
}

.table-body {
  position: relative;
  display: table-row-group;
  &:empty {
    &::before {
      display: table-row;
      content: '';
      height: 200rpx;
      width: 100%;
    }
    &::after {
      display: block;
      text-align: center;
      content: attr(data-empty-text);
      font-size: 36rpx;
      color: #888888;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-top: 20rpx;
    }
  }
}
</style>
