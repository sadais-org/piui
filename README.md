## PiUI-basic

PiUI基础库

## 使用方式

1. clone 本仓库到uniapp的工程中
2. page.json 使用easycom使用piui组件

```
"easycom": {
  "^pi-(.*)": "@/piui/components/pi-$1/index.vue"
}
```
3. main.js引入piui

```js
// 引入piui
import piui from '@/piui'
Vue.use(piui)
```

* 以上@/piui路径根据实际clone的项目位置改



