export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  value: 0, // 显示第几项
  imgs: [], // 轮播图列表，默认（[]）
  imgField: '', // 如果imgs传的是字符串数组，imgField传空，如果imgs传的是对象数组，imgField传对象中img字段
  height: 'auto', // 轮播图的高度
  imgMode: 'widthFix', // 图片的裁剪模式，详见image组件裁剪模式，默认（widthFix）
  bgColor: 'transparent', // 背景颜色
  indicatorType: 'number', // 指示器模式 rect / dot / number / none
  indicatorPosition: 'br', // 指示器的位置 tl 左上角/ tc 上中/ tr 右上角/ bl 左下角/ bc 下种 /br 右下角
  indicatorActiveColor: '', // 指示器激活颜色，不设置默认为主题色
  effect3d: false, // 是否开启3d效果
  effect3dPreviousMargin: 50, // effect3d = true的情况下，激活项与前后项之间的距离，单位rpx
  autoplay: true, // 是否自动播放
  interval: 3000, // 自动轮播时间间隔，单位ms
  circular: true, // 是否循环播放
  duration: 500, // 切换一张轮播图所需的时间，单位ms
  borderRadius: 8, // 轮播图圆角值，单位rpx
  imgStyle: {}, // 图片自定义样式，对象形式（默认值：{}）
  titleStyle: {} // 标题自定义样式，对象形式（默认值：{}）
}
