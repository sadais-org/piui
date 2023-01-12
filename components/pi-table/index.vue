<template>
  <view class="table-wrap" :class="{ bounce }">
    <view class="table">
      <view class="row">
        <view
          v-for="(col, idx) in cols"
          :key="idx"
          class="head"
          :class="{ fixed: !!col.fixed }"
          :style="[
            col.style,
            cellPaddingStyle,
            headStyle,
            leftMap[idx],
            rightMap[idx],
          ]"
        >
          {{ col.name }}
        </view>
      </view>
      <view class="table-body" :data-empty-text="emptyText">
        <block v-if="data.length > 0">
          <view
            v-for="(row, idx) in data"
            :key="idx"
            class="row"
            :class="{ odd: stripe && idx % 2 > 0 }"
          >
            <view
              v-for="(col, colIdx) in cols"
              :key="colIdx"
              class="cell"
              :class="{ fixed: !!col.fixed }"
              :style="[cellStyle, leftMap[colIdx], rightMap[colIdx]]"
            >
              <view
                class="cell-content-wrap-ph"
                :style="[
                  {
                    width: col.style.width,
                    whiteSpace: col.whiteSpace || 'normal',
                  },
                ]"
              >
                <image
                  v-if="col.slot && col.slot.type === 'img'"
                  :src="row[col.prop]"
                  :style="[col.slot.style]"
                />
                <image
                  v-else-if="
                    col.slot &&
                    col.slot.type === 'rank' &&
                    idx < col.slot.condition
                  "
                  :src="row[col.prop]"
                  :style="[col.slot.style]"
                />
                <view
                  v-else-if="col.slot && col.slot.type === 'link'"
                  class="pi-align-center"
                >
                  <text
                    v-for="(link, linkIdx) in col.slot.links"
                    :key="linkIdx"
                    class="link"
                    :style="[link.style]"
                    >{{ link.name }}</text
                  >
                </view>
                <block v-else>{{ row[col.prop] }}</block>
              </view>
              <view class="cell-content-wrap" :style="[cellContentWrapStyle]">
                <image
                  v-if="col.slot && col.slot.type === 'img'"
                  :src="row[col.prop]"
                  :style="[col.slot.style]"
                />
                <image
                  v-else-if="
                    col.slot &&
                    col.slot.type === 'rank' &&
                    idx < col.slot.condition
                  "
                  :src="row[col.prop]"
                  :style="[col.slot.style]"
                />
                <view
                  v-else-if="col.slot && col.slot.type === 'link'"
                  class="pi-align-center"
                >
                  <text
                    v-for="(link, linkIdx) in col.slot.links"
                    :key="linkIdx"
                    class="link"
                    :style="[link.style]"
                    @click="
                      handleClickLink({ row, link, linkIdx, rowIdx: idx })
                    "
                    >{{ link.name }}</text
                  >
                </view>
                <block v-else>{{ row[col.prop] }}</block>
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import { getConfig } from "../../config";
const { table: tableConfig } = getConfig();
export default {
  name: "PiTable",
  props: {
    // 是否开启滚动反弹效果
    bounce: {
      // `Boolean`
      type: Boolean,
      // `false`
      default: tableConfig.bounce,
    },
    // 列配置项
    columns: {
      type: Array,
      // `[]`
      default: () => tableConfig.columns,
    },
    // 表格数据源
    data: {
      type: Array,
      // `[]`
      default: () => tableConfig.data,
    },
    // 无数据提示语
    emptyText: {
      // `'暂无数据'`
      default: tableConfig.emptyText,
    },
    // 是否条纹显示
    stripe: {
      // `true`
      default: tableConfig.stripe,
    },
    // 头部样式
    headStyle: {
      type: Object,
      // `{}`
      default: () => tableConfig.headStyle,
    },
    // 单元格样式
    cellStyle: {
      type: Object,
      // `{}`
      default: () => tableConfig.cellStyle,
    },
  },
  data() {
    return {
      cellPadding: 16,
      leftMap: {},
      rightMap: {},
    };
  },
  computed: {
    cellPaddingStyle() {
      return {
        padding: `${this.cellPadding}rpx`,
      };
    },
    cellContentWrapStyle() {
      return {
        padding: `${this.cellPadding}rpx`,
      };
    },
    cols() {
      const list = (this.columns || []).map((i) => {
        const t = { ...i };
        const w = (t.width && `${t.width}rpx`) || "auto";
        t.style = { width: w };
        return t;
      });
      return list;
    },
    reCompute() {
      return this.cols.length + this.data.length;
    },
  },
  watch: {
    reCompute: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.computeColumnWidth();
        });
      },
    },
  },
  methods: {
    computeColumnWidth() {
      const query = uni.createSelectorQuery().in(this);
      query
        .selectAll(".head")
        .boundingClientRect()
        .exec((res) => {
          const list = res[0] || [];
          let left = 0;
          const isLeft = (i) => i.fixed === true || i.fixed === "left";
          const isRight = (i) => i.fixed === "right";
          const leftMap = {};
          for (let i = 0; i < list.length; i++) {
            const col = this.cols[i];
            leftMap[i] = { left: isLeft(col) ? `${left}px` : "auto" };
            left += isLeft(col) ? list[i].width : 0;
          }
          const rightMap = {};
          let right = 0;
          for (let i = list.length - 1; i >= 0; i--) {
            const col = this.cols[i];
            rightMap[i] = { right: isRight(col) ? `${right}px` : "auto" };
            right += isRight(col) ? list[i].width : 0;
          }
          this.leftMap = leftMap;
          this.rightMap = rightMap;
        });
    },
    handleClickLink(info) {
      this.$emit("link", info);
    },
  },
};
</script>

<style lang="scss" scoped>
.table-wrap {
  position: relative;
  width: 100%;
  overflow: auto hidden;
  overscroll-behavior: none;
  &.bounce {
    overscroll-behavior: auto;
  }
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
  background: #ffffff;
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
  min-width: 80rpx;
}
.cell-content-wrap {
  position: absolute;
  top: 0;
  left: 0;
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
      content: "";
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
      white-space: nowrap;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-top: 20rpx;
    }
  }
}
</style>
