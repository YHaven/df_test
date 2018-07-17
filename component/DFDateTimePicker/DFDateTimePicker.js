// component/DFDateTimePicker/DFDateTimePicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    startDate: {
      type: String,
      value: '1970-01-01 00:00:00'
    },
    endDate: {
      type: String,
      value: '2100-12-31 23:59:59'
    },
    fields: {
      type: Array,
      value: ['year', 'month', 'day', 'hour', 'minute']
    },
    disabled: {
      type: Boolean,
      value: false
    },
    value: {
      type: String,
      value: '2018-01-01 00:00:00', 
      observer: function (newVal, oldVal, changedPath) {
        if (newVal != '') {
          this.applyValue()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    range: [[1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7]],
    valueIndexArr:[]
  },
  attached () {    
    this.applyValue()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindcolumnchange (e) {
      var start = new Date(this.data.startDate)
      this.data.valueIndexArr[e.detail.column] = e.detail.value
      if (!this._isInRange()){
        for (var i = e.detail.column; i < this.data.fields.length; i++) {
          if (this.data.fields[i] === 'year') {
            this.data.valueIndexArr[i] = e.detail.value < 10 ? 10 : (e.detail.value > this.data.range[i].length - 10 ? this.data.range[i].length - 10 : (new Date().getFullYear() - Number.parseInt(this.data.range[i][0])))
          } else {
            this.data.valueIndexArr[i] = 0
          }
        }
      }
      this.setData({
        valueIndexArr: this.data.valueIndexArr
      })
      
      // 如果不在范围内, 调整到范围内
      this.triggerEvent('columnchange',e.detail)
    },
    bindchange(e) {
      var old = this.data.valueIndexArr
      this.data.valueIndexArr = e.detail.value
      if (!this._isInRange) {
        this.data.valueIndexArr = old
      }
      console.log(this._curSelectDate())
      this.triggerEvent('change', { value: this._curSelectDate()})
    }, 
    bindcancel(e) {
      console.log(e)
      this.triggerEvent('cancel', e.detail)
    },
    _curSelectDate () {
      let valueDate = new Date(this.data.value.replace(/-/g,'/'))
      var tmp = {
        year: valueDate.getFullYear(),
        month: valueDate.getMonth() + 1,
        day: valueDate.getDate(),
        hour: valueDate.getHours(),
        minute: valueDate.getMinutes(),
        second: 0
      }
      for (var i = 0; i < this.data.valueIndexArr.length; i++) {
        tmp[this.data.fields[i]] = this.data.valueIndexArr[i] + Number.parseInt(this.data.range[i][0])
      }
      var date = new Date(tmp.year, tmp.month - 1, tmp.day, tmp.hour, tmp.minute, tmp.second)
      // console.log(date.getDate(), tmp.day)
      if (date.getDate() !== tmp.day) {
        throw Error("无效的时间")
      }
      return date
    },
    _isInRange () {
      var start = new Date(this.data.startDate)
      var end = new Date(this.data.endDate)
      try{
        var cur = this._curSelectDate()
        return cur >= start && cur <= end
      }catch(e){}
      return false
    },
    applyValue() {
      var start = new Date(this.data.startDate)
      var end = new Date(this.data.endDate)
      var tmp = {
        yearArr: new Array(),
        monthArr: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
        dayArr: new Array(),
        hourArr: new Array(),
        minuteArr: new Array(),
        secondArr: new Array()
      }
      for (var j = start.getFullYear() - 10; j < end.getFullYear() + 10; j++) {
        tmp.yearArr.push(j + '年')
      }
      for (var i = 1; i <= 31; i++) {
        tmp.dayArr.push((i < 10 ? '0' : '') + i + '日')
      }
      for (i = 0; i < 24; i++) {
        tmp.hourArr.push((i < 10 ? '0' : '') + i + '时')
      }
      for (i = 0; i < 60; i++) {
        tmp.minuteArr.push((i < 10 ? '0' : '') + i + '分')
      }
      for (i = 0; i < 60; i++) {
        tmp.secondArr.push((i < 10 ? '0' : '') + i + '秒')
      }
      var curDate = new Date(this.data.value)
      var valueTmp = {
        year: curDate.getFullYear() + '年',
        month: (curDate.getMonth() + 1 < 10 ? '0' : '') + (curDate.getMonth() + 1) + '月',
        day: (curDate.getDate() < 10 ? '0' : '') + (curDate.getDate()) + '日',
        hour: (curDate.getHours() < 10 ? '0' : '') + curDate.getHours() + '时',
        minute: (curDate.getMinutes() < 10 ? '0' : '') + curDate.getMinutes() + '分',
        second: (curDate.getSeconds() < 10 ? '0' : '') + curDate.getSeconds() + '秒'
      }
      var range = new Array()
      var valueIndexArr = new Array()
      for (i = 0; i < this.data.fields.length; i++) {
        range.push(tmp[this.data.fields[i] + 'Arr'])
        valueIndexArr.push(tmp[this.data.fields[i] + 'Arr'].indexOf(valueTmp[this.data.fields[i]]))
      }
      this.setData({
        range,
        valueIndexArr
      })
    },

  }
})
