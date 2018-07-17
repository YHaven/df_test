/**
 * 约定好，如果有条件需要传递到筛选页面，请通过Storage，在进入筛选页面时，通过参数key将Storage的key传入
 * 如果，选择后的条件，会保存到Storage，返回到页面
 * 不通过参数传key，默认的key是'FilterKey'
 */
import { setStorage, getStorage, clearStorage, removeStorage } from '../../utils/common/storage.js'
var app = getApp()
Page({
  data: {
    text1: '剧目类型',
    text2: '可约档期',
    text3: '演出价',
    text4: '剧团认证',
    text5: '城市',
    text6: '时长',
    operaitemsOpen: false,
    timeitemsOpen: false,
    priceitemsOpen: false,
    operaitems: [
      // { name: '歌剧', value: {index: 0, type:'歌剧'}},
      // { name: '音乐剧', value: {index: 1, type: '音乐剧'} },
      // { name: '舞剧', value: {index:2, type: '舞剧'} },
      // { name: '话剧', value: {index:3, type:'话剧'} },
      // { name: '儿童剧', value: {index: 4, type:'儿童剧'} },
      // { name: '芭蕾', value: {index:5, type:'芭蕾'} },
      // { name: '交响乐', value: {index:6,type:'交响乐'} },
      // { name: '传统戏剧', value: {index:7,type:'传统戏剧'} },
      // { name: '相声曲艺', value: {index:8,type:'相声曲艺'} },
      // { name: '马戏', value: {index:9,type:'马戏'} },
      // { name: '杂技', value: { index: 10, type:'杂技'} },
      // { name: '魔术', value: {index:11,type:'魔术歌剧'} },
      // { name: '演唱会', value: {index:12, type:'演唱会'} },
      // { name: '其他', value: {index: 13, type:'其他'} }
      // { label: '歌剧', value: 1 },
      // { label: '音乐剧', value: 2 },
      // { label: '舞剧', value: 3 },
      // { label: '话剧', value: 4 },
      // { label: '儿童剧', value: 5 },
      // { label: '芭蕾', value: 6 },
      // { label: '交响乐', value: 7 },
      // { label: '传统戏剧', value: 8 },
      // { label: '相声曲艺', value: 9 },
      // { label: '马戏', value: 10 },
      // { label: '杂技', value: 11 },
      // { label: '魔术', value: 12 },
      // { label: '演唱会', value: 13 },
      // { label: '其他', value: 999999 },
      { name: '歌剧', value: "1" },
      { name: '音乐剧', value: "2" },
      { name: '舞剧', value: "3" },
      { name: '话剧', value: "4" },
      { name: '儿童剧', value: "5" },
      { name: '芭蕾', value: "6" },
      { name: '交响乐', value:"7"},
      { name: '传统戏剧', value: "8" },
      { name: '相声曲艺', value: '9'},
      { name: '马戏', value: '10'  },
      { name: '杂技', value:'11'  },
      { name: '魔术', value: '12' },
      { name: '演唱会', value: '13' },
      { name: '其他', value: '999999' }
    ],
    priceitems: [
      // { name: '0-3万元', value: { index:0, from: 0, to: 3} },
      // { name: '3-5万元', value: { index: 1,from: 3, to: 5 } },
      // { name: '5-7万元', value: { index: 2,from: 5, to: 7} },
      // { name: '7-10万元', value: { index: 3,from: 7, to: 10} },
      // { name: '10万元以上', value: { index: 4,from: 10, to: Number.MAX_SAFE_INTEGER} }
      { name: '0-3万元', value: '1' },
      { name: '3-5万元', value: '2' },
      { name: '5-7万元', value: '3' },
      { name: '7-10万元', value: '4' },
      { name: '10万元以上', value: '5' }
    ],
    authitems: [
      { name: '已认证', value: '1' },
      { name: '未认证', value: '0' }
    ],
    timeitems: [
      // { name: '0-60分钟', value: { index:0, from: 0, to: 60} },
      // { name: '60-120分钟', value: { index: 1, from: 60, to: 120 } },
      // { name: '120-180分钟', value: { index: 2, from: 120, to: 180 } },
      // { name: '180分钟以上', value: { index: 3, from: 180, to: Number.MAX_SAFE_INTEGER } },
      { name: '0-60分钟', value: '1' },
      { name: '60-120分钟', value: '2' },
      { name: '120-180分钟', value: '3' },
      { name: '180分钟以上', value: '4' },
    ],
    operaIcon: 'icon-xiala', // icon-tiaozhuanjiantou、selected icon-xiala
    // scheduleIcon: 'icon-xiala',
    priceIcon: 'icon-xiala',
    // authIcon: 'icon-xiala',
    cityIcon: 'icon-tiaozhuanjiantou',
    timeIcon: 'icon-xiala',
    extraPrice1: '万元',
    extraTime1: '分钟',
    iconImg: '../../images/dropdown.png',
    altIcon: 'icon图标',
    calendar: '../../images/calendar.png',
    resetText: '重置',
    confirmText: '确认',
    isVerify: false,
    formObj: {
      operaType: [],
      scheduleDate: {},
      price: [],
      auth: [],
      city: [],
      time: [],
      timeInput: {},
      priceInput: {}
    },
    primarySize: 15,
    // 存储的键
    StorageKey: 'FilterKey',
    filterCityUrl: '/pages/filterCity/filterCity?key=FilterCity',
    cityStorageKey: 'FilterCity'
  },
  clearDate (e) {
    console.log(e)
    this.data.formObj.scheduleDate[e.currentTarget.dataset.type] = ''
    this.setData({
      formObj: this.data.formObj
    })
  },
  bindDateChange: function (e) {
    var data = e.currentTarget.dataset;
    this.data.formObj.scheduleDate[data.type] = e.detail.value
    if (this.data.formObj.scheduleDate['to'] && new Date(this.data.formObj.scheduleDate['from']) > new Date(this.data.formObj.scheduleDate['to'])) {
      if (data.type === 'from') {
        this.data.formObj.scheduleDate['from'] = this.data.formObj.scheduleDate['to']
      } else {
        this.data.formObj.scheduleDate['to'] = this.data.formObj.scheduleDate['from']
      }
    }
    this.setData({
      formObj: this.data.formObj
    })
  },
  // 剧目类型改变
  checkboxChangeOperaType: function (e) {
    console.log(e)
    this.data.formObj.operaType = e.detail.value.map(v => new Object({
      index: this.data.operaitems.map(o=>o.value).indexOf(v),
      value: v
    }))
    this.data.operaitems.map(e => e.selected = false)
    if (this.data.formObj.operaType && this.data.formObj.operaType.length > 0) {
      this.data.formObj.operaType.map(e => {
        if (e.index < this.data.operaitems.length)
          this.data.operaitems[e.index].selected = true
      })
    }
    this.setData({
      formObj: this.data.formObj,
      operaitems: this.data.operaitems
    })
  },
  // 演出价改变
  checkboxChangePrice: function (e) {
    console.log(e)
    this.data.formObj.price = e.detail.value.map(v => new Object({
      index: this.data.priceitems.map(o => o.value).indexOf(v),
      value: v
    }))
    this.data.priceitems.map(e => e.selected = false)
    if (this.data.formObj.price && this.data.formObj.price.length > 0) {
      this.data.formObj.price.map(e => {
        if (e.index < this.data.priceitems.length)
          this.data.priceitems[e.index].selected = true
      })
    }
    this.setData({
      formObj: this.data.formObj,
      priceitems: this.data.priceitems
    })
  },
  // 时长改变
  checkboxChangeTime: function (e) {
    console.log(e)
    this.data.formObj.time = e.detail.value.map(v => new Object({
      index: this.data.timeitems.map(o => o.value).indexOf(v),
      value: v
    }))
    this.data.timeitems.map(e => e.selected = false)
    if (this.data.formObj.time && this.data.formObj.time.length > 0) {
      this.data.formObj.time.map(e => {
        if (e.index < this.data.timeitems.length)
          this.data.timeitems[e.index].selected = true
      })
    }
    this.setData({
      formObj: this.data.formObj,
      timeitems: this.data.timeitems
    })
  },
  // 展开折叠
  openOrFold (e) {
    var data = e.currentTarget.dataset;
    if (data.type==='city') {
      this.doViewTap(e)
      return
    }
    console.log(e.currentTarget.dataset)
    var obj = {}
    obj[data.type + "Icon"] = data.isopen ? 'icon-xiala' : 'selected icon-xiala'
    obj[data.type + "itemsOpen"] = !this.data[data.type + "itemsOpen"]
    this.setData(obj)
  },
  radioChange(e){
    console.log(e)
    this.data.formObj.auth = e.detail.value.map(v => new Object({
      index: this.data.authitems.map(o => o.value).indexOf(v),
      value: v
    }))
    this.data.authitems.map(e => e.selected = false)
    if (this.data.formObj.auth && this.data.formObj.auth.length > 0) {
      this.data.formObj.auth.map(e => {
        if (e.index < this.data.authitems.length)
          this.data.authitems[e.index].selected = true
      })
    }
    this.setData({
      formObj: this.data.formObj,
      authitems: this.data.authitems
    })
  },
  // 初始化
  onShow () {
    // 若cityStorageKey存在值，从cityStorageKey读取city，读取后清空
    var selectedCitys = getStorage(this.data.cityStorageKey)
    if (selectedCitys) {
      try{
        this.data.formObj.city = JSON.parse(selectedCitys)
      }catch(e){}
      removeStorage(this.data.cityStorageKey)
    }

    this.data.operaitems.map(e => e.selected = false)
    if (this.data.formObj.operaType && this.data.formObj.operaType.length > 0) {
      this.data.formObj.operaType.map(e => {
        this.data.operaitems[e.index].selected = true
      })
    }
    this.data.priceitems.map(e => e.selected = false)
    if (this.data.formObj.price && this.data.formObj.price.length > 0) {
      this.data.formObj.price.map(e => {
        this.data.priceitems[e.index].selected = true
      })
    }
    this.data.timeitems.map(e => e.selected = false)
    if (this.data.formObj.time && this.data.formObj.time.length > 0) {
      this.data.formObj.time.map(e => {
        this.data.timeitems[e.index].selected = true
      })
    }
    this.data.authitems.map(e => e.selected = false)
    if (this.data.formObj.auth && this.data.formObj.auth.length > 0) {
      this.data.formObj.auth.map(e => {
        this.data.authitems[e.index].selected = true
      })
    }
    this.setData({
      operaitems: this.data.operaitems,
      priceitems: this.data.priceitems,
      timeitems: this.data.timeitems,
      authitems: this.data.authitems,
      formObj: this.data.formObj
    });
  },
  onLoad (e) {
    wx.setNavigationBarTitle({
      title: '筛选',
    })
    removeStorage('operaListRefresh')
    if (e['key']) {
      this.data.StorageKey = e['key']
    }
    try {
      this.data.formObj = JSON.parse(getStorage(this.data.StorageKey))
      this.data.operaitemsOpen = this.data.formObj.operaType.filter(o => o.index > 3).length > 0;
      this.data.timeitemsOpen = this.data.formObj.timeInput.from || this.data.formObj.timeInput.to || this.data.formObj.time.filter(o => o.index > 3).length > 0;
      this.data.priceitemsOpen = this.data.formObj.priceInput.from || this.data.formObj.priceInput.to || this.data.formObj.price.filter(o => o.index > 3).length > 0;;
      this.setData({
        formObj: this.data.formObj,
        operaitemsOpen: this.data.operaitemsOpen,
        timeitemsOpen: this.data.timeitemsOpen,
        priceitemsOpen: this.data.priceitemsOpen
      })
    } catch (e) {}
  },
  reset () {
    this.data.formObj = {
      operaType: [],
      scheduleDate: {},
      price: [],
      auth: [],
      city: [],
      time: [],
      timeInput: {},
      priceInput: {}
    }
    this.setData({
      formObj: this.data.formObj
    })
    this.onShow()
  },
  confirm () {
    setStorage(this.data.StorageKey, JSON.stringify(this.data.formObj))
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.data.isRefresh = true
    wx.navigateBack()
  },
  verifyExtraTime1 (e) {
    console.log(e)
    if (e.detail.value) {
      this.data.formObj.timeInput['from'] = Number.parseInt(e.detail.value)
      if (this.data.formObj.timeInput['to'] && this.data.formObj.timeInput['from'] && this.data.formObj.timeInput['from'] > this.data.formObj.timeInput['to']) {
        this.data.formObj.timeInput['from'] = this.data.formObj.timeInput['to']
      }
      this.setData({
        formObj: this.data.formObj
      })
    }
  },
  verifyExtraTime2 (e) {
    console.log(e)
    if (e.detail.value) {
      this.data.formObj.timeInput['to'] = Number.parseInt(e.detail.value)
      if (this.data.formObj.timeInput['to'] && this.data.formObj.timeInput['from'] && this.data.formObj.timeInput['from'] > this.data.formObj.timeInput['to']) {
        this.data.formObj.timeInput['to'] = this.data.formObj.timeInput['from']
      }
      this.setData({
        formObj: this.data.formObj
      })
    }
  },
  extraTimeEndInput (e) {
    this.data.formObj.timeInput = this.data.formObj.timeInput || {}
    this.data.formObj.timeInput['to'] = e.detail.value.replace(/[^0-9]/g, '')
    this.setData({
      formObj: this.data.formObj
    })
  },
  extraTimeStartInput (e) {
    console.log(this.data.formObj.timeInput)
    this.data.formObj.timeInput = this.data.formObj.timeInput || {}
    this.data.formObj.timeInput['from'] = e.detail.value.replace(/[^0-9]/g, '')
    this.setData({
      formObj: this.data.formObj
    })
  },
  /**
   * Start 演出价输入框
   */
  extraPriceStartInput (e) {
    console.log(e.detail.value)
    this.data.formObj.priceInput = this.data.formObj.priceInput || {}
    this.data.formObj.priceInput['from'] = e.detail.value.replace(/[^0-9\.]/g, '')
    this.setData({
      formObj: this.data.formObj
    })
  },
  extraPriceEndInput(e) {
    console.log(e.detail.value)
    this.data.formObj.priceInput = this.data.formObj.priceInput || {}
    this.data.formObj.priceInput['to'] = e.detail.value.replace(/[^0-9\.]/g, '')
    this.setData({
      formObj: this.data.formObj
    })
  },
  verifyExtraPrice1 (e) {
    console.log(e)
    if (e.detail.value) {
      this.data.formObj.priceInput['from'] = this.formatNumber(Number.parseFloat(e.detail.value))
      if (this.data.formObj.priceInput['to'] && this.data.formObj.priceInput['from'] && this.data.formObj.priceInput['from'] > this.data.formObj.priceInput['to']) {
        this.data.formObj.priceInput['from'] = this.data.formObj.priceInput['to']
      }
      this.setData({
        formObj: this.data.formObj
      })
    }
  },
  verifyExtraPrice2 (e) {
    console.log(e)
    if (e.detail.value) {
      this.data.formObj.priceInput['to'] = this.formatNumber(Number.parseFloat(e.detail.value))
      if (this.data.formObj.priceInput['to'] && this.data.formObj.priceInput['from'] && this.data.formObj.priceInput['from'] > this.data.formObj.priceInput['to']) {
        this.data.formObj.priceInput['to'] = this.data.formObj.priceInput['from']
      }
      this.setData({
        formObj: this.data.formObj
      })
    }
  },
  /**
   * END
   */
  // 四舍五入
  formatNumber (num) {
    return Math.round(num*100)/100
  },
  doViewTap (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    // 设置cityStorageKey
    if (url === this.data.filterCityUrl) {
      setStorage(this.data.cityStorageKey, JSON.stringify(this.data.formObj.city))
    }
    app.util.commonViewTap(url)
  }
})
