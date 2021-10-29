export default {
  // 自定义样式
  customStyle: {},
  // 自定义样式类
  customClass: '',
  // 图片src
  src: '',
  // 裁剪窗口大小
  cropSize: { width: "50%", height: "50%" },
  // 最小的裁剪窗口
  minCropSize: { width: "100px", height: "100px" },
  // true: 开启图片边界检测 保证移动图片过程,当图片的边与裁剪框的边重叠时 就无法继续移动
  boundaryDetect: true,
  // 是否保持裁剪框的高宽比不变
  keepCropRatio: false,
  // 是否禁止旋转
  disableRotate: true,
  // 放大裁剪窗口的倍数
  canvasZoom: 1
}