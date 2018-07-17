// var app = getApp()
// component/CountDown/CountDown.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    countDownType: {
      type: String,
      value: 'default'
    },
    timeStamp: {
      type: Number,
      value: '0'
    },
    fomatType: {
      type: String,
      value: 'HHmmss'
    },
    dateString: {
      type: String,
      value: ''
    }   //根据客户端时间倒计时
  },

  /**
   * 组件的初始数据
   */
  data: {
    lTimer: null,
    lastStamp: 0,
    timerResult: { days: '00', hours: '00', minutes: '00', seconds: '00' }
  },
  attached() {
    this.lastSecond()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 根据剩余毫秒计算
    lastSecond() {
      let that = this
      let startDateStamp = 0
      let endDateStamp = 0
      if (that.data.lTimer){
        clearInterval(that.data.lTimer)
      }
      if (!that.data.dateString) return false
      if (typeof that.data.countDownType === 'undefined' || that.data.countDownType === 'default') {
        let date = that.data.dateString.replace(/-/g, "/")
        startDateStamp = Math.round((new Date()).getTime() / 1000)
        endDateStamp = Math.round((new Date(date)).getTime() / 1000)
        if (endDateStamp > startDateStamp) {
          that.data.lastStamp = endDateStamp - startDateStamp
        }
      }

      if (that.data.countDownType === 'stamp') {
        that.data.lastStamp = Number(that.data.timeStamp) || 0
      }

      that.secondReflash()
      that.data.lTimer = setInterval(function () {
        if (that.data.lastStamp <= 0) {
          clearInterval(that.data.lTimer)
        }
        that.secondReflash()
      }, 1000)
    },
    secondReflash() {
      var range = this.data.lastStamp,
        secday = 86400, sechour = 3600,
        days = parseInt(range / secday),
        hours = parseInt((range % secday) / sechour),
        min = parseInt(((range % secday) % sechour) / 60),
        sec = ((range % secday) % sechour) % 60;

      this.data.lastStamp = range - 1;
      let result = {}
      result.days = this.timeNol(days)
      if (this.data.fomatType === 'HHmm' || this.data.fomatType === 'HHmmss') {
        hours = days * 24 + hours
      }
      if (this.fomatType === 'mmss') {
        min = (days * 24 + hours) * 60
      }
      result.hours = this.timeNol(hours)
      result.minutes = this.timeNol(min)
      result.seconds = this.timeNol(sec)
      this.data.timerResult = result
      this.setData({
        timerResult: result
      })
    },
    timeNol(h) {
      if (h < 0) {
        h = '0' + '0';
      } else if (h < 10) {
        h = '0' + h;
      }
      return h;
    }
  }
})
