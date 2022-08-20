<template>
  <scroll-view class="cascader-wrap" scroll-x :scroll-left="scrollLeft">
    <view v-for="(col, idx) of columns" :key="idx" class="column">
      <view
        v-for="(item, subidx) in col"
        :key="getKey(item, subidx)"
        class="column-item"
        :class="{
          active: activeIds.includes(item.uid),
          arrow: item.children && item.children.length > 0,
        }"
        @click="handleClickItem(item)"
      >
        {{ item[props.label] || "" }}
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: "PiCascader",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      default() {
        // {}
        return {};
      },
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return "";
      },
    },
    // 数据源
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Array,
      default: () => [],
    },
    // 配置数据源的key
    props: {
      type: Object,
      default() {
        return {
          label: "label",
          value: "value",
          children: "children",
          id: "id",
          expandTrigger: true,
        };
      },
    },
  },
  data() {
    return {
      curItem: null,
      innerOptions: [],
      optMap: {},
      selectedIds: [],
      scrollLeft: 0,
    };
  },
  computed: {
    columns() {
      if (this.curItem) {
        const arr = [];
        let p = this.curItem;
        while (p) {
          const tmp = p[this.props.children] || [];
          if (tmp.length > 0) {
            arr.unshift(tmp);
          }
          p = this.optMap[p.pid];
        }
        arr.unshift(this.innerOptions);
        return arr;
      }
      return [this.innerOptions];
    },
    activeIds() {
      if (this.curItem) {
        const arr = [];
        let p = this.curItem;
        while (p) {
          arr.unshift(p.uid);
          p = this.optMap[p.pid];
        }
        return arr;
      }
      return [];
    },
    syncIds() {
      return this.innerOptions.length + this.value.length;
    },
  },
  watch: {
    options: {
      immediate: true,
      handler() {
        this.rebuildOptions();
      },
    },
    syncIds: {
      handler() {
        this.initSelectedIds();
      },
    },
  },
  methods: {
    getKey(item, idx) {
      if (this.props.id) {
        return item[this.props.id];
      }
      return `${item.level}-${idx}`;
    },
    randomId() {
      const x = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
      return x.replace(/[xy]/g, (g) => {
        const t = (Math.random() * 16) | 0;
        const c = g === "x" ? t : (t & 0x03) | 0x08;
        return c.toString(16);
      });
    },
    initSelectedIds() {
      let curs = [...this.innerOptions];
      const items = Object.values(this.optMap);
      const results = [];
      for (const val of this.value) {
        const item = items.filter((i) => i[this.props.value] === val)[0];
        if (item) {
          results.push(item.uid);
        }
      }
      this.selectedIds = results;
    },
    rebuildOptions() {
      // 以非递归的方式 深度拷贝options 且建立父子节点关系
      // 目的为了不影响外部传入的prop: options
      const newOptions = [];
      // 初始化堆栈 为options的根节点
      const stack = [...this.options];
      const optMap = {};
      while (stack.length > 0) {
        let item = stack.shift();
        if (!item.pid) {
          // 拷贝
          item = { ...item, level: 0, uid: this.randomId() };
          newOptions.push(item);
        }
        const children = item[this.props.children] || [];
        const newChilds = [];
        for (let i = children.length - 1; i >= 0; i--) {
          // 拷贝子孩子
          const subItem = {
            ...children[i],
            level: item.level + 1,
            uid: this.randomId(),
          };
          // 建立父子关系
          subItem.pid = item.uid;
          // 放置到新数组中
          newChilds.unshift(subItem);
          // 入栈 模拟递归效果
          stack.unshift(subItem);
        }
        // 更新children 为新的数组
        item[this.props.children] = newChilds;
        optMap[item.uid] = item;
      }
      this.innerOptions = newOptions;
      this.optMap = optMap;
    },
    handleClickItem(item) {
      this.curItem = item;
      if (item?.children?.length === 0) {
        // 点击的是叶子节点
        if (this.selectedIds.includes(item.uid)) {
          // 取消选中 其中uid是在rebuildOptions方法中生成的
          this.selectedIds = this.selectedIds.filter((i) => i !== item.uid);
        } else {
          // 选中
          this.selectedIds.push(item.uid);
        }
        // 根据选中的uid转换为对应的value
        const values = this.selectedIds.reduce((prev, i) => {
          const item = this.optMap[i];
          if (item) {
            prev.push(item[this.props.value]);
          }
          return prev;
        }, []);
        this.$emit("input", values);
        this.$emit("change", values);
      }
      this.$nextTick(async () => {
        const maxx = await this.getMaxX();
        const containerWidth = await this.getViewport();
        const left = await this.getScrollLeft();
        const diff = maxx - (left + containerWidth);
        this.scrollLeft = left + diff;
      });
    },
    getViewport() {
      return new Promise((resolve) => {
        const ctx = uni.createSelectorQuery();
        //#ifndef MP-ALIPAY
        ctx.in(this);
        //#endif
        const columns = ctx
          .select(".cascader-wrap")
          .boundingClientRect((res) => {
            console.log(res);
            resolve(res?.width || 0);
          })
          .exec();
      });
    },
    getScrollLeft() {
      return new Promise((resolve) => {
        const ctx = uni.createSelectorQuery();
        //#ifndef MP-ALIPAY
        ctx.in(this);
        //#endif
        const columns = ctx
          .select(".cascader-wrap")
          .scrollOffset((res) => {
            console.log(res);
            resolve(res?.scrollLeft || 0);
          })
          .exec();
      });
    },
    getMaxX(ctx) {
      return new Promise((resolve) => {
        const ctx = uni.createSelectorQuery();
        //#ifndef MP-ALIPAY
        ctx.in(this);
        //#endif
        const columns = ctx
          .selectAll(".column")
          .boundingClientRect((res) => {
            console.log(res);
            if (res?.length > 0) {
              const x = res.reduce((prev, i) => {
                prev += i.width;
                return prev;
              }, 0);
              resolve(x);
            } else {
              resolve(0);
            }
          })
          .exec();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 8rpx;
  height: 8rpx;
}
::-webkit-scrollbar-thumb {
  background: #00ff00;
}
.cascader-wrap {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow: auto hidden;
  background: #f4f2f6;
  box-sizing: border-box;
  font-size: 0;
  .column {
    display: inline-block;
    height: 100%;
    width: 50%;
    overflow: hidden auto;
    .column-item {
      position: relative;
      display: block;
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 calc(#{16rpx / 0.7 + 16rpx}) 0 32rpx;
      font-size: 28rpx;
      color: #333333;
      &.active {
        color: #2069f0;
        background: #ffffff;
      }
      &.arrow::after {
        display: block;
        content: "";
        width: 16rpx;
        height: 16rpx;
        border: 2rpx solid #333333;
        border-top: none;
        border-left: none;
        position: absolute;
        right: 8rpx;
        top: 50%;
        transform: translateY(-50%) rotate(-45deg);
      }
    }
  }
}
</style>
