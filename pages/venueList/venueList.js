// pages/venueList/venueList.js
import { operaitems, priceitems, authitems, seatitems } from './enum.js'
import { AreaInfoUtil } from '../../utils/areaInfo/AreaInfoUtil.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    iyanyiUser: {},
    hasUserInfo: false,
    isRefresh: false,
    searchForm: {
      QueryName: '',
      SpecifyTheaterId: '',
      SpecifyVenueId: '',
      PerformanceTypes: [],
      SeatTotalNumberRanges: [],
      CityCodes: [],
      IsSysConfirmed: '',
      TheatreVenuePrices: [],
      CanBookingTimes: [],
      SortType: { Key: 0 },
      PageSize: 10,
      PageIndex: 1,
      sSeatNum: [],
      city: [],
      seatInput: {},
      sAll: [0],
      sType: [],
      sPrice: [],
      sPriceInput: { from: '', to: '' },
      sAllStr: '综合',
      sTypeStr: '类型',
      sPriceStr: '价格'
    },
    sAllOptions: [
      { label: '综合', value: '0' },
      { label: '好评', value: '1' },
      { label: '最新', value: '2' },
      { label: '热度', value: '3' },
    ],
    sTypeOptions: operaitems,
    sPriceOptions: priceitems,
    seatitems: seatitems,
    priceInput: { from: '', to: '' },
    dataList: [],
    hasMore: false,
    showGoTop: false,
    defaultImg: app.config.defaultImg,
    showLoading: false,
    resHost: app.config.resourceHost
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.entityInfo.entityName || '剧汇王朝POMS',
    })
    this.getUserinfo()
    this.search()
  },
  getUserinfo: function () {
    if (app.globalData.iyanyiUser) {
      this.setData({
        userInfo: app.globalData.userInfo,
        iyanyiUser: app.globalData.iyanyiUser,
        hasUserInfo: true
      })
    }
  },
  search () {
    var that = this
    var searchForm = that.data.searchForm
    var params = {
      QueryName: searchForm.QueryName,
      PageSize: searchForm.PageSize,
      PageIndex: searchForm.PageIndex,
      SpecifyTheaterId: searchForm.SpecifyTheaterId,
      SpecifyVenueId: searchForm.SpecifyVenueId,
      PerformanceTypes: searchForm.PerformanceTypes ,
      SeatTotalNumberRanges: searchForm.SeatTotalNumberRanges,
      CityCodes: searchForm.CityCodes,
      IsSysConfirmed: searchForm.IsSysConfirmed,
      TheatreVenuePrices: searchForm.TheatreVenuePrices,
      CanBookingTimes: searchForm.CanBookingTimes,
      SortType: searchForm.SortType,
    }
    wx.showNavigationBarLoading()
    var oldDataList = []
    if (searchForm.PageIndex !== 1) {
      oldDataList = that.data.dataList
    } else {
      this.toTop()
    }
    that.getOrderList(params, function (res) {
      res.data.DataRows.forEach(v => {
        v.MinVenuePrice = app.util.toThousands(v.MinVenuePrice.toFixed(2))
        v.RatingScore = v.RatingScore.toFixed ? v.RatingScore.toFixed(1) : v.RatingScore
        // 在显示前就将需要的resHost加在url上
        if (v.UrlSmallThumbnail) {
          v.imgUrl = that.data.resHost + v.UrlSmallThumbnail
        } else if (v.UrlBigThumbnail) {
          v.imgUrl = that.data.resHost + v.UrlBigThumbnail
        } else if (v.UrlSource) {
          v.imgUrl = that.data.resHost + v.UrlSource
        }
        v.ShowType = v.ShowType.map(e => e.Name).join('/')
        var areaInfo = AreaInfoUtil.GetCityInCityCode(v.CityCode)
        v.CityName = areaInfo.CityCnName
        v.ProvinceName = areaInfo.ProvinceCnName
      })
      oldDataList = oldDataList.concat(res.data.DataRows)

      that.setData({
        dataList: oldDataList
      })
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  // 图片加载错误
  errorImg: function (e) {
    var _errImg = e.target.dataset.errorsrc
    var _objImg = "'" + _errImg + "'"
    var _errObj = {}
    _errObj[_errImg] = '../../images/operaImgError120X178.jpg'
    // console.log(e.detail.errMsg + "----" + _errObj[_errImg] + "----" + _objImg)
    this.setData(_errObj)
  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
  },
  // 刷新
  refresh: function () {
    this.data.isRefresh = true
    this.onShow()
  },
  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  // 快速搜索隐藏
  fastSearchHide: function () {
    this.setData({
      selectSearchShow: false,
      selectSearhType: ''
    })
  },
  disabledPullDown(e) {
    return false
  },
  // 快速搜索打开
  fastSearchActive: function (e) {
    var data = e.currentTarget.dataset
    var id = Number(data.id)
    if (this.data.selectSearchShow && this.data.selectSearhType === id) {
      this.fastSearchHide()
    } else {
      if (id===3) {
        this.setData({
          priceInput: {...this.data.searchForm.sPriceInput}
        })
      }
      this.setData({
        selectSearchShow: true,
        selectSearhType: id
      })
      this.fastSearchChecked()
    }
  },
  // 快速搜索根据选择的值设置选择状态
  fastSearchChecked: function () {
    let that = this
    let typeId = that.data.selectSearhType
    if (typeId === 1) {
      var sAllOptions = this.data.sAllOptions
      var searchForm = this.data.searchForm
      var arrStr = []
      sAllOptions.forEach(res => {
        res.checked = false
      })
      sAllOptions.forEach(res => {
        if (that.inArray(that.data.searchForm.sAll, res.value)) {
          res.checked = true
        }
      })
      
      that.setData({
        sAllOptions: sAllOptions
      })
    }

    if (typeId === 2) {
      var sOptions = this.data.sTypeOptions
      sOptions.forEach(res => {
        res.checked = false
      })
      sOptions.forEach(res => {
        if (that.inArray(that.data.searchForm.sType, res.value)) {
          res.checked = true
        }
      })

      that.setData({
        sTypeOptions: sOptions
      })
    }

    if (typeId === 3) {
      var sOptions = this.data.sPriceOptions
      sOptions.forEach(res => {
        res.checked = false
      })
      sOptions.forEach(res => {
        if (that.inArray(that.data.searchForm.sPrice, res.value)) {
          res.checked = true
        }
      })

      that.setData({
        sPriceOptions: sOptions
      })
    }
  },
  // 点击选择
  selectOption: function (e) {
    var data = e.currentTarget.dataset
    var value = ''
    if (data.value !== '') {
      value = data.value
    }
    var searchForm = this.data.searchForm
    var valueArr = []
    if (this.data.selectSearhType === 1) {
      valueArr = [value]
      searchForm.sAll = valueArr
      searchForm.SortType = { Key: value }
      this.setData({
        'searchForm.sAll': valueArr,
        'searchForm.sAllStr': this.data.sAllOptions[value].label,
        'searchForm.SortType': { Key: value }
      })
      this.fastSearchChecked()
      // 关闭并搜索
      this.submitFastSearch()
    }

    if (this.data.selectSearhType === 2) {
      var sOptions = this.data.sTypeOptions
      valueArr = sOptions.filter(e => e.checked).map(e => e.value)
      if (this.inArray(valueArr, value)) {
        let i = valueArr.lastIndexOf(value)
        valueArr.splice(i, 1)
      } else {
        valueArr.push(value)
      }
      sOptions.forEach(res => {
        if (this.inArray(valueArr, res.value)) {
          res.checked = true
        } else {
          res.checked = false
        }
      })

      this.setData({
        sTypeOptions: sOptions
      })
    }

    if (this.data.selectSearhType === 3) {
      var sOptions = this.data.sPriceOptions
      valueArr = sOptions.filter(e => e.checked).map(e => e.value)
      if (this.inArray(valueArr, value)) {
        // 从数组中删除
        var i = valueArr.lastIndexOf(value)
        valueArr.splice(i, 1)
      } else {
        valueArr.push(value)
      }
      sOptions.forEach(res => {
        if (this.inArray(valueArr, res.value)) {
          res.checked = true
        } else {
          res.checked = false
        }
      })
      this.setData({
        sPriceOptions: sOptions
      })
    }
  },
  // 判断是否存在数组中
  inArray: function (arr, val) {
    var testStr = ',' + arr.join(",") + ",";
    return testStr.indexOf("," + val + ",") != -1;
  },
  // 重置快速搜索
  resetFastSearch: function () {
    var searchForm = this.data.searchForm
    if (this.data.selectSearhType === 2) {
      this.setData({
        sTypeOptions: this.data.sTypeOptions.map(v => { v.checked = false; return v; })
      })
    }
    if (this.data.selectSearhType === 3) {
      this.setData({
        // 'searchForm.sPriceInput': { 'from': '', to: '' },
        priceInput: { 'from': '', to: '' },
        sPriceOptions: this.data.sPriceOptions.map(v => { v.checked = false; return v;})
      })
    }
  },
  submitFastSearch () {
    var searchForm = this.data.searchForm
    // do action
    //1. 更新字符串
    //2. 更新storage
    //3. 更新search对象中的查询条件
    //4. 查询
    if (this.data.selectSearhType === 2) {
      var checked = this.data.sTypeOptions.filter(e => e.checked)
      this.data.searchForm.sType = checked.map(e => e.value)
      var typeArr = checked.map(e => e.label)
      this.setData({
        'searchForm.sTypeStr': typeArr.length > 0 ? typeArr.join('/') : '类型',
        'searchForm.PerformanceTypes': this.data.searchForm.sType.map(v => new Object({ Key: v }))
      })
    } else if (this.data.selectSearhType === 3) {
      this.data.searchForm.sPriceInput = {...this.data.priceInput}
      var checked = this.data.sPriceOptions.filter(e => e.checked)
      this.data.searchForm.sPrice = checked.map(e => e.value)
      var priceArr = checked.map(e => e.label)
      if (this.data.searchForm.sPriceInput.from && this.data.searchForm.sPriceInput.to)
        priceArr.push(this.data.searchForm.sPriceInput.from + "-" + this.data.searchForm.sPriceInput.to + '万元')
      this.data.searchForm.sPriceStr = priceArr.length > 0 ? priceArr.join('/') : '价格'
      searchForm.TheatreVenuePrices = this.data.searchForm.sPrice.map(v => {
        switch (v) {
          case '1':
            return { From: 0, To: 30000 }
          case '2':
            return { From: 30000, To: 50000 }
          case '3':
            return { From: 50000, To: 70000 }
          case '4':
            return { From: 70000, To: 100000 }
          case '5':
            return { From: 100000, To: null }
        }
      })
      var priceInput = {}
      if (this.data.searchForm.sPriceInput.from || this.data.searchForm.sPriceInput.from === 0) {
        priceInput.From = this.data.searchForm.sPriceInput.from * 10000
      }
      if (this.data.searchForm.sPriceInput.to || this.data.searchForm.sPriceInput.to === 0) {
        priceInput.To = this.data.searchForm.sPriceInput.to * 10000
      }
      this.data.searchForm.TheatreVenuePrices.push(priceInput)
      this.setData({
        searchForm
      })
    }
    this.search()
    // 关闭
    this.fastSearchHide()
  },
  bindinput(e) {
    this.data.priceInput = this.data.priceInput || {}
    this.data.priceInput[e.currentTarget.dataset.type] = e.detail.value.replace(/[^0-9\.]/g, '')
    this.setData({
      'priceInput': this.data.priceInput
    })
  },
  bindblur(e) {
    if (e.detail.value) {
      this.data.priceInput[e.currentTarget.dataset.type] = this.formatNumber(Number.parseFloat(e.detail.value))
      if (this.data.priceInput.to && this.data.priceInput.from && this.data.priceInput.from > this.data.priceInput.to) {
        if (e.currentTarget.dataset.type === 'from') {
          this.data.priceInput.from = this.data.priceInput.to
        } else {
          this.data.priceInput.to = this.data.priceInput.from
        }
      }
      this.setData({
        'priceInput': this.data.priceInput
      })
    }
  },
  // 四舍五入
  formatNumber(num) {
    return Math.round(num * 100) / 100
  },
  getOrderList: function (params, cb) {
    var that = this;
    var url = app.api.TheaterVenueScheduleQuery;
    app.util.postDataList.call(that, url, params, 'POST', cb, function (res) {
      wx.hideNavigationBarLoading()
    });
  },
  clearQueryName() {
    this.setData({
      'searchForm.QueryName': '',
      'searchForm.SpecifyVenueId': '',
      'searchForm.SpecifyTheaterId': '',
      'searchForm.PageIndex': 1
    })
    this.search()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      'searchForm.QueryName': this.data.searchForm.QueryName
    })
    this.fastSearchHide()
    // CityCodes,SeatTotalNumberRanges,TheatreVenuePrices,PerformanceTypes,sPriceStr,sTypeStr
    this.data.searchForm.CityCodes = this.data.searchForm.city.map(v => v.CityCode)
    this.data.searchForm.SeatTotalNumberRanges = this.data.searchForm.sSeatNum.map(v => {
      switch(v) {
        case '1':
          return { From: 0, To: 300 }
        case '2':
          return { From: 300, To: 500 }
        case '3':
          return { From: 500, To: 800 }
        case '4':
          return { From: 800, To: 1200 }
        case '5':
          return { From: 1200, To: null }
      }
    })
    var ss = {}
    if (this.data.searchForm.seatInput.from || this.data.searchForm.seatInput.from === 0) {
      ss.From = this.data.searchForm.seatInput.from
    }
    if (this.data.searchForm.seatInput.to || this.data.searchForm.seatInput.to === 0) {
      ss.To = this.data.searchForm.seatInput.to
    }
    if (ss.From !== undefined || ss.To !== undefined) {
      this.data.searchForm.SeatTotalNumberRanges.push(ss)
    }
    this.data.searchForm.TheatreVenuePrices = this.data.searchForm.sPrice.map(v => {
        switch(v) {
            case '1':
        return { From: 0, To: 30000 }
            case '2':
        return { From: 30000, To: 50000 }
            case '3':
        return { From: 50000, To: 70000 }
            case '4':
        return { From: 70000, To: 100000 }
            case '5':
        return { From: 100000, To: null }
      }
    })
    var priceInput = {}
    if (this.data.searchForm.sPriceInput.from || this.data.searchForm.sPriceInput.from === 0) {
      priceInput.From = this.data.searchForm.sPriceInput.from * 10000
    }
    if (this.data.searchForm.sPriceInput.to || this.data.searchForm.sPriceInput.to === 0) {
      priceInput.To = this.data.searchForm.sPriceInput.to * 10000
    }
    if (priceInput.From !== undefined || priceInput.To !== undefined) {
      this.data.searchForm.TheatreVenuePrices.push(priceInput)
    }
    this.data.searchForm.PerformanceTypes = this.data.searchForm.sType.map(v => new Object({ Key: v }))
    
    var priceArr = this.data.sPriceOptions.filter(e => this.data.searchForm.sPrice.indexOf(e.value)>=0).map(e=>e.label)
    if (this.data.searchForm.sPriceInput.from && this.data.searchForm.sPriceInput.to)
      priceArr.push(this.data.searchForm.sPriceInput.from + "-" + this.data.searchForm.sPriceInput.to + '万元')
    this.data.searchForm.sPriceStr = priceArr.length > 0 ? priceArr.join('/') : '价格'

    var typeArr = this.data.sTypeOptions.filter(e => this.data.searchForm.sType.indexOf(e.value)>=0).map(e => e.label)
    this.data.searchForm.sTypeStr = typeArr.length > 0 ? typeArr.join('/') : '类型'
    this.setData({
      'searchForm.sTypeStr': this.data.searchForm.sTypeStr,
      'searchForm.sPriceStr': this.data.searchForm.sPriceStr
    })
    if (this.data.isRefresh) {
      console.log('isRefresh')
      this.data.isRefresh = false
      this.data.searchForm.PageIndex = 1
      this.search()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 50) {
      this.setData({
        showGoTop: true
      })
    } else {
      this.setData({
        showGoTop: false
      })
    }
  },
  onPullDownRefresh() {
    let that = this
    that.data.isRefresh = true
    that.onShow()
  },
  onReachBottom() {
    if (this.data.hasMore) {
      this.data.searchForm.PageIndex = this.data.searchForm.PageIndex + 1
      this.search()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.util.commonShareAppMessage()
  }
})