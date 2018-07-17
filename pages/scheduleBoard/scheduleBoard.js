// pages/scheduleBoard/scheduleBoard.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemId: '2021a168-6dec-4227-a62b-f252e098ef19',
    entityID: '07f9608b-f512-4d7c-bb87-a3b8ee26e17e',
    fomatScheduleData: {},
    ScheduleDate: new Date(),
    calendarOptions:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

    // 加载档期
    this.loadSchedule()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  doViewTap: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  loadSchedule: function () {
    // 首次加载先获取最近一天
    let that = this
    let url = app.api.TroupeItemScheduleInfoSearchByOrderForRecentMonth
    let params = {
      ScheduleDayQueryType: 0,
      ShowItemID: that.data.itemId,
    }
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function (res) {
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
      function (res) {
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
  searchScheduleData: function () {
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
      function (res) {
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
      function (res) {
        // 失败
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 那月档期数据处理
  searchScheduleDataDeal: function (res) {
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
  // 显示那月档期
  showSelectSchedule: function (num) {
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
      // this.getTotalPrice()
    }
  },
  // 日历点击事件
  dayClick: function (event) {
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
  nextMonth: function (event) {
    console.log('eeeeee')
    let year = event.detail.currentYear;
    let month = event.detail.currentMonth;
    let day = event.detail.currentDay;
    this.dateChangeDo(year, month, day)
  },

  /**
   * 点击上个月
   */
  prevMonth: function (event) {
    let year = event.detail.currentYear;
    let month = event.detail.currentMonth;
    let day = event.detail.currentDay;
    this.dateChangeDo(year, month, day)
  },

  /**
   * 日期变更事件
   */
  dateChange: function (event) {
    let year = event.detail.currentYear;
    let month = event.detail.currentMonth;
    let day = event.detail.currentDay;
    this.dateChangeDo(year, month, day)
    console.log(year)
  },
  dateChangeDo: function (year, month, day) {
    let ScheduleDate = new Date(app.util.formatDate(new Date(year, month - 1, day), 'yyyy/MM/dd 00:00:00'))
    this.setData({
      ScheduleDate: ScheduleDate
    })
    this.searchScheduleData()
    this.getCurrentScheduleData(year, month, day)
  },
  // 获取当前日期档期信息
  getCurrentScheduleData: function (year, month, day) {
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
    console.log(calendarOptions)
    // this.updateSchedDateTimePickerHelp(this.data.selectScheduleData.DayKey)
  },
})