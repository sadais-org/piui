// http://www.stats.gov.cn/tjsj/tjbz/200911/t20091125_8667.html
// 解析规则：
// 第1～2位，为省级代码；
// 第3～4 位，为地级代码；
// 第5～6位，为县级代码；
// 第7～9位，为乡级代码；

/**
 * 解析地区信息
 * @param {String} code 地区编码
 * @param {Array} regionsData 地区数据
 */
export const parseRegions = (code, regionsData) => {
  // 先执行补零操作（最多支持到乡级）
  const fullCode = code.toString().padEnd(9, '0')
  const regions = {
    // 省级代码（省份、直辖市、自治区）
    province: {
      name: '',
      code: fullCode.slice(0, 2),
      regions: []
    },
    // 地级代码（城市）
    city: {
      name: '',
      code: fullCode.slice(0, 4),
      regions: []
    },
    // 县级代码（区县）
    county: {
      name: '',
      code: fullCode.slice(0, 6),
      regions: []
    },
    // 乡级代码（乡镇、街道）
    street: {
      name: '',
      code: fullCode.slice(0, 9)
    },
    name: '',
    code: fullCode,
    // 地址生成
    generateName() {
      this.name = this.province.name + this.city.name + this.county.name + this.street.name
    }
  }

  if (regionsData && regionsData.length) {
    const fields = ['province', 'city', 'county', 'street']
    let iterators = regionsData // 迭代循环的数组

    fields.forEach(field => {
      const target = iterators.find(p => p.code === regions[field].code)
      regions[field].regions = Object.freeze(iterators)
      if (target) {
        regions[field].name = target.name
        // 替换迭代数据
        iterators = target.children || []
      }
    })
  }

  regions.generateName()

  return regions
}
