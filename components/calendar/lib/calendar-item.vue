<template>
  <view
    class="uni-calendar-item__weeks-box"
    :class="{
      'uni-calendar-item--disable': weeks.disable,
      'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
      'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
      'uni-calendar-item--multiple': weeks.multiple
    }"
    @tap="choiceDate(weeks)"
  >
    <view class="uni-calendar-item__weeks-box-item">
      <text v-if="selected && weeks.extraInfo" class="uni-calendar-item__weeks-box-circle" />
      <text
        class="uni-calendar-item__weeks-box-text"
        :class="{
          'uni-calendar-item--isDay-text': weeks.isDay,
          'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
          'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
          'uni-calendar-item--multiple': weeks.multiple,
          'uni-calendar-item--disable': weeks.disable
        }"
      >
        {{ weeks.date }}
      </text>
      <text
        v-if="!lunar && !weeks.extraInfo && weeks.isDay"
        class="uni-calendar-item__weeks-lunar-text"
        :class="{
          'uni-calendar-item--isDay-text': weeks.isDay,
          'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
          'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
          'uni-calendar-item--multiple': weeks.multiple
        }"
      >
        今天
      </text>
      <text
        v-if="lunar && !weeks.extraInfo"
        class="uni-calendar-item__weeks-lunar-text"
        :class="{
          'uni-calendar-item--isDay-text': weeks.isDay,
          'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
          'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
          'uni-calendar-item--multiple': weeks.multiple,
          'uni-calendar-item--disable': weeks.disable
        }"
      >
        {{
          weeks.isDay
            ? '今天'
            : weeks.lunar.IDayCn === '初一'
            ? weeks.lunar.IMonthCn
            : weeks.lunar.IDayCn
        }}
      </text>
      <text
        v-if="weeks.extraInfo && weeks.extraInfo.info"
        class="uni-calendar-item__weeks-lunar-text"
        :class="{
          'uni-calendar-item--extra': weeks.extraInfo.info,
          'uni-calendar-item--isDay-text': weeks.isDay,
          'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
          'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
          'uni-calendar-item--multiple': weeks.multiple,
          'uni-calendar-item--disable': weeks.disable
        }"
      >
        {{ weeks.extraInfo.info }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    weeks: {
      type: Object,
      default() {
        return {}
      }
    },
    calendar: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selected: {
      type: Array,
      default: () => {
        return []
      }
    },
    lunar: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    choiceDate(weeks) {
      this.$emit('change', weeks)
    }
  }
}
</script>

<style lang="scss" scoped>
.uni-calendar-item__weeks-box {
  /* #ifndef APP-NVUE */
  display: flex;
  flex: 1;

  /* #endif */
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.uni-calendar-item__weeks-box-text {
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.uni-calendar-item__weeks-lunar-text {
  font-size: $uni-font-size-sm;
  color: $uni-text-color;
}

.uni-calendar-item__weeks-box-item {
  position: relative;

  /* #ifndef APP-NVUE */
  display: flex;

  /* #endif */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 100rpx;
}

.uni-calendar-item__weeks-box-circle {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background-color: $uni-color-error;
  border-radius: 8px;
}

.uni-calendar-item--disable {
  color: $uni-text-color-disable;
  background-color: rgba(249, 249, 249, $uni-opacity-disabled);
}

.uni-calendar-item--isDay-text {
  color: $pi-primary-color;
}

.uni-calendar-item--isDay {
  color: #ffffff;
  background-color: $pi-primary-color;
  border-radius: 8rpx;
  opacity: 0.8;
}

.uni-calendar-item--extra {
  color: $uni-color-error;
  opacity: 0.8;
}

.uni-calendar-item--checked {
  color: #ffffff;
  background-color: $pi-primary-color;
  border-radius: 8rpx;
  opacity: 0.8;
}

.uni-calendar-item--multiple {
  color: #ffffff;
  background-color: $uni-color-primary;
  opacity: 0.8;
}
</style>
