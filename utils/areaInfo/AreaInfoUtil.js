/**
 * 国家/身份/城市 区域信息的工具类
 * Zhangkj 20180129
 */
import {CHN} from 'CHN.js'
let AreaInfoUtil = (function (instanceConfig) {
    let mInst = null
    function initConstruct() {
      this.defaults = instanceConfig
      // 数据存储位置
      this.AreaDatas = new Array()
      // 从包含整个国家的区域信息的json对象中转换得到需要的数据
      this.ConvertFromCountryJson = function (countryCode, json) {
        if (!countryCode) {
          return
        }
        this.AreaDatas[countryCode] = {}
        if (!json || !json.Provinces) {
          return
        }
        let provinces = []
        let provinceCities = []
        let cities = []
        if (json.Provinces && Array.isArray(json.Provinces) && json.Provinces.length > 0) {
          json.Provinces.forEach(item => {
            if (!item || !item.ThisProvince) {
              return
            }
            provinces.push(item.ThisProvince)
            if (item.ThisProvince.ProvinceCode) {
              provinceCities[item.ThisProvince.ProvinceCode] = item.Cities
            }
            item.Cities.forEach(city => {
              let tempCity = {}
              tempCity = city
              tempCity.ProvinceEnName = item.ThisProvince.ProvinceEnName
              tempCity.ProvinceCnName = item.ThisProvince.ProvinceCnName
              cities[city.CityCode] = tempCity
            })
          })
        }
        this.AreaDatas[countryCode].Provinces = provinces
        this.AreaDatas[countryCode].ProvinceCities = provinceCities
        this.AreaDatas[countryCode].Cities = cities
      }
      // 获取一个国家的所有省级区域
      this.GetProvincesInCountry = function(countryCode) {
        if (!countryCode) {
          countryCode = 'CHN'
        }
        let countryInfo = this.AreaDatas[countryCode]
        if (countryInfo) {
          return countryInfo.Provinces
        } else {
          return []
        }
      }
      // 获取中国一个省份的所有城市信息
      this.GetCitiesInProvinceCN = function(provinceCode) {
        if (!provinceCode) {
          provinceCode = '110000' // 默认为北京
        }
        let countryInfo = this.AreaDatas['CHN']
        if (countryInfo && countryInfo.ProvinceCities && countryInfo.ProvinceCities[provinceCode]) {
          return countryInfo.ProvinceCities[provinceCode]
        } else {
          return []
        }
      }
      // 通过城市代码直接获取城市信息
      this.GetCityInCityCode = function(cityCode) {
        if (!cityCode) {
          cityCode = '110100' // 默认北京市
        }
        let countryInfo = this.AreaDatas['CHN']
        if (countryInfo && countryInfo.Cities && countryInfo.Cities[cityCode]) {
          return countryInfo.Cities[cityCode]
        } else {
          return []
        }
      }
    }
    if (!mInst) {
      mInst = new initConstruct()
      mInst.ConvertFromCountryJson('CHN',CHN)
    }
    return mInst
  })()
  export {AreaInfoUtil}