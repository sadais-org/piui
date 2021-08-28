<template>
  <view class="page-wrap">
    <view v-for="i in prev" :key="i" class="page-item">{{ i }}</view>
    <template v-if="showEllipsis">
      <view>...</view>
      <view v-for="j in next" :key="`${limit + j}}`" class="page-item">{{ limit + j }}</view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'PiPagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 3
    },
    page: {
      type: Number,
      default: 0
    }
  },
  computed: {
    prev() {
      return this.showEllipsis ? this.limit - 1 : this.total
    },
    next() {
      return this.showEllipsis ? this.total - this.limit : 0
    },
    showEllipsis() {
      return this.limit > 1 && this.limit < this.total
    }
  }
}
</script>

<style lang="scss" scoped></style>
