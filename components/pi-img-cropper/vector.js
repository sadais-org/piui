export default {
  methods: {
    /**
     * 计算向量vector1旋转到vector2的角度
     * @param vector1 旋转的起始向量
     * @param vector2 旋转的目标向量
     * @return 旋转角度(弧度)
     * > 0：顺时针旋转
     * < 0：逆时针旋转
     */
    angle(vector1, vector2) {
      const dot = vector1.x * vector2.x + vector1.y * vector2.y
      const mod1 = this.mod(vector1)
      const mod2 = this.mod(vector2)
      const l = mod1 * mod2
      if (l) {
        let cosValue = dot / l
        cosValue = Math.min(cosValue, 1)
        let angle = Math.acos(cosValue)
        const tmp = vector1.x * vector2.y - vector1.y * vector2.x
        angle = tmp > 0 ? angle : -angle
        return angle * 180 / Math.PI
      }
      return 0
    },
    /**
     * 计算给定向量的模 即勾股定理
     * @param vector
     * @return 向量的模
     */
    mod(vector) {
      return Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    }
  }
}