/**
 * 父组件初始化
 * @param {String[]} props 需要子组件继承的属性
 */
export function parentInit(props = []) {
  return {
    computed: {
      inheritProps() {
        return props.reduce((p, c) => {
          p[c] = this[c]
          return p
        }, {})
      }
    },
    watch: {
      inheritProps: {
        deep: true,
        handler(value) {
          this._children &&
            this._children.forEach(child => {
              child.inheritPropsUpdate && child.inheritPropsUpdate(value)
            })
        }
      }
    },
    created() {
      this._children = []
    },
    methods: {
      getInheritProps() {
        return this.inheritProps
      }
    }
  }
}

/**
 * 子组件初始化
 * @param {String} parentName 父组件name
 */
export function childInit(parentName) {
  return {
    data() {
      return {
        inheritProps: {}
      }
    },
    computed: {
      isEmptyInheritProps() {
        return this.$pi.lang.isEmpty(this.inheritProps)
      }
    },
    created() {
      this._parent = this.$pi.parent(this, parentName)
      if (this._parent && this._parent.getInheritProps) {
        this.inheritProps = this._parent.getInheritProps()
      }
    },
    methods: {
      inheritPropsUpdate(inheritProps) {
        this.inheritProps = inheritProps
      }
    }
  }
}
