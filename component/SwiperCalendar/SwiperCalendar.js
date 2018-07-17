// component/SwiperCalendar/SwiperCalendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    calendarOptions:{
      type: Object,
      value: {},
      observer: 'initSwiper'
    },
    scheduleData: {
      type: Object,
      value: {},
      observer: '_setScheduleData'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    year: 0,
    month: 0,
    day: 0,
    currentIndex: 0,
    calendarShow: [],
    fomatScheduleData:{}
  },
  attached() {
    // this.initSwiper()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initSwiper: function (newData, oldData) {
      console.log('initSwiper')
      let now = new Date()
      if (!newData.year){
        return false
      }
      let calendarOptions = newData
      let year = calendarOptions.year //now.getFullYear()
      let month = calendarOptions.month//now.getMonth()
      let day = calendarOptions.day //now.getDate()
      this.setData({
        year: year,
        month: month - 1,
        day: day,
        currentIndex: month
      })
      this.setCalendarShow(year, month)
    },
    setSwiper: function(year, month, day) {
      this.setData({
        year: year,
        month: month,
        day: day,
        currentIndex: month + 1
      })
      this.setCalendarShow(year, month)
    },
    setCalendarShow: function(year, month) {
      const calendarOptionTemp = {
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
        style: [],
        activeType: 'rounded', // 日期背景效果
        fomatScheduleData: {}
      }
      let calendarShow = []
      // 为了翻过一年
      let calendarOption1 = Object.assign({}, calendarOptionTemp)

      calendarOption1.year = year - 1
      calendarOption1.month = 11
      calendarOption1.day = this.data.day // 日期
      calendarShow.push(calendarOption1)
      for (let n = 0; n < 12; n++) {
        let calendarOption2 = Object.assign({}, calendarOptionTemp)
        calendarOption2.year = year
        calendarOption2.month = n
        calendarOption2.day = this.data.day // 日期
        let month = this.data.calendarOptions.month -1//now.getMonth()
        if (month === n) {
          calendarOption2.fomatScheduleData = this.data.fomatScheduleData
          calendarOption2.style = this.data.calendarOptions.style
        }
        calendarShow.push(calendarOption2)
      }
      // 为了翻过一年
      let calendarOption3 = Object.assign({}, calendarOptionTemp)
      calendarOption3.year = year + 1
      calendarOption3.month = 0
      calendarOption3.day = this.data.day // 日期
        calendarShow.push(calendarOption3)

      this.setData({
        calendarShow: calendarShow
      })
    },
    nextYear: function() {
      let that = this
      let year = that.data.year + 1
      let month = 0
      that.setCalendarShow(year, month)
      that.setData({
        year: year,
        month: month,
      })
      let eventDetail = {}
      eventDetail['currentYear'] = this.data.year;
      eventDetail['currentMonth'] = month+1;
      eventDetail['currentDay'] = this.data.day;
      this.triggerEvent('nextMonth', eventDetail);
      setTimeout(function() {
        that.setData({
          currentIndex: 1
        })
      }, 100) // 延迟100是怕setCalendarShow还未渲染完
    },
    preYear: function() {
      let that = this
      let year = that.data.year - 1
      let month = 11
      that.setCalendarShow(year, month)
      that.setData({
        year: year,
        month: month
      })
      let eventDetail = {}
      eventDetail['currentYear'] = this.data.year;
      eventDetail['currentMonth'] = month+1;
      eventDetail['currentDay'] = this.data.day;
      this.triggerEvent('prevMonth', eventDetail);
      setTimeout(function() {
        that.setData({
          currentIndex: 12
        })
      }, 100)
    },
    bindchange: function(e) {
      let that = this
      console.log('bindchange')
      console.log(e)
      let currentMonth = this.data.month
      let calendarShow = this.data.calendarShow
      let currentIndex = this.data.currentIndex
      // calendarShow.splice(0,1)
      // 是否touch触发
      if (e.detail.source === 'touch') {

        let current = e.detail.current
        console.log('current:' + current)
        console.log('currentMonth:' + currentMonth)
        console.log('currentIndex:' + currentIndex)
        // 
        that.setData({
          currentIndex: current,
          calendarShow: calendarShow
        })
        // 左滑还是右滑
        if (current > currentMonth + 1) {
          // 向右滑+
          // console.log('向右滑')
          // 滑过了一年处理
          this.swiperSlide('right')

        } else if (current < currentMonth + 1) {
          // 向左滑-
          // console.log('向左滑')
          // 滑过了一年处理
          this.swiperSlide('left')

        }
      } else {
        console.log('不是touch')
      }


    },
    bindanimationfinish: function(e) {
      // console.log(e)
      // console.log('bindanimationfinish')
    },
    swiperSlide: function(arrow) {
      let currentMonth = this.data.month
      let currentIndex = this.data.currentIndex
      let eventDetail = {}
      eventDetail['currentYear'] = this.data.year;
      eventDetail['currentMonth'] = currentIndex;
      eventDetail['currentDay'] = this.data.day;
      if (arrow === 'left') {
        if (currentIndex <= 0) {
          this.preYear()
        } else {
          this.setData({
            month: currentIndex - 1,
          })
          this.triggerEvent('prevMonth', eventDetail);
        }
      }
      if (arrow === 'right') {
        // 跨年了
        if (currentIndex >= 13) {
          this.nextYear()
        } else {
          this.setData({
            month: currentIndex - 1,
          })
          this.triggerEvent('nextMonth', eventDetail);
        }
      }
      
      
    },
    nextMonth: function(e) {
      let year = e.detail.currentYear;
      let month = e.detail.currentMonth;
      let day = e.detail.currentDay;
      let currentIndex = this.data.currentIndex
      this.setData({
        currentIndex: currentIndex + 1
      })
      this.swiperSlide('right')
      
    },
    prevMonth: function(e) {
      let year = e.detail.currentYear;
      let month = e.detail.currentMonth;
      let day = e.detail.currentDay;
      let currentIndex = this.data.currentIndex
      this.setData({
        currentIndex: currentIndex - 1
      })
      this.swiperSlide('left')
    },
    dateChange: function(e) {
      let year = e.detail.currentYear;
      let month = e.detail.currentMonth;
      let day = e.detail.currentDay;
      this.setSwiper(year, month-1, day)
      let eventDetail = {}
      eventDetail['currentYear'] = year;
      eventDetail['currentMonth'] = month;
      eventDetail['currentDay'] = day;
      this.triggerEvent('dateChange', eventDetail);
    },
    dayClick: function(e) {
      const year = e.detail.year;
      const month = e.detail.month;
      const day = e.detail.day;
      const color = e.detail.color;
      const lunarMonth = e.detail.lunarMonth;
      const lunarDay = e.detail.lunarDay;
      const background = e.detail.background;
      let eventDetail = {}
      eventDetail['year'] = year;
      eventDetail['month'] = month;
      eventDetail['day'] = day;
      eventDetail['color'] = color;
      eventDetail['currentYear'] = year;
      eventDetail['currentMonth'] = month;
      eventDetail['currentDay'] = day;
      this.triggerEvent('dayClick', eventDetail);
    },
    _setScheduleData: function (newData, oldData){
      console.log('_setScheduleData')
      let calendarShow = this.data.calendarShow
      let currentIndex = this.data.currentIndex
      this.setData({
        fomatScheduleData: newData
      })
      // if (calendarShow.length>0 && calendarShow[currentIndex].fomatScheduleData){
      //   calendarShow[currentIndex].fomatScheduleData = newData
      //   this.setData({
      //     fomatScheduleData: newData,
      //     calendarShow: calendarShow
      //   })
      //   console.log(calendarShow[currentIndex])
      // }
    }
  }
})