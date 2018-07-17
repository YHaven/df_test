var WxParse = require('../../component/wxParse/wxParse.js');
const app = getApp()

var calendarTouchOpt = {
  touchDot: 0, //触摸时的原点
  time: 0, //  时间记录，用于滑动时且时间小于1s则执行左右滑动
  interval: '', // 记录/清理 时间记录
  arrow: '', //方向
  tmpFlag: true // 判断左右华东超出菜单最大值时不再执行滑动事件
}

// var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enterFromSrc: '', // 记录跳转剧目详情的来源信息(6-2-7;6-2-4;剧目)
    errorMsg: false,
    netTimeOut: false,
    PhotoBoxShow: false,
    toOrderShow: false,
    orderIsLoading:false,
    defaultImg: app.config.defaultImg,
    itemId: '',
    entityID: '',
    operaInfo: {},
    ifCanBookingOffice: true, // 是否可分成
    infoArrowIsUp: false, // 剧目简介
    requestArrowIsUp: false, // 巡演要求
    operaListNumber: 0,
    ScheduleDate: new Date(),
    selectScheduleData: {}, //选中日期数据
    fomatScheduleData: {},
    totalOrderPrice: 0,
    totalOperaPrice: 0,
    totalOrderPriceStr: '0.00',
    totalOperaPriceStr: '0.00',
    checkScheduleListMessage: '',
    checkScheduleListStatus: false,
    scheduleList: [
    {
      OrderPriceStr: '0.00', // 订金
      OperaPriceStr: '0.00', // 演出价
      OrderPrice: 0, // 订金
      OperaPrice: 0, // 演出价
      ShowItemM: 0,
      innerTime: [], //输入框时间
      innerTimeStart: '',
      innerTimeEnd: '',
      startTime: '', // 开始时间
      endTime: '' // 结束时间
    },
    {
      OrderPriceStr: '0.00', // 订金
      OperaPriceStr: '0.00', // 演出价
      OrderPrice: 0, // 订金
      OperaPrice: 0, // 演出价
      ShowItemM: 0,
      innerTime: [], //输入框时间
      innerTimeStart: '',
      innerTimeEnd: '',
      startTime: '', // 开始时间
      endTime: '' // 结束时间
    }
    ], // 档期选择演出时间
    currentScheduleDataItemTemp: {
      se: '--', //所属发布时间
      OperaPriceStr: '--', // 单场报价
      OrderPriceStr: '--', // 预约保证金单价
      OperaPrice: 0, // 单场报价
      OrderPrice: 0, // 预约保证金单价
      PreDay: '--', // 预约提前天数要求
      ShowMinutes: '--', // 单场时间
      MinOrder: '--', // 预约场次最小额
      NoOrderTime: [],
      CountryName: '',
      CityName: '',
      OrderStatus: 0 //0.可预约;1.部分可约;2.约满['全部占用', '部分占用', '未被占用']
    },
    currentScheduleDataItem: {
      se: '--', //所属发布时间
      OperaPriceStr: '--', // 单场报价
      OrderPriceStr: '--', // 预约保证金单价
      OperaPrice: 0, // 单场报价
      OrderPrice: 0, // 预约保证金单价
      PreDay: '--', // 预约提前天数要求
      ShowMinutes: '--', // 单场时间
      MinOrder: '--', // 预约场次最小额
      NoOrderTime: [],
      CountryName: '',
      CityName: '',
      OrderStatus: 0 //0.可预约;1.部分可约;2.约满['全部占用', '部分占用', '未被占用']
    },
    calendarOptions: {
      year: new Date().getFullYear(), // 年份
      month: new Date().getMonth() + 1, // 月份
      day: new Date().getDate(), // 日期
      header: true, // 日历标题
      lunar: false, // 显示农历
      more: true, // 显示非当前月日期                
      week_title: true, // 显示周标题
      next: true, // 显示下个月
      prev: true, // 显示上个月
      cs: 30, // 单元格大小
      title_type: 'cn', // 周标题类型
      titleType: ['英文单字母', '英语简写', '中文简写'],
      title_index: 0,
      style: [{
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
        background: '#f94551'
      }],
      activeType: 'rounded', // 日期背景效果
    },
    schedDTPickerHelp: { // 档期时间设置器显示帮助助手（打开时间选择器时自动调整时间到对应区域）
      start: undefined, // 剧组到达时间
      end: undefined, // 剧组离开时间
      showList: [{
        start: undefined, // 单场演出开始时间
        end: undefined, // 单场演出结束时间
      }],
    },
    userData: {},
    employeeInfo: {},
    entityInfo: {},
    swiperOptions: {
      indicatorDots: true,
      indicatorActiveColor: 'rgba(249, 69, 81, .9)',
      indicatorColor: 'rgba(255, 255, 255, 0.5)',
      autoplay: false,
      interval: 5000,
      duration: 1000
    },
    swiperOptionsActor: {
      indicatorDots: false,
      indicatorActiveColor: 'rgba(249, 69, 81, .9)',
      indicatorColor: 'rgba(255, 255, 255, 0.5)',
      autoplay: false,
      displayMultipleItems: 4, // 同时显示滑块数量  少于这个数量需要特殊处理 少于不能用这个额
      interval: 5000,
      duration: 1000
    },
    photoSwiperOptions: {
      indicatorDots: false,
      indicatorActiveColor: 'rgba(249, 69, 81, .9)',
      indicatorColor: 'rgba(255, 255, 255, 0.5)',
      autoplay: false,
      interval: 3000,
      duration: 500,
      photoArr: []
    },
    // 顶部图集和视频
    swiperVideo: null,
    swiperPhoto: null,
    swiperArr: [],
    // swiperArr: [{
    //   src: '../../images/opera-video.jpg',
    //   id: 'image'
    // }, {
    //   src: 'http://res.52drama.com//appdata/picture/201805/14/J/2ca88826-aaa3-4aa7-8a78-04595bb3c5a7.mp4',
    //   id: 'video'
    // }],
    // 演职人员
    actorList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (options.id) {
      that.setData({
        itemId: options.id
      })
    }
    if (options.entityID) {
      that.setData({
        entityID: options.entityID
      })
    }
    // 获取用户信息
    that.getUserinfo()
    // 获取剧团剧院信息
    that.getTheaterBaseInfoByUserId()

    // 加载剧目 剧目价格
    this.loadOperaBaseInfo()
    // 全部剧目
    this.loadOperaAll()
    // 加载图集和视频
    this.loadImgGroup()
    this.loadGalleryVideo()
    // 加载档期
    this.loadSchedule()
    // 加载巡演要求
    this.loadRoadShow()
    // 加载颜值人员
    this.loadActor()
    // 获取来源入口
    this.enterFrom(options)
  
    this.updateSchedDateTimePickerHelp()

  },
  getUserinfo: function() {
    // console.log(app.globalData)
    if (app.globalData.iyanyiUser) {
      let entityInfo = app.globalData.entityInfo
      entityInfo.entityLogo = entityInfo.entityLogo ? app.config.resourceHost + entityInfo.entityLogo : entityInfo.entityLogo
      this.setData({
        userInfo: app.globalData.userInfo,
        iyanyiUser: app.globalData.iyanyiUser,
        entityInfo: entityInfo,
        employeeInfo: app.globalData.employeeInfo,
        organInfo: app.globalData.organInfo,
        hasUserInfo: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  // 获取来源入口
  enterFrom: function (options) {
    console.log(this.data.entityInfo)
    let entityType = this.data.entityInfo.entityType
    if (entityType === 1) {
      this.setData({
        enterTypeLookOpera: 'juyuan'
      })
    }
    if (entityType === 2) {
      this.setData({
        enterTypeLookOpera: 'jutuan'
      })
    }
  },
  loadSchedule: function() {
    // 首次加载先获取最近一天
    let that = this
    let url = app.api.TroupeItemScheduleInfoSearchByOrderForRecentMonth
    let params = {
      ScheduleDayQueryType: 0,
      ShowItemID: that.data.itemId,
    }
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        // 成功
        let HaveItemData = null
        res.data.forEach(d => {
          if (!HaveItemData && d.HaveTroupeItemTradeItemData) {
            HaveItemData = d
          }
        })
        if (HaveItemData) {
          let laTime = HaveItemData.DayKey.replace(/-/g, '/') + ' 00:00:00'
          let ScheduleDate = new Date(laTime)

          console.log(laTime)
          that.setData({
            ScheduleDate: ScheduleDate
          })
        }

        that.searchScheduleData()
        wx.hideNavigationBarLoading()
      },
      function(res) {
        // 失败
        wx.showToast({
          title: res.message,
          icon: 'none',
          image: app.config.defaultImg.iconCry,
          duration: 1500
        })
        app.util.setPrePageData({
          isRefresh: true
        })
        wx.navigateBack({
          delta: 1
        })
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 搜索那月档期
  searchScheduleData: function() {
    let that = this
    let ScheduleDate = that.data.ScheduleDate
    // console.log(ScheduleDate)
    let year = ScheduleDate.getFullYear()
    let month = ScheduleDate.getMonth()
    let day = ScheduleDate.getDate()
    let QueryBegin = app.util.formatDate(
      new Date(year, month, 1),
      'yyyy-MM-dd 00:00:00'
    ) // 本月起始时间
    let QueryEnd = app.util.formatDate(
      new Date(year, month + 1, 0),
      'yyyy-MM-dd 23:59:59'
    ) // 本月结束时间
    let url = app.api.TroupeItemScheduleInfoSearchByOrder
    let params = {
      QueryBegin: QueryBegin,
      QueryEnd: QueryEnd,
      ScheduleDayQueryType: 0,
      ShowItemID: that.data.itemId,
    }
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        // 格式化需要的数据
        let HaveItemData = null
        res.data.forEach(d => {
          if (!HaveItemData && d.HaveTroupeItemTradeItemData) {
            HaveItemData = d
          }
        })
        if (HaveItemData) {
          let laTime = HaveItemData.DayKey.replace(/-/g, '/') + ' 00:00:00'
          ScheduleDate = new Date(laTime)
          that.setData({
            ScheduleDate: ScheduleDate
          })
        }

        that.searchScheduleDataDeal(res.data)
        that.getCurrentScheduleData(year, month + 1, ScheduleDate.getDate())
        wx.hideNavigationBarLoading()
      },
      function(res) {
        // 失败
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 那月档期数据处理
  searchScheduleDataDeal: function(res) {
    let that = this
    if (res && res instanceof Array) {
      let fomatScheduleData = {}
      res.forEach(s => {
        let CityName = ''
        let CountryName = ''
        if (s.HaveTroupeItemTradeItemData) {
          // 根据TroupeItemScheduleTimeInfoList时间再判断是否约满
          // 查询地址
          if (s.TroupeItemScheduleTimeInfoList[0].CityCode && CityName === '') {
            let CityObj = app.AreaInfoUtil.AreaInfoUtil.GetCityInCityCode(s.TroupeItemScheduleTimeInfoList[0].CityCode)
            // let CityObj = AreaInfoUtil.GetCityInCityCode(330100)
            if (CityObj) {
              CityName = CityObj.CityCnName
              CountryName = CityObj.ProvinceCnName
            }
          }
          let NoOrderTime = []
          if (s.TroupeItemScheduleTimeInfoList.length > 0) {
            s.TroupeItemScheduleTimeInfoList.forEach(t => {
              let NoOrderTimeObj = {}
              if (t.ScheduleTimeType !== 4) {
                NoOrderTimeObj.startTime = app.util.formatDate(new Date(t.ScheduleBeginDatetime.replace(/-/g, '/')), 'hh:mm')
                NoOrderTimeObj.endTime = app.util.formatDate(new Date(t.ScheduleEndDatetime.replace(/-/g, '/')), 'hh:mm')
                NoOrderTime.push(NoOrderTimeObj)
              }
            })
          }
          let orderStatus = 0
          let restCount = s.TroupeItemScheduleTimeInfoList.filter(e => e.ScheduleTimeType === 4).length
          if (restCount === s.TroupeItemScheduleTimeInfoList.length) {
            orderStatus = 2
          } else if (restCount === 0) {
            orderStatus = 0
          } else if (restCount < s.TroupeItemScheduleTimeInfoList.length) {
            orderStatus = 1
          }
          fomatScheduleData[s.DayKey + ' 00:00:00'] = {
            se: (app.util.formatDate(new Date(s.DefaultTroupeItemTradeItem.PublishBeginTime.replace(/-/g, '/')), 'yyyy.MM.dd') + '~' + app.util.formatDate(new Date(s.DefaultTroupeItemTradeItem.PublishEndTime.replace(/-/g, '/')), 'yyyy.MM.dd')),
            OperaPrice: s.DefaultTroupeItemTradeItem.ShowItemPrice, // 单场报价
            OrderPrice: s.DefaultTroupeItemTradeItem.ShowItemEpositPrice, // 预约保证金单价
            PreDay: s.DefaultTroupeItemTradeItem.AppyPreDays, // 预约提前天数要求
            ShowMinutes: s.DefaultTroupeItemTradeItem.ShowItemM, // 单场时间
            MinOrder: s.DefaultTroupeItemTradeItem.ShowItemLimitedMin, // 预约场次最小额
            NoOrderTime: NoOrderTime,
            CountryName: CountryName,
            CityName: CityName,
            OrderStatus: orderStatus //0.可预约;1.部分可约;2.约满['全部占用', '部分占用', '未被占用']
          }
        }
      })
      // console.log(fomatScheduleData)
      that.setData({
        fomatScheduleData: fomatScheduleData,
        scheduleDataAll: res
      })
    } else {
      that.setData({
        fomatScheduleData: {},
        scheduleDataAll: []
      })
    }
  },
  // 添加档期
  addSchedule() {
    let that = this
    let nodeData = that.data.selectScheduleData
    let scheduleList = that.data.scheduleList
    if (nodeData.HaveTroupeItemTradeItemData) {
      let OrderPriceStr = app.util.toThousands(nodeData.DefaultTroupeItemTradeItem.ShowItemEpositPrice.toFixed(2))
      let OperaPriceStr = app.util.toThousands(nodeData.DefaultTroupeItemTradeItem.ShowItemPrice.toFixed(2))
      scheduleList.push({
        OrderPriceStr: OrderPriceStr,
        OperaPriceStr: OperaPriceStr,
        OrderPrice: nodeData.DefaultTroupeItemTradeItem.ShowItemEpositPrice, // 订金
        OperaPrice: nodeData.DefaultTroupeItemTradeItem.ShowItemPrice, // 演出价
        ShowItemM: nodeData.DefaultTroupeItemTradeItem.ShowItemM,
        innerTime: [], //输入框时间
        innerTimeStart: '',
        innerTimeEnd: '',
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      })
      // that.checkScheduleList()
      that.setData({
        scheduleList: scheduleList
      })
      that.getTotalPrice()

      this.updateSchedDateTimePickerHelp(that.data.selectScheduleData.DayKey)
    }
  },
  // 删除档期
  removeSchedule: function(e) {
    var data = e.currentTarget.dataset;
    var index = data.index
    let that = this
    let scheduleList = that.data.scheduleList
    if (scheduleList.length <= 1) return
    scheduleList.splice(index, 1)
    that.setData({
      scheduleList: scheduleList
    })
    that.getTotalPrice()
    // that.checkScheduleList()

    this.updateSchedDateTimePickerHelp(that.data.selectScheduleData.DayKey)
  },
  inputStartTime: function(e) {
    let startTime = e.detail.value
    let innerTimeStart = startTime
    if (typeof startTime === 'object') {
      innerTimeStart = app.util.formatDate(startTime, 'yyyy-MM-dd hh:mm')
    }
    this.setData({
      innerTimeStart: innerTimeStart,
      innerTimeStartFormat: innerTimeStart.replace(/-/g, '.')
    })
  },
  inputEndTime: function(e) {
    let endTime = e.detail.value
    let innerTimeEnd = endTime

    if (typeof endTime === 'object') {
      innerTimeEnd = app.util.formatDate(endTime, 'yyyy-MM-dd hh:mm')
    }
    this.setData({
      innerTimeEnd: innerTimeEnd,
      innerTimeEndFormat: innerTimeEnd.replace(/-/g, '.')
    })
  },
  inputListStartTime: function(e) {
    let listStartTime = e.detail.value
    let index = e.target.dataset.index
    let scheduleList = this.data.scheduleList
    let innerStartTime = listStartTime
    let thisStartTime = 0 // 演出开始时间戳
    if (typeof listStartTime === 'object') {
      innerStartTime = app.util.formatDate(listStartTime, 'yyyy-MM-dd hh:mm')
      thisStartTime = listStartTime.getTime()
    }
    scheduleList[index].innerTimeStart = innerStartTime
    scheduleList[index].innerTimeStartFormat = innerStartTime.replace(/-/g, '.')
    // 结束时间

    let autoInnerTimeEnd = new Date(scheduleList[index].ShowItemM * 60 * 1000 + thisStartTime)
    scheduleList[index].innerTimeEnd = app.util.formatDate(autoInnerTimeEnd, 'yyyy-MM-dd hh:mm')
    scheduleList[index].innerTimeEndFormat = app.util.formatDate(autoInnerTimeEnd, 'yyyy.MM.dd hh:mm')
    this.setData({
      scheduleList: scheduleList
    })
  },
  // 显示那月档期
  showSelectSchedule: function(num) {
    let res = this.data.scheduleDataAll
    // console.log(num)
    if (typeof num === 'number') {
      if (res.length < num) { //不存在跳出、
        return
      }
      let nodeData = res[num]
      this.setData({
        selectScheduleData: nodeData
      })
      let startTime = new Date()
      let endTime = new Date()
      if (nodeData.HaveTroupeItemTradeItemData) { //false跳出
        let AppyPreDaysTemp = Number(nodeData.DefaultTroupeItemTradeItem.AppyPreDays || 0) * 24 * 60 * 60 * 1000
        startTime = new Date(new Date(nodeData.DefaultTroupeItemTradeItem.PublishBeginTime.replace(/-/g, '/')).getTime())
        endTime = new Date(new Date(nodeData.DefaultTroupeItemTradeItem.PublishEndTime.replace(/-/g, '/')).getTime())
        if (startTime.getTime() < new Date().getTime()) {
          startTime = new Date(new Date().getTime() + AppyPreDaysTemp)
        }
        this.setData({
          noSelectSchedule: false
        })
      }
      this.setData({
        innerTime: [startTime, endTime],
        startTime: app.util.formatDate(startTime, 'yyyy-MM-dd hh:mm:ss'),
        endTime: app.util.formatDate(endTime, 'yyyy-MM-dd hh:mm:ss')
      })
      // this.pickerSelectDateLimit = {
      //   disabledDate(time) {
      //     let formatStartTime = new Date(util.formatDate.format(startTime, 'yyyy/MM/dd 00:00:00'))
      //     let formatEndTime = new Date(util.formatDate.format(endTime, 'yyyy/MM/dd 23:59:59'))
      //     return (time.getTime() < formatStartTime.getTime()) || (time.getTime() > formatEndTime.getTime());
      //   }
      // }
      let scheduleList = [] // 档期选择演出时间
      let OrderPrice = nodeData.HaveTroupeItemTradeItemData ? nodeData.DefaultTroupeItemTradeItem.ShowItemEpositPrice : 0
      let OperaPrice = nodeData.HaveTroupeItemTradeItemData ? nodeData.DefaultTroupeItemTradeItem.ShowItemPrice : 0
      let OrderPriceStr = '0.00'
      let OperaPriceStr = '0.00'
      if (OrderPrice > 0) OrderPriceStr = app.util.toThousands(OrderPrice.toFixed(2))
      if (OperaPrice > 0) OperaPriceStr = app.util.toThousands(OperaPrice.toFixed(2))
      scheduleList.push({
        OrderPriceStr: OrderPriceStr,
        OperaPriceStr: OperaPriceStr,
        OrderPrice: OrderPrice, // 订金
        OperaPrice: OperaPrice, // 演出价
        ShowItemM: nodeData.HaveTroupeItemTradeItemData ? nodeData.DefaultTroupeItemTradeItem.ShowItemM : this.data.operaInfo.ShowMinutes,
        innerTime: [], //输入框时间
        innerTimeStart: '',
        innerTimeEnd: '',
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      })
      this.setData({
        scheduleList: scheduleList
      })
      this.getTotalPrice()
    }
  },
  // 总预约金，总演出价
  getTotalPrice: function() {
    let scheduleList = this.data.scheduleList
    let OrderPrice = 0;
    let OperaPrice = 0;
    scheduleList.forEach(function(value) {
      OrderPrice += value.OrderPrice
      OperaPrice += value.OperaPrice
    })
    this.setData({
      totalOrderPrice: OrderPrice,
      totalOperaPrice: OperaPrice,
      totalOrderPriceStr: app.util.toThousands(OrderPrice.toFixed(2)),
      totalOperaPriceStr: app.util.toThousands(OperaPrice.toFixed(2)),
    })
  },
  // 检查档期时间是否符合要求
  checkScheduleList() {
    let that = this
    let scheduleList = this.data.scheduleList
    let status = true
    let msg = ''
    let preEndTime = 0
    // if (that.innerTime.length > 0) {
    //   that.startTime = util.formatDate.format(that.innerTime[0],'yyyy-MM-dd hh:mm:ss')
    //   that.endTime = util.formatDate.format(that.innerTime[1],'yyyy-MM-dd hh:mm:ss')
    // }
    let innerTimeStartTimes = 0 // 计划到达时间
    let innerTimeEndTimes = 0 // 计划离开时间
    if (that.data.innerTimeStart) {
      // 计划到达时间字符串
      that.setData({
        startTime: that.data.innerTimeStart + ':00'
      })
      // 计划到达时间戳
      innerTimeStartTimes = new Date((that.data.innerTimeStart + ':00').replace(/-/g, '/')).getTime()
      // 用来判断演出时间的上一个结束时间
      preEndTime = innerTimeStartTimes
    }
    if (that.data.innerTimeEnd) {
      // 计划离开时间字符串
      that.setData({
        endTime: that.data.innerTimeEnd + ':00'
      })
      // 计划离开时间戳
      innerTimeEndTimes = new Date((that.data.innerTimeEnd + ':00').replace(/-/g, '/')).getTime()
    }
    let defaultTradeItem = that.data.selectScheduleData.DefaultTroupeItemTradeItem
    if (defaultTradeItem) {
      // 可约
      // 拆装台时间未选择时统一报错
      if (status && (innerTimeStartTimes === 0 || innerTimeEndTimes === 0)) {
        status = false
        msg = '先选择计划到离时间'
      }
      if (status && innerTimeStartTimes >= innerTimeEndTimes) {
        status = false
        that.innerTimeEnd = ''
        msg = '剧组离开时间必须大于到达时间'
      }
      // 判断剧组计划到达离开时间是否正确，每场几分钟，最少几场，算出最小时间跨度
      let ItemShowMinutes = defaultTradeItem.ShowItemM
      let ItemLimitedMin = defaultTradeItem.ShowItemLimitedMin
      let selectAllMinutes = (innerTimeEndTimes - innerTimeStartTimes) / 1000 / 60
      if (status && ItemShowMinutes * ItemLimitedMin >= selectAllMinutes) {
        status = false
        that.innerTimeEnd = ''
        msg = '剧组计划到达离开时间必须大于(剧目最小场次*单场演出时间)'
      }
    } else {
      status = false
      that.innerTimeEnd = ''
      msg = '所选时间不可预约'
    }
    // if(msg !== ''){
    //   util.iyanyiToastTip('ico-error', '', 'light', '#fe6347 ', msg, '#fff', 'topCenter', 3000, 'flipInX', 'flipOutX')
    // }
    if (status) {
      scheduleList.forEach(s => {
        let thisStartTime = 0
        let thisEndTime = 0
        let endTime = 0
        if (s.innerTimeStart) {
          // 演出开始时间戳
          thisStartTime = new Date((s.innerTimeStart + ':00').replace(/-/g, '/')).getTime()
          // 演出开始时间字符串
          // s.startTime = api.util.formatDate(s.innerTimeStart, 'yyyy-MM-dd hh:mm:ss')
          // let autoInnerTimeEnd = new Date(s.ShowItemM * 60 * 1000 + thisStartTime)
          // s.innerTimeEnd = autoInnerTimeEnd
          s.startTime = s.innerTimeStart + ':00'
        }
        if (s.innerTimeEnd) {
          // 演出结束时间戳
          thisEndTime = new Date((s.innerTimeEnd + ':00').replace(/-/g, '/')).getTime()
          // 演出结束时间字符串
          // s.endTime = api.util.formatDate(s.innerTimeEnd, 'yyyy-MM-dd hh:mm:ss')
          s.endTime = s.innerTimeEnd + ':00'
        }
        if (that.data.innerTimeEnd) endTime = new Date((that.data.innerTimeEnd + ':00').replace(/-/g, '/')).getTime()

        // 先判断选好没
        if (status && (thisStartTime === 0 || thisEndTime === 0)) {
          status = false
          msg = '请选择演出时间!'
        }
        // 先判断整体范围 到达时间 与 离开时间 不允许等于
        if (status && (thisStartTime <= innerTimeStartTimes || thisEndTime >= endTime)) {
          status = false
          msg = '演出时间段必须在剧组计划到达离开时间范围内！'
        }
        // 判断选择的演出开始结束时间本身是否对 不允许等于
        if (status && (thisEndTime <= thisStartTime)) {
          status = false
          msg = '演出结束时间必须大于演出开始时间！'
        }
        // 判断这场演出是否晚于上一场演出结束时间 不允许等于
        if (status && (thisStartTime <= preEndTime)) {
          status = false
          // msg = '演出开始时间必须早于（单场时长+剧组离开时间）！'
          msg = '开始时间必须晚于上一场演出结束时间！'
        } else {
          preEndTime = thisEndTime
        }

        let ShowItemMin = (thisEndTime - thisStartTime) / 60000
        if (status && (thisEndTime > thisStartTime && ShowItemMin < s.ShowItemM)) {
          status = false
          msg = '演出时间段时长必须大于剧目单场时长！'
        }
      })
      if (status && scheduleList.length < defaultTradeItem.ShowItemLimitedMin) {
        status = false
        msg = '演出场次需要大于该剧目最小演出场次！'
      }
    }
    // console.log('status:' + status + '----:' + msg)
    that.setData({
      checkScheduleListMessage: msg,
      checkScheduleListStatus: status
    })

  },
  // 剧目基本信息
  loadOperaBaseInfo: function() {
    let that = this
    var url = app.api.TroupeInfoMiddleTroupeItemBaseInfo
    var params = {
      entityID: that.data.entityID,
      itemId: that.data.itemId,
      priced: true
    }
    // return false
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'GET',
      function(res) { // 成功
        if (res.statusCode === 200) {
          let newOperaInfo = res.data.ItemBaseInfoData
          // 显示处理
          let ShowTypeArr = []
          newOperaInfo.ShowType.forEach(res => {
            ShowTypeArr.push(res.Name)
          })
          newOperaInfo.ShowTypeStr = ShowTypeArr.join('/')
          newOperaInfo.FirstShowDateStr = newOperaInfo.FirstShowDate ? newOperaInfo.FirstShowDate.split(' ')[0].replace(/-/g, '.') : '暂无'
          let EpositPriceStr = '--'
          let PriceStr = '--'
          if (newOperaInfo.ItemPrice) {
            if (newOperaInfo.ItemPrice.EpositPrice) {
              EpositPriceStr = app.util.toThousands(newOperaInfo.ItemPrice.EpositPrice.toFixed(2))
            }
          }
          if (newOperaInfo.ItemPrice) {
            if (newOperaInfo.ItemPrice.Price) {
              PriceStr = app.util.toThousands(newOperaInfo.ItemPrice.Price.toFixed(2))
            }
          }
          newOperaInfo.EpositPriceStr = EpositPriceStr
          newOperaInfo.PriceStr = PriceStr
          newOperaInfo.IntroductionStr = (newOperaInfo.Introduction || '').replace(/<\/?.+?>/g, '')
          if (newOperaInfo.IntroductionStr == '') {
            newOperaInfo.IntroductionStr = '暂无数据'
          }
          WxParse.wxParse('Introduction', 'html', newOperaInfo.Introduction, that, 0);
          that.setData({
            operaInfo: newOperaInfo
          })
        }
        wx.hideNavigationBarLoading()
      },
      function(res) { // 失败
        wx.showToast({
          title: res.message,
          icon: 'none',
          image: app.config.defaultImg.iconCry,
          duration: 1500
        })
        app.util.setPrePageData({
          isRefresh:true
        })
        wx.navigateBack({
          delta: 1
        })
        wx.hideNavigationBarLoading()
      })

  },
  // 加载图集
  loadImgGroup: function() {
    let that = this
    var url = app.api.getOperaGalleryBeforeUpdate
    var params = {
      showItemID: that.data.itemId
    }
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'GET',
      function(res) { // 成功
        let GalleryUpdates = res.data
        let swiperArr = that.data.swiperArr
        let photoArr = []
        GalleryUpdates.forEach(r => {
          let photo = {
            src: app.config.resourceHost + r.UrlPreview,
            title: r.GalleryName,
            info: r.GalleryMemo,
          }
          photoArr.push(photo)
        })
        let photoSwiperOptions = that.data.photoSwiperOptions
        photoSwiperOptions.photoArr = photoArr
        if (photoArr.length > 0) {
          that.data.swiperPhoto = {
            src: photoArr[0].src,
            id: 'image'
          }
        } else {
          that.data.swiperPhoto = null
        }
        that.dealSwiperArr() // 重新排列灯箱  
        that.setData({
          GalleryUpdates: GalleryUpdates,
          photoSwiperOptions: photoSwiperOptions,
          swiperArr: swiperArr
        })
        // console.log(photoArr)
        wx.hideNavigationBarLoading()
      },
      function(res) { // 失败
        wx.hideNavigationBarLoading()
      })
  },
  // 视频
  loadGalleryVideo: function() {
    let that = this
    var url = app.api.getOperaGalleryBasic
    var params = {
      showItemID: that.data.itemId
    }
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'GET',
      function(res) { // 成功
        if (res.data.ADVideoUrl && res.data.ADVideoUrl !== '') {
          if (res.data.ADVideoUrl.startsWith('http://') || res.data.ADVideoUrl.startsWith('https://')) {
            // let processArgs = 'video/snapshot,t_0,w_750,h_288,f_jpg,m_fast'
            let processArgs = '?x-oss-process=video/snapshot,t_0,w_0,h_0,f_jpg,m_fast' // 根据视频源自动确定宽度和高度
            that.data.swiperVideo = {
              src: res.data.ADVideoUrl,
              id: 'video',
              previewSrc: res.data.ADVideoUrl + processArgs,
              ispasuse: true
            }
          } else {
            let adUrl = app.config.resourceHost + res.data.ADVideoUrl
            let preAdUrl = adUrl.slice(0, adUrl.lastIndexOf('.')) + '_Preview.jpg'
            that.data.swiperVideo = {
              src: adUrl,
              id: 'video',
              previewSrc: preAdUrl,
              ispasuse: true
            }
          }
        } else {
          that.data.swiperVideo = null
        }
        that.dealSwiperArr() // 重新排列灯箱
        let swiperArr = that.data.swiperArr
        that.setData({
          swiperArr: swiperArr
        })
        that.setData({
          troupeImgSimple: res.data
        })
        wx.hideNavigationBarLoading()
      },
      function(res) { // 失败
        wx.hideNavigationBarLoading()
      })
  },
  dealSwiperArr: function() {
    this.data.swiperArr = []
    // 先视频
    if (this.data.swiperVideo) {
      this.data.swiperArr.push(this.data.swiperVideo)
    }
    // 再图片
    if (this.data.swiperPhoto) {
      this.data.swiperArr.push(this.data.swiperPhoto)
    }
  },
  // 顶部灯箱图片加载错误
  errorGImg: function(e) {
    var _errImg = e.target.dataset.errorsrc
    var _objImg = "'" + _errImg + "'"
    var _errObj = {}
    _errObj[_errImg] = '../../images/operaGError750X288.jpg'
    // console.log(e.detail.errMsg + "----" + _errObj[_errImg] + "----" + _objImg)
    this.setData(_errObj)
  },
  // 点击视频的预览图，播放视频
  playGVideo: function() {
    if (this.data.swiperArr.length > 0 && this.data.swiperArr[0].id === 'video') {
      let videoContext = wx.createVideoContext('myVideo')
      if (videoContext){
        setTimeout(function(){
          videoContext.play()
        },50)
        this.data.swiperArr[0].ispasuse = false
      }
      this.data.swiperArr[0].isplay = true
      this.setData({
        swiperArr: this.data.swiperArr
      })
    }
  },
  // 视频暂停
  videoPasuse:function(){
    // console.log('222211')
    if (this.data.swiperArr.length > 0 && this.data.swiperArr[0].id === 'video') {
      this.data.swiperArr[0].isplay = false
      // console.log('2222')
      this.data.swiperArr[0].ispasuse = true
      this.setData({
        swiperArr: this.data.swiperArr
      })
    }
  },
  videoCatch:function(e){
    console.log('catch')
  },
  videoBind: function (e) {
    console.log('bind')
  },
  changeTopSwiper: function (e) {
    // console.log('11111')
    this.videoPasuse()
  },
  // 加载所有剧目
  loadOperaAll: function() {
    let that = this
    var url = app.api.getOperaList
    var params = {
      entityId: that.data.entityID
    }
    app.util.postData.call(that, url, params, 'GET',
      function(res) { // 成功
        if (res.statusCode === 200) {
          that.setData({
            operaListNumber: res.data.length
          })
        }
        wx.hideNavigationBarLoading()
      },
      function(res) { // 失败
        wx.hideNavigationBarLoading()
      })
  },
  // 加载巡演要求
  loadRoadShow: function() {
    let that = this
    var url = app.api.getOperaTourRequirements
    var params = {
      itemId: that.data.itemId
    }
    app.util.postData.call(that, url, params, 'GET',
      function(res) { // 成功
        if (res.statusCode === 200) {
          let roadShowIntro = {}
          if (res.data.length > 0) {
            roadShowIntro = res.data[0]
            roadShowIntro.FoodStr = (roadShowIntro.Food || '').replace(/<\/?.+?>/g, '')
            roadShowIntro.HotelStr = (roadShowIntro.Hotel || '').replace(/<\/?.+?>/g, '')
            roadShowIntro.OtherStr = (roadShowIntro.Other || '').replace(/<\/?.+?>/g, '')
            roadShowIntro.StageStr = (roadShowIntro.Stage || '').replace(/<\/?.+?>/g, '')
            roadShowIntro.TrafficStr = (roadShowIntro.Traffic || '').replace(/<\/?.+?>/g, '')
            if (roadShowIntro.FoodStr == '') roadShowIntro.FoodStr = '暂无数据'
            if (roadShowIntro.HotelStr == '') roadShowIntro.HotelStr = '暂无数据'
            if (roadShowIntro.OtherStr == '') roadShowIntro.OtherStr = '暂无数据'
            if (roadShowIntro.StageStr == '') roadShowIntro.StageStr = '暂无数据'
            if (roadShowIntro.TrafficStr == '') roadShowIntro.TrafficStr = '暂无数据'
          }
          that.setData({
            roadShowIntro: roadShowIntro
          })
          WxParse.wxParse('Hotel', 'html', roadShowIntro.Hotel, that, 0);
          WxParse.wxParse('Food', 'html', roadShowIntro.Food, that, 0);
          WxParse.wxParse('Stage', 'html', roadShowIntro.Stage, that, 0);
          WxParse.wxParse('Traffic', 'html', roadShowIntro.Traffic, that, 0);
          WxParse.wxParse('Traffic', 'html', roadShowIntro.Traffic, that, 0);
        }
        wx.hideNavigationBarLoading()
      },
      function(res) { // 失败
        wx.hideNavigationBarLoading()
      })
  },
  loadActor: function() {
    let that = this
    var url = app.api.getOperaActorInfoAll
    let params = {
      EntityId: that.data.entityID,
      ItemID: that.data.itemId,
      Name: '',
      pageIndex: 1,
      PageSize: 20
    }
    app.util.postData.call(that, url, params, 'GET',
      function(res) { // 成功
        if (res.statusCode === 200) {
          let actorList = res.data.DataRows
          if (actorList.length > 0) {
            actorList.forEach(a => {
              if (a.Avatar) {
                a.AvatarUrl = app.config.resourceHost + a.Avatar
              } else {
                a.AvatarUrl = app.config.defaultImg.actorDefault
              }
              let ActorOccupationsArr = []
              a.ActorOccupations.forEach(o => {
                ActorOccupationsArr.push(o.OccupationName)
              })
              a.ActorOccupationsStr = ActorOccupationsArr.join('/')
            })
          }
          // 为保证少于4个时能正常显示，需要增加空对象占位
          while (actorList.length > 0 && actorList.length < 4) {
            actorList.push({})
          }
          that.setData({
            actorList: actorList
          })
        }
        wx.hideNavigationBarLoading()
      },
      function(res) { // 失败
        wx.hideNavigationBarLoading()
      })
  },
  // 刷新
  refresh: function() {
    this.onLoad()
  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function(e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  // 微信自带展示图片
  previewImgs: function() {
    wx.previewImage({
      current: 'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png', // 当前显示图片的http链接
      urls: ['http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png', 'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png', 'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png'] // 需要预览的图片http链接列表
    })
  },
  // 自定义展示图片
  showPhotoBox: function() {
    this.setData({
      PhotoBoxShow: true
    })
  },
  // 立即预约
  showOrder: function() {
    let that = this
    if (that.data.currentScheduleDataItem.se === '--') {
      // topMsgTip.show.call(that, '所选时间不可约', 1500)
      that.selectComponent("#topMsgTips").show('所选时间不可约', 1500)
      return false
    }
    this.setData({
      toOrderShow: true
    })
  },
  // 关闭立即预约
  closeShowOrder: function() {
    this.setData({
      toOrderShow: false
    })
  },
  submitOrder: function() {
    let that = this
    if (that.data.orderIsLoading) {
      return false
    }
    that.checkScheduleList()
    if (that.data.checkScheduleListStatus) {
      that.doSubmitOrder()
      // app.util.commonViewTap('/pages/operaOrderCreate/operaOrderCreate')
    } else {
      let msg = that.data.checkScheduleListMessage
      if (msg !== '') {
        // topMsgTip.show.call(that, msg, 1500)
        that.selectComponent("#topMsgTips").show(msg, 1500)
      }

    }

  },
  // 获取剧院剧团信息
  getTheaterBaseInfoByUserId() {
    let that = this
    let th_url = app.api.getTheaterBaseInfo
    let th_params = {
      entityID: that.data.entityInfo.entityID
    }

    wx.showNavigationBarLoading()
    app.util.postData.call(that, th_url, th_params, 'GET',
      function(res) {
        that.setData({
          theatreInfo: res.data.OrganEntiy,
          TheaterBaseInfo: res.data.TheaterBaseInfo
        })
        wx.hideNavigationBarLoading()
      },
      function(res) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 3000
        })
        wx.hideNavigationBarLoading()
      }
    )
    let to_url = app.api.getTroupeBaseInfo
    let to_params = {
      entityID: that.data.entityID
    }
    app.util.postData.call(that, to_url, to_params, 'GET',
      function(res) {
        let TroupeBaseInfo = res.data.TroupeBaseInfo
        TroupeBaseInfo.RatingDescription.RatingValue = TroupeBaseInfo.RatingDescription.RatingValue.toFixed(1)
        TroupeBaseInfo.StoryRating = TroupeBaseInfo.StoryRating.toFixed(1)
        TroupeBaseInfo.PerformanceLevelRating = TroupeBaseInfo.PerformanceLevelRating.toFixed(1)
        TroupeBaseInfo.PropertyRating = TroupeBaseInfo.PropertyRating.toFixed(1)
        TroupeBaseInfo.IntegrityRating = TroupeBaseInfo.IntegrityRating.toFixed(1)
        res.data.OrganEntiy.EntityCoverUrl = app.config.resourceHost + res.data.OrganEntiy.EntityCoverUrl
        res.data.OrganEntiy.EntityLogoUrl = app.config.resourceHost + res.data.OrganEntiy.EntityLogoUrl
        that.setData({
          troupeInfo: res.data.OrganEntiy,
          TroupeBaseInfo: TroupeBaseInfo
        })
        wx.hideNavigationBarLoading()
      },
      function(res) {
        wx.hideNavigationBarLoading()
      }
    )

  },
  doSubmitOrder: function() {
    let that = this
    let ShowItemTradeItemId = that.data.selectScheduleData.DefaultTroupeItemTradeItem.ShowItemTradeItemId //受约单ID
    let employeeInfo = that.data.employeeInfo
    let entityInfo = that.data.entityInfo
    let params = {
      AppointmentName: employeeInfo.employeeName,
      AppointmentPhone: employeeInfo.employeePhoneNumber || that.data.userData.phone,
      TheatreId: that.data.theatreInfo.EntityID,
      TheatreName: that.data.theatreInfo.EntityName,
      TheatreEmployeeId: that.data.employeeInfo.employeeId,
      TheatreEmployee: that.data.employeeInfo.employeeName,

      ShowTroupeId: that.data.troupeInfo.EntityID,
      ShowTroupeName: that.data.troupeInfo.EntityName,
      ShowItemId: that.data.operaInfo.ItemId,
      ShowItemName: that.data.operaInfo.Name,

      ShowTeamArriveTime: that.data.startTime,
      ShowTeamLeaveTime: that.data.endTime,
      Schedules: []
    }
    that.data.scheduleList.forEach(s => {
      params.Schedules.push({
        ShowItemTradeItemId: ShowItemTradeItemId,
        ShowBeginDatetime: s.startTime,
        ShowEndDatetime: s.endTime,
      })
    })
    let url = app.api.addOperaScheduleBooking
    wx.showNavigationBarLoading()
    that.setData({
      orderIsLoading: true
    })
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        let TradeApplyId = res.data.TradeApplyId
        if (TradeApplyId) {
          app.util.commonViewTap('/pages/operaOrderCreate/operaOrderCreate?tradeApplyId=' + TradeApplyId)
        }
        wx.hideNavigationBarLoading()
        that.setData({
          orderIsLoading: false
        })
      },
      function(res) {
        that.setData({
          orderIsLoading: false
        })
        wx.hideNavigationBarLoading()
        /// <response code="525">剧组到达时间晚于离开时间 或 剧组到达时间须完于第一场演出开始时间 或 剧组离开时间须早于第一场演出结束时间</response>
        /// <response code="526">所选剧目档期已不存在</response>
        /// <response code="527">所选剧目档期已被占用</response>
        if (res.statusCode == 526) {
          that.selectComponent("#topMsgTips").show('所选剧目档期已不存在', 1500)
        } else if (res.statusCode == 527) {
          that.selectComponent("#topMsgTips").show('所选剧目档期已被占用', 1500)
        } else if (res.statusCode == 500) {
          that.selectComponent("#topMsgTips").show(res.message, 1500)
        }
      }
    )
  },
  // 日历点击事件
  dayClick: function(event) {
    const year = event.detail.year;
    const month = event.detail.month;
    const day = event.detail.day;
    const color = event.detail.color;
    const lunarMonth = event.detail.lunarMonth;
    const lunarDay = event.detail.lunarDay;
    const background = event.detail.background;

    let ScheduleDate = new Date(app.util.formatDate(new Date(year, month - 1, day), 'yyyy/MM/dd 00:00:00'))
    this.setData({
      ScheduleDate: ScheduleDate
    })
    this.getCurrentScheduleData(year, month, day)
    // wx.showModal({
    //   title: '日期点击事件',
    //   content: '点击的日期为：' + year + '年' + month + '月' + day + '日\n农历：' + lunarMonth + lunarDay
    // });
  },
  /**
   * 点击下个月
   */
  nextMonth: function(event) {
    let year = event.detail.currentYear;
    let month = event.detail.currentMonth;
    let day = event.detail.currentDay;
    this.dateChangeDo(year, month, day)
  },

  /**
   * 点击上个月
   */
  prevMonth: function(event) {
    let year = event.detail.currentYear;
    let month = event.detail.currentMonth;
    let day = event.detail.currentDay;
    this.dateChangeDo(year, month, day)
  },

  /**
   * 日期变更事件
   */
  dateChange: function(event) {
    let year = event.detail.currentYear;
    let month = event.detail.currentMonth;
    let day = event.detail.currentDay;
    this.dateChangeDo(year, month, day)
    console.log(year)
  },
  dateChangeDo: function(year, month, day) {
    let ScheduleDate = new Date(app.util.formatDate(new Date(year, month - 1, day), 'yyyy/MM/dd 00:00:00'))
    this.setData({
      ScheduleDate: ScheduleDate
    })
    this.searchScheduleData()
    this.getCurrentScheduleData(year, month, day)
  },
  // 获取当前日期档期信息
  getCurrentScheduleData: function(year, month, day) {
    let nowDateStr = app.util.formatDate(new Date(year, month - 1, day), 'yyyy-MM-dd 00:00:00')
    let calendarOptions = this.data.calendarOptions
    calendarOptions.year = year // 年份
    calendarOptions.month = month // 月份
    calendarOptions.day = day // 日
    // console.log(nowDateStr)
    let fomatScheduleData = this.data.fomatScheduleData
    if (fomatScheduleData[nowDateStr]) {
      calendarOptions.style = [{
        month: 'current',
        day: day,
        color: 'white',
        background: '#f94551'
      }]
      let currentScheduleDataItem = fomatScheduleData[nowDateStr]
      currentScheduleDataItem.OrderPriceStr = app.util.toThousands(currentScheduleDataItem.OrderPrice.toFixed(2))
      currentScheduleDataItem.OperaPriceStr = app.util.toThousands(currentScheduleDataItem.OperaPrice.toFixed(2))
      this.setData({
        currentScheduleDataItem: currentScheduleDataItem
      })
      this.showSelectSchedule(day - 1)
    } else {
      calendarOptions.style = []
      // this.setData({
      //   currentScheduleDataItem: this.data.currentScheduleDataItemTemp
      // })
    }
    this.setData({
      calendarOptions: calendarOptions
    })
    this.updateSchedDateTimePickerHelp(this.data.selectScheduleData.DayKey)
  },

  updateSchedDateTimePickerHelp: function(dt) { // 更新档期时间选择器的默认显示帮助
    try {
      var thizMoment = new Date()
      var schedDTPickerHelp = this.data.schedDTPickerHelp
      if (dt) {
        var tickedDT = new Date(dt)
        var thizDate = app.util.formatDate(thizMoment, 'yyyy-MM-dd')
        var tickedDate = app.util.formatDate(tickedDT, 'yyyy-MM-dd')
        if (thizDate == tickedDate) {
          dt = app.util.formatDate(thizMoment, 'yyyy-MM-dd hh:mm')
        } else {
          dt = app.util.formatDate(tickedDT, 'yyyy-MM-dd 12:00')
        }

        schedDTPickerHelp.start = dt;
        schedDTPickerHelp.end = dt;

        // 同步演出数量
        if (this.data.scheduleList && this.data.scheduleList.length > schedDTPickerHelp.showList.length) {
          for (var i in this.data.scheduleList) {
            if (!schedDTPickerHelp.showList[i]) {
              schedDTPickerHelp.showList.push({
                start: dt,
                end: dt,
              });
            }
          }
        }

        schedDTPickerHelp.showList[0].start = dt
        schedDTPickerHelp.showList[0].end = dt
        for (var i in schedDTPickerHelp.showList) {
          if (i > 0) {
            if (this.data.scheduleList && this.data.scheduleList[i - 1]) {
              schedDTPickerHelp.showList[i].start = this.data.scheduleList[i - 1].innerTimeEnd
              schedDTPickerHelp.showList[i].end = this.data.scheduleList[i - 1].innerTimeEnd
            } else {
              schedDTPickerHelp.showList[i].start = dt
              schedDTPickerHelp.showList[i].end = dt
            }
          }
        }
      } else {
        schedDTPickerHelp = {
          start: app.util.formatDate(thizMoment, 'yyyy-MM-dd hh:mm'),
          end: app.util.formatDate(thizMoment, 'yyyy-MM-dd hh:mm'),
          showList: [
            {
              start: app.util.formatDate(thizMoment, 'yyyy-MM-dd hh:mm'),
              end: app.util.formatDate(thizMoment, 'yyyy-MM-dd hh:mm'),
            }
          ],
        }
      }
      this.setData({
        schedDTPickerHelp: schedDTPickerHelp,
      })
    } catch (e) {
      //console.log(e)
    }
  },
  pageTouchMove:function(e){
    // 阻断上下滑动
  },
  // 触摸开始事件
  touchStart: function(e) {
    this.setData({
      pageMove:false
    })
    calendarTouchOpt.touchDot = e.touches[0].pageX // 获取触摸时的原点
    // 使用js计时器记录时间    
    calendarTouchOpt.interval = setInterval(function() {
      calendarTouchOpt.time++
    }, 100);
  },
  // 触摸移动事件
  touchMove: function(e) {
    var touchMove = e.touches[0].pageX;
    var touchDot = calendarTouchOpt.touchDot;
    var tmpFlag = calendarTouchOpt.tmpFlag;
    var time = calendarTouchOpt.time;
    // console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向左滑动   
    if (touchMove - touchDot <= -120 && time < 10) {
      if (tmpFlag) {
        calendarTouchOpt.tmpFlag = false
        // 执行
        // console.log('向左')
        let year = this.data.ScheduleDate.getFullYear()
        let month = this.data.ScheduleDate.getMonth()
        let day = this.data.ScheduleDate.getDate()
        let ScheduleDate = new Date(app.util.formatDate(new Date(year, month + 1, day), 'yyyy/MM/dd 00:00:00'))
        this.setData({
          ScheduleDate: ScheduleDate
        })
        this.searchScheduleData()
      }
    }
    // 向右滑动
    if (touchMove - touchDot >= 120 && time < 10) {
      if (tmpFlag) {
        calendarTouchOpt.tmpFlag = false
        // 执行
        // console.log('向右')
        let year = this.data.ScheduleDate.getFullYear()
        let month = this.data.ScheduleDate.getMonth()
        let day = this.data.ScheduleDate.getDate()
        
        let ScheduleDate = new Date(app.util.formatDate(new Date(year, month - 1, day), 'yyyy/MM/dd 00:00:00'))
        // console.log(ScheduleDate)
        this.setData({
          ScheduleDate: ScheduleDate
        })
        this.searchScheduleData()
      }
    }
    // touchDot = touchMove; //每移动一次把上一次的点作为原点（好像没啥用）
  },
  // 触摸结束事件
  touchEnd: function(e) {
    this.setData({
      pageMove: true
    })
    clearInterval(calendarTouchOpt.interval); // 清除setInterval
    calendarTouchOpt.time = 0;
    calendarTouchOpt.tmpFlag = true; // 回复滑动事件
  },
  disabledPullDown () {
    return false
  },
  // 电话拨打事件
  phonecallevent: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.TroupeBaseInfo.PerformanceUseLinkerTel
    })
  },
  // 富文本展开隐藏
  richTextShowHide: function (e) {
    let arrowType = e.currentTarget.dataset.arrowtype
    // 巡演要求
    if (arrowType == 1) {
      this.setData({
        requestArrowIsUp: !this.data.requestArrowIsUp
      })
    }
    // 剧目简介
    if (arrowType == 2) {
      this.setData({
        infoArrowIsUp: !this.data.infoArrowIsUp
      })
    }
  }
})