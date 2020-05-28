<!-- 刻度滑动选择 -->
<template>
  <view class="ruler-box pi-relative " :style="{ width: screenW + 'px' }">
    <!-- 刻度尺指针插槽 -->
    <slot name="arrow" />
    <!-- 展示数字插槽 -->
    <slot name="count" :rulerData="selInd" />
    <view
      class="scroll-wrapper"
      :data-scroll-prop="{
        cellWidth: options.cellWidth,
        startNum: options.startNum,
        endNum: options.endNum,
        cellNum: options.cellNum,
        selInd: options.selInd,
        cells: options.cells,
        defaultNum: options.defaultNum
      }"
      @touchstart="viewController.touchstartHandler"
      @touchend="viewController.touchendHandler"
      @touchmove="viewController.scrollHandler"
    >
      <view
        class="slide-scroll"
        :style="{
          height: options.height,
          alignItems: options.align,
          transform: `translateX(-${(options.defaultNum - options.startNum) *
            options.cells *
            options.cellWidth}px)`
        }"
      >
        <!-- 空白占位 -->
        <view class="empty-none" :style="{ width: (screenW - options.bigItemWidth) / 2 + 'px' }" />
        <!-- 列表项 -->
        <block v-for="(sItem, sIndex) in list" :key="sIndex">
          <view
            class="slide-list"
            :style="{
              width: options.bigItemWidth + 'px',
              marginRight: `${options.cellWidth - options.bigItemWidth}px`,
              backgroundColor: selInd === sIndex * options.cells ? options.selColor : options.color,
              color: selInd === sIndex * options.cells ? options.selColor : options.color,
              height: setUnit(options.bigItemHeight)
            }"
          >
            <view
              class="list-num"
              :style="{
                top: options.numPos === 'bottom' ? `calc(100% + 10rpx)` : 'auto',
                bottom: options.numPos === 'top' ? `calc(100% + 10rpx)` : 'auto',
                color: options.color
              }"
            >
              {{ sItem }}
            </view>
          </view>
          <view
            v-for="(cItem, cIndex) in options.cells - 1"
            :key="cItem"
            class="slide-item"
            :style="{
              width: options.littleItemWidth + 'px',
              marginRight: `${options.cellWidth - options.littleItemWidth}px`,
              backgroundColor:
                selInd === sIndex * options.cells + cIndex + 1 ? options.selColor : options.color,
              height: setUnit(options.littleItemHeight)
            }"
          />
        </block>
        <view
          class="slide-list"
          :style="{
            width: options.bigItemWidth + 'px',
            marginRight: `${options.cellWidth - options.bigItemWidth}px`,
            backgroundColor:
              selInd === list.length * options.cells ? options.selColor : options.color,
            color: selInd === list.length * options.cells ? options.selColor : color,
            height: setUnit(options.bigItemHeight)
          }"
        >
          <view
            class="list-num"
            :style="{
              color: options.color,
              top: options.numPos === 'bottom' ? `calc(100% + 10rpx)` : 'auto',
              bottom: options.numPos === 'top' ? `calc(100% + 10rpx)` : 'auto'
            }"
          >
            {{ options.endNum }}
          </view>
        </view>
        <!-- 空白占位 -->
        <view class="empty-none" :style="{ width: screenW / 2 + 'px' }" />
      </view>
    </view>
  </view>
</template>
<script lang="wxs" module="viewController" src="./index.wxs"></script>
<script>
export default {
  data() {
    return {
      list: [],
      selInd: 0
    }
  },
  props: {
    options: {
      type: Object,
      default() {
        return {
          // 总宽度 数字 单位px <=100为屏幕宽度的百分比
          width: 100,
          // 组件高度
          height: '50px',
          // 大刻度的宽度
          bigItemWidth: 2,
          // 小刻度的宽度
          littleItemWidth: 2,
          // 每一小格的宽度
          cellWidth: 20,
          // 每一大个分为几小格
          cells: 5,
          // 每小格的增量
          cellNum: 1,
          // 最小值
          startNum: 0,
          // 最大值
          endNum: 300,
          // 刻度尺背景色
          bgColor: 'transparent',
          // 文字颜色
          color: '#666',
          // 所选中刻度颜色
          selColor: '#666',
          align: 'center',
          // 大刻度线高度
          bigItemHeight: 30,
          // 小刻度线高度
          littleItemHeight: 15,
          // 起始位置
          defaultNum: 20,
          // 数字对应刻度线位置
          numPos: 'bottom'
        }
      }
    }
  },
  computed: {
    // 总宽度,如果props未传则默认为屏幕宽度
    dpr() {
      const device = wx.getSystemInfoSync()
      const width = device.windowWidth // 设备屏幕宽度
      const xs = width / 750
      return xs
    },
    screenW() {
      const { width } = this.options
      let w = width

      const screenWidth = uni.getSystemInfoSync().screenWidth
      if (width <= 100 && width > 0) {
        w = Math.round((screenWidth * width) / 100)
        return w
      } else if (width > 100 || !width) {
        return w * this.dpr
      }
    },
    // 大刻度的高度
    bIH() {
      const unit = this.bigItemHeight
      if (typeof unit === 'number') {
        return unit + 'rpx'
      } else {
        return unit
      }
    },
    scrollViewStyle() {
      return `
        width: ${this.screenW}rpx;
        height: ${this.height};
        background: ${this.bgColor};
        alignItems: ${this.align}
      `
    }
  },
  onReady() {
    this.initSlide()
  },
  methods: {
    setUnit(unit) {
      if (typeof unit === 'number') {
        return unit + 'rpx'
      } else {
        return unit
      }
    },
    // 初始化
    initSlide() {
      const { defaultNum, startNum, endNum, cellNum, cells } = this.options
      const listNum = cellNum * cells
      const len = (endNum - startNum) / listNum
      const list = []
      let defaultInd = 0
      for (let i = 0; i < len; i++) {
        // 取整
        const lNum = this.getIntNum(startNum + i * listNum)
        list.push(lNum)
      }
      // 计算默认选中
      const dLen = (endNum - startNum) / cellNum
      for (let d = 0; d < dLen; d++) {
        const item = this.getIntNum(startNum + d * cellNum)
        if (item === defaultNum) {
          defaultInd = d
          break
        }
      }
      this.list = list
      this.selInd = defaultNum
    },
    // 四舍五入
    getIntNum(n) {
      return parseInt(n * 100) / 100
    },
    emitDataChange(num) {
      // 修改插槽显示
      this.selInd = num.num
      // 向父组件传递修改后的值
      this.$emit('dataChange', num.num)
    }
  }
}
</script>

<style lang="scss">
.mid-arrow {
  position: absolute;
  top: 0;
  left: 50%;
  box-sizing: content-box;
  width: 0;
  height: 0;
  border-top: 35rpx solid red;
  border-right: 15rpx solid transparent;
  border-left: 15rpx solid transparent;
  transform: translateX(-50%);
}
.scroll-wrapper {
  overflow-x: hidden;
  overflow-y: initial;
  .slide-scroll {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    transition: all 0.05s linear;
  }
}

.slide-list {
  position: relative;
  flex-shrink: 0;
  border-radius: 4px;
  transition: background-color 0.1s;
}

.list-num {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.slide-item {
  flex-shrink: 0;
  border-radius: 4px;
  transition: background-color 0.1s;
}

.empty-none {
  flex-shrink: 0;
  height: 5px;
}
.list-num {
  color: #e6e6e6;
}
</style>
