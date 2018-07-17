const app = getApp()
import {removeStorage, getStorage, setStorage} from '../../utils/common/storage.js'
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    errorMsg: false,
    netTimeOut: false,
    showGoTop: false,
    defaultImg: app.config.defaultImg,
    userInfo: {},
    iyanyiUser: {},
    hasUserInfo: false,
    hasMore: true,
    pageSize: 10,
    pageIndex: 1,
    dataList: [],
    searchForm: {
      QueryName: '',
      SpecifyTroupeId: '',
      SpecifyShowItemId: '',
      ShowTypes:[],
      ShowMinRanges: [],
      CityCodes: [],
      IsSysConfirmed: '',
      ShowPrices: [],
      CanBookingTimes: [],
      SortType: {Key: 0},
      PageSize: 10,
      PageIndex: 1,
      sAll: [0],
      sType: [],
      sPrice: [],
      sPriceInput: {from: '', to: ''},
      sAllStr: '综合',
      sTypeStr: '类型',
      sPriceStr:'价格'
    },
    filterReturnValue: {
      operaType: [],
      scheduleDate: {},
      price: [],
      auth: [],
      city: [],
      time: [],
      timeInput: {},
      priceInput: {}
    },
    selectSearchShow: false,
    selectSearhType: '', // 1.综合 2.类型 3.价格 
    sAllOptions:[
      { label: '综合', value: '0' },
      { label: '好评', value: '1' },
      { label: '最新', value: '2' },
      { label: '热度', value: '3' },
    ],
    sTypeOptions:[
      { label: '歌剧', value: '1' },
      { label: '音乐剧', value: '2'},
      { label: '舞剧', value: '3'},
      { label: '话剧', value: '4'},
      { label: '儿童剧', value: '5' },
      { label: '芭蕾', value: '6' },
      { label: '交响乐', value: '7' },
      { label: '传统戏剧', value: '8' },
      { label: '相声曲艺', value: '9' },
      { label: '马戏', value: '10' },
      { label: '杂技', value: '11' },
      { label: '魔术', value: '12' },
      { label: '演唱会', value: '13' },
      { label: '其他', value: '999999' },
    ],
    sPriceOptions:[
      { label: '0-3万元', value: '1' },
      { label: '3-5万元', value: '2' },
      { label: '5-7万元', value: '3' },
      { label: '7-10万元', value: '4' },
      { label: '10万元以上', value: '5' },
    ],
    filterKey: 'FilterKey',
    resHost: app.config.resourceHost,
    isRefresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.entityInfo.entityName || '剧汇王朝POMS',
    })
    removeStorage(this.data.filterKey)
    this.getUserinfo()
    this.search()
  },
  getUserinfo: function() {
    if (app.globalData.iyanyiUser) {
      this.setData({
        userInfo: app.globalData.userInfo,
        iyanyiUser: app.globalData.iyanyiUser,
        hasUserInfo: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 从storage获取参数
    var data = getStorage(this.data.filterKey)
    console.log(data)
    if (data) {
      try{
        this.data.filterReturnValue = JSON.parse(data)
        this.data.searchForm.sType = this.data.filterReturnValue.operaType.map(o => o.value)
        this.data.searchForm.sPrice = this.data.filterReturnValue.price.map(o => o.value)
        this.data.searchForm.sPriceInput = {...this.data.filterReturnValue.priceInput}
        var typeArr = this.data.sTypeOptions.filter(e => this.data.searchForm.sType.indexOf(e.value) >= 0).map(e => e.label)
        this.data.searchForm.sTypeStr = typeArr.length > 0 ? typeArr.join('/') : '类型'
        var priceArr = this.data.sPriceOptions.filter(e => this.data.searchForm.sPrice.indexOf(e.value) >= 0).map(e => e.label)
        if (this.data.searchForm.sPriceInput.from && this.data.searchForm.sPriceInput.to)
          priceArr.push(this.data.searchForm.sPriceInput.from + "-" + this.data.searchForm.sPriceInput.to + '万元')
        this.data.searchForm.sPriceStr = priceArr.length > 0 ? priceArr.join('/') : '价格'
        // 赋值条件
        // 类型
        this.data.searchForm.ShowTypes = this.data.searchForm.sType.map(v => new Object({ Key: v }))
        // 价格
        this.data.searchForm.ShowPrices = this.data.searchForm.sPrice.map(v => {
          switch (v) {
            case "1":
              return { From: 0, To: 30000 }
            case "2":
              return { From: 30000, To: 50000 }
            case "3":
              return { From: 50000, To: 70000 }
            case "4":
              return { From: 70000, To: 100000 }
            case "5":
              return { From: 100000, To: null }
          }
        })
        var priceInput = {}
        if (this.data.searchForm.sPriceInput.from) {
          priceInput.From = this.data.searchForm.sPriceInput.from * 10000
        }
        if (this.data.searchForm.sPriceInput.to) {
          priceInput.To = this.data.searchForm.sPriceInput.to * 10000
        }
        this.data.searchForm.ShowPrices.push(priceInput)
        // 档期
        this.data.searchForm.CanBookingTimes = [{ From: this.data.filterReturnValue.scheduleDate.from, To: this.data.filterReturnValue.scheduleDate.to }]
        // 时长
        this.data.searchForm.ShowMinRanges = this.data.filterReturnValue.time.map(v => {
          switch (v.value) {
            case '1':
              return { From: 0, To: 60 }
            case '2':
              return { From: 60, To: 120 }
            case '3':
              return { From: 120, To: 180 }
            case '4':
              return { From: 180, To: 180 }
          }
        })
        var timeInput = {}
        if (this.data.filterReturnValue.timeInput.from) {
          timeInput.From = this.data.filterReturnValue.timeInput.from
        }
        if (this.data.filterReturnValue.timeInput.to) {
          timeInput.To = this.data.filterReturnValue.timeInput.to
        }
        this.data.searchForm.ShowMinRanges.push(timeInput)
        // if (this.data.filterReturnValue.timeInput.from && this.data.filterReturnValue.timeInput.to) {
        //   this.data.searchForm.ShowMinRanges.push({
        //     From: this.data.filterReturnValue.priceInput.from, To: this.data.filterReturnValue.priceInput.to
        //   })
        // }
        // 城市
        if (this.data.filterReturnValue.city.length > 0) {
          this.data.searchForm.CityCodes = this.data.filterReturnValue.city.map(v => v.CityCode)
        }
        // 是否认证
        if (this.data.filterReturnValue.auth.length === 1)
          this.data.searchForm.IsSysConfirmed = this.data.filterReturnValue.auth[0].value === '1'
      }catch(e){console.log(e)}
    }
    
    this.setData({
      searchForm: this.data.searchForm,
      filterReturnValue: this.data.filterReturnValue,
      selectSearchShow: false,

      selectSearhType: '',
      hasMore: false
    })
    if (this.data.isRefresh) {
      console.log('isRefresh')
      this.data.isRefresh = false
      this.data.searchForm.PageIndex = 1
      this.search()
    }
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
  doViewTap: function(e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
    // 地图查看测试
    // app.util.viewMapAddress({ latitude: 31.8812, longitude: 117.2121, name: '测试位置', address: '我就是测试一下'})
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  // 刷新
  refresh: function() {
    this.data.isRefresh = true
    this.onShow() 
  },
  toTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  onPageScroll: function(e) {
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
  onPullDownRefresh () {
    let that = this
    that.data.isRefresh = true
    that.onShow()
  },
  onReachBottom () {
    if (this.data.hasMore) {
      this.data.searchForm.PageIndex = this.data.searchForm.PageIndex + 1
      this.search()
    }
  },
  // 快速搜索隐藏
  fastSearchHide: function() {
    // this.resetFastSearch()
    this.setData({
      selectSearchShow: false,
      selectSearhType: ''
    })
  },
  disabledPullDown (e) {
    return false
  },
  // 快速搜索打开
  fastSearchActive: function(e) {
    var data = e.currentTarget.dataset
    var id = Number(data.id)
    if (this.data.selectSearchShow && this.data.selectSearhType === id){
      this.fastSearchHide()
    }else{
      if (id === 3) {
        this.data.searchForm.sPriceInput = {...this.data.filterReturnValue.priceInput}
      }
      this.setData({
        selectSearchShow: true,
        selectSearhType: id,
        searchForm: this.data.searchForm
      })
      this.fastSearchChecked()
    }
  },
  // 快速搜索根据选择的值设置选择状态
  fastSearchChecked:function(){
    let that = this
    let typeId = that.data.selectSearhType
    if (typeId === 1){
      var sAllOptions = this.data.sAllOptions
      var searchForm = this.data.searchForm
      var arrStr = []
      sAllOptions.forEach(res => {
        res.checked = false
      })
      sAllOptions.forEach(res => {
        if (that.inArray(that.data.searchForm.sAll, res.value)){
          res.checked = true
          arrStr.push(res.label)
        }
      })
      searchForm.sAllStr = arrStr.join('/')
      that.setData({
        sAllOptions: sAllOptions,
        searchForm: searchForm
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
        sTypeOptions: sOptions,
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
        sPriceOptions: sOptions,
      })
    }
  },
  // 点击选择
  selectOption:function(e){
    var data = e.currentTarget.dataset
    var value = ''
    if (data.value !== ''){
      value = data.value
    }
    var searchForm = this.data.searchForm
    var valueArr = []
    if (this.data.selectSearhType === 1) {
      valueArr = [value]
      
      searchForm.sAll = valueArr
      searchForm.SortType = {Key: value}
      this.setData({
        searchForm: searchForm
      })
      // check选择
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
        valueArr.splice(i,1)
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
        sPriceOptions: sOptions,
      })
    }

  },
  // 判断是否存在数组中
  inArray: function (arr, val) {
    var testStr = ',' + arr.join(",") + ",";
    return testStr.indexOf("," + val + ",") != -1;
  },
  // 重置快速搜索
  resetFastSearch:function(){
    var searchForm = this.data.searchForm
    if (this.data.selectSearhType === 2) {
      searchForm.sType = []
    }
    if (this.data.selectSearhType === 3) {
      searchForm.sPrice = []
      searchForm.sPriceInput = {'from':'', to: ''}
    }
    this.setData({
      searchForm: searchForm
    })
    // check选择状态
    this.fastSearchChecked()
  },
  // 提交快速搜索
  submitFastSearch: function () {
    var searchForm = this.data.searchForm
    // do action
    //1. 更新字符串
    //2. 更新storage
    //3. 更新search对象中的查询条件
    //4. 查询
    if (this.data.selectSearhType === 2) {
      var checked = this.data.sTypeOptions.filter(e => e.checked)
      this.data.searchForm.sType = checked.map(e=> e.value)
      var typeArr = checked.map(e => e.label)
      this.data.searchForm.sTypeStr = typeArr.length > 0 ? typeArr.join('/') : '类型'
      this.data.filterReturnValue.operaType = this.data.searchForm.sType.map(e => new Object({index: this.data.sTypeOptions.map(t => t.value).indexOf(e), value: e}))
      setStorage(this.data.filterKey, JSON.stringify(this.data.filterReturnValue))
      this.data.searchForm.ShowTypes = this.data.searchForm.sType.map(v => new Object({Key:v}))
      this.setData({
        searchForm
      })
    } else if (this.data.selectSearhType === 3) {
      var checked = this.data.sPriceOptions.filter(e => e.checked)
      this.data.searchForm.sPrice = checked.map(e => e.value)
      var priceArr = checked.map(e => e.label)
      if (this.data.searchForm.sPriceInput.from && this.data.searchForm.sPriceInput.to)
        priceArr.push(this.data.searchForm.sPriceInput.from + "-" + this.data.searchForm.sPriceInput.to + '万元')
      this.data.searchForm.sPriceStr = priceArr.length > 0 ? priceArr.join('/') : '价格'
      this.data.filterReturnValue.price = this.data.searchForm.sPrice.map(e => new Object({ index: this.data.sPriceOptions.map(t => t.value).indexOf(e), value: e }))
      this.data.filterReturnValue.priceInput = {...this.data.searchForm.sPriceInput}
      setStorage(this.data.filterKey, JSON.stringify(this.data.filterReturnValue))
      searchForm.ShowPrices = this.data.searchForm.sPrice.map(v => {
        switch(v) {
          case '1':
            return {From: 0, To: 30000}
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
      if (this.data.searchForm.sPriceInput.from) {
        priceInput.From = this.data.searchForm.sPriceInput.from * 10000
      }
      if (this.data.searchForm.sPriceInput.to) {
        priceInput.To = this.data.searchForm.sPriceInput.to * 10000
      }
      this.data.searchForm.ShowPrices.push(priceInput)
      this.setData({
        searchForm
      })
    }
    this.search()
    // 关闭
    this.fastSearchHide()
  },
  bindinput (e) {
    this.data.searchForm.sPriceInput = this.data.searchForm.sPriceInput || {}
    this.data.searchForm.sPriceInput[e.currentTarget.dataset.type] = e.detail.value.replace(/[^0-9\.]/g, '')
    this.setData({
      searchForm: this.data.searchForm
    })
  },
  bindblur (e) {
    if (e.detail.value) {
      this.data.searchForm.sPriceInput[e.currentTarget.dataset.type] = this.formatNumber(Number.parseFloat(e.detail.value))
      if (this.data.searchForm.sPriceInput.to && this.data.searchForm.sPriceInput.from && this.data.searchForm.sPriceInput.from > this.data.searchForm.sPriceInput.to) {
        if (e.currentTarget.dataset.type === 'from') {
          this.data.searchForm.sPriceInput.from = this.data.searchForm.sPriceInput.to
        } else {
          this.data.searchForm.sPriceInput.to = this.data.searchForm.sPriceInput.from
        }
      }
      this.setData({
        searchForm: this.data.searchForm
      })
    }
  },
  // 四舍五入
  formatNumber(num) {
    return Math.round(num * 100) / 100
  },
  search () {
    var that = this
    var searchForm = that.data.searchForm
    var params = { 
      QueryName: searchForm.QueryName, 
      PageSize: searchForm.PageSize, 
      PageIndex: searchForm.PageIndex, 
      SpecifyTroupeId: searchForm.SpecifyTroupeId, 
      SpecifyShowItemId: searchForm.SpecifyShowItemId, 
      ShowTypes: searchForm.ShowTypes, 
      ShowMinRanges: searchForm.ShowMinRanges,
      CityCodes: searchForm.CityCodes,
      IsSysConfirmed: searchForm.IsSysConfirmed,
      ShowPrices: searchForm.ShowPrices,
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
      console.log(res)
      // app.util.toThousands(newOperaInfo.ItemPrice.EpositPrice.toFixed(2))
      res.data.DataRows.forEach(v => {
        v.MinShowPrice = app.util.toThousands(v.MinShowPrice.toFixed(2))
        v.FirstShowDate = v.FirstShowDate && app.util.formatDate(new Date(v.FirstShowDate), 'yyyy.MM.dd')
        v.RatingScore = v.RatingScore.toFixed ? v.RatingScore.toFixed(1) : v.RatingScore
      })
      // console.log(res)
      oldDataList = oldDataList.concat(res.data.DataRows)
      // 在显示前就将需要的resHost加在url上
      oldDataList.forEach(item => {
        if (item && (item.UrlSmallThumbnail || item.UrlBigThumbnail || item.UrlSource)) {
          if (item.UrlSmallThumbnail) {
            item.imgUrl = that.data.resHost + item.UrlSmallThumbnail
          } else if (item.UrlBigThumbnail) {
            item.imgUrl = that.data.resHost + item.UrlBigThumbnail
          } else if (item.UrlSource) {
            item.imgUrl = that.data.resHost + item.UrlSource
          }
        }
      })
      that.setData({
        dataList: oldDataList
      })
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  getOrderList: function (params, cb) {
    var that = this;
    var url = app.api.ShowItemBookingQuery;
    app.util.postDataList.call(that, url, params, 'POST', cb, function (res) {
      wx.hideNavigationBarLoading()
    });
  },
  clearQueryName () {
    this.data.searchForm.QueryName=''
    this.data.searchForm.SpecifyShowItemId = ''
    this.data.searchForm.SpecifyTroupeId = ''
    this.data.searchForm.PageIndex = 1
    this.setData({
      searchForm: this.data.searchForm
    })
    this.search()
  }
})