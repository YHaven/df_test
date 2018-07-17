import { setStorage, getStorage, clearStorage, removeStorage } from '../../utils/common/storage.js'
import { operaitems, priceitems, authitems, seatitems} from '../venueList/enum.js'
var app = getApp()
Page({
  data: {
    text1: '适演类型',
    text2: '可约档期',
    text3: '场租价',
    text4: '剧院认证',
    text5: '城市',
    text6: '剧场座位',
    operaitemsOpen: false,
    seatitemsOpen: false,
    priceitemsOpen: false,
    operaitems,
    priceitems,
    authitems,
    seatitems,
    operaIcon: 'icon-xiala', // icon-tiaozhuanjiantou、selected icon-xiala
    // scheduleIcon: 'icon-xiala',
    priceIcon: 'icon-xiala',
    // authIcon: 'icon-xiala',
    cityIcon: 'icon-tiaozhuanjiantou',
    seatIcon: 'icon-xiala',
    extraPrice1: '万元',
    extraTime1: '座',
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
      seatNum: [],
      seatInput: {},
      priceInput: {}
    },
    primarySize: 15,
    filterCityUrl: '/pages/filterCity/filterCity?key=FilterCity',
    cityStorageKey: 'FilterCity'
  },
  clearDate(e) {
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
    this.data.formObj.operaType = e.detail.value
    this.data.operaitems.map(e => e.selected = (this.data.formObj.operaType instanceof Array && this.data.formObj.operaType.indexOf(e.value)>=0))
    this.setData({
      'formObj.operaType': this.data.formObj.operaType,
      operaitems: this.data.operaitems
    })
  },
  // 演出价改变
  checkboxChangePrice: function (e) {
    this.data.formObj.price = e.detail.value
    this.data.priceitems.map(e => e.selected = (this.data.formObj.price instanceof Array && this.data.formObj.price.indexOf(e.value)>=0))
    this.setData({
      'formObj.price': this.data.formObj.price,
      priceitems: this.data.priceitems
    })
  },
  // 时长改变
  checkboxChangeSeatNum: function (e) {
    this.data.formObj.seatNum = e.detail.value
    this.data.seatitems.map(e => e.selected = (this.data.formObj.seatNum instanceof Array && this.data.formObj.seatNum.indexOf(e.value)>=0))
    this.setData({
      'formObj.seatNum': this.data.formObj.seatNum,
      seatitems: this.data.seatitems
    })
  },
  // 展开折叠
  openOrFold(e) {
    var data = e.currentTarget.dataset;
    if (data.type === 'city') {
      this.doViewTap(e)
      return
    }
    var obj = {}
    obj[data.type + "Icon"] = data.isopen ? 'icon-xiala' : 'selected icon-xiala'
    obj[data.type + "itemsOpen"] = !this.data[data.type + "itemsOpen"]
    this.setData(obj)
  },
  radioChange(e) {
    this.data.formObj.auth = e.detail.value
    this.data.authitems.map(e => e.selected = (this.data.formObj.auth instanceof Array && this.data.formObj.auth.indexOf(e.value)>=0))
    this.setData({
      'formObj.auth': this.data.formObj.auth,
      authitems: this.data.authitems
    })
  },
  // 初始化
  onShow() {
    // 若cityStorageKey存在值，从cityStorageKey读取city，读取后清空
    var selectedCitys = getStorage(this.data.cityStorageKey)
    if (selectedCitys) {
      try {
        this.data.formObj.city = JSON.parse(selectedCitys)
      } catch (e) { }
      removeStorage(this.data.cityStorageKey)
    }

    this.data.operaitems.map(e => e.selected = (this.data.formObj.operaType instanceof Array && this.data.formObj.operaType.indexOf(e.value) >= 0))

    this.data.priceitems.map(e => e.selected = (this.data.formObj.price instanceof Array && this.data.formObj.price.indexOf(e.value) >= 0))

    this.data.seatitems.map(e => e.selected = (this.data.formObj.seatNum instanceof Array && this.data.formObj.seatNum.indexOf(e.value) >= 0))

    this.data.authitems.map(e => e.selected = (this.data.formObj.auth instanceof Array && this.data.formObj.auth.indexOf(e.value) >= 0))

    this.setData({
      operaitems: this.data.operaitems,
      priceitems: this.data.priceitems,
      seatitems: this.data.seatitems,
      authitems: this.data.authitems,
      'formObj.city': this.data.formObj.city
    });
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: '筛选',
    })
    var page = app.util.getPrePage()
    console.log(page.data)
    this.data.formObj = {
      operaType: [...page.data.searchForm.sType],
      price: [...page.data.searchForm.sPrice],
      priceInput: { ...page.data.searchForm.sPriceInput },

      scheduleDate: { 'from': page.data.searchForm.CanBookingTimes.From, 'to': page.data.searchForm.CanBookingTimes.To },
      auth: page.data.searchForm.IsSysConfirmed ? ['1'] : page.data.searchForm.IsSysConfirmed === false ? ['0']:[],
      city: [...page.data.searchForm.city],
      seatNum: [...page.data.searchForm.sSeatNum],
      seatInput: { ...page.data.searchForm.seatInput },
    }
    if (this.data.formObj.operaType.filter(e => e > 3).length > 0) {
      this.data.operaitemsOpen = true
    }
    if (this.data.formObj.price.filter(e => e > 3).length > 0 || this.data.formObj.price.to || this.data.formObj.price.from) {
      this.data.priceitemsOpen = true
    }
    if (this.data.formObj.seatNum.filter(e => e > 3).length > 0 || this.data.formObj.seatInput.to || this.data.formObj.seatInput.from) {
      this.data.seatitemsOpen = true
    }
    this.setData({
      formObj: this.data.formObj,
      operaitemsOpen: this.data.operaitemsOpen,
      priceitemsOpen: this.data.priceitemsOpen,
      seatitemsOpen: this.data.seatitemsOpen,
    })
  },
  reset() {
    this.data.formObj = {
      operaType: [],
      scheduleDate: {},
      price: [],
      auth: [],
      city: [],
      seatNum: [],
      seatInput: {},
      priceInput: {}
    }
    this.setData({
      formObj: this.data.formObj
    })
    this.onShow()
  },
  confirm() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.data.isRefresh = true
    prevPage.data.searchForm.sType = this.data.formObj.operaType
    prevPage.data.searchForm.sPrice = this.data.formObj.price
    prevPage.data.searchForm.sPriceInput = this.data.formObj.priceInput
    prevPage.data.searchForm.CanBookingTimes = [{ 'From': this.data.formObj.scheduleDate.from, 'To': this.data.formObj.scheduleDate.to }]
    prevPage.data.searchForm.IsSysConfirmed = this.data.formObj.auth.length === 1 ? this.data.formObj.auth[0]==='1':undefined
    prevPage.data.searchForm.city = this.data.formObj.city
    prevPage.data.searchForm.sSeatNum = this.data.formObj.seatNum
    prevPage.data.searchForm.seatInput = this.data.formObj.seatInput
    wx.navigateBack()
  },
  verifyExtraTime1(e) {
    if (e.detail.value) {
      this.data.formObj.seatInput['from'] = Number.parseInt(e.detail.value)
      if (this.data.formObj.seatInput['to'] && this.data.formObj.seatInput['from'] && this.data.formObj.seatInput['from'] > this.data.formObj.seatInput['to']) {
        this.data.formObj.seatInput['from'] = this.data.formObj.seatInput['to']
      }
      this.setData({
        formObj: this.data.formObj
      })
    }
  },
  verifyExtraTime2(e) {
    if (e.detail.value) {
      this.data.formObj.seatInput['to'] = Number.parseInt(e.detail.value)
      if (this.data.formObj.seatInput['to'] && this.data.formObj.seatInput['from'] && this.data.formObj.seatInput['from'] > this.data.formObj.seatInput['to']) {
        this.data.formObj.seatInput['to'] = this.data.formObj.seatInput['from']
      }
      this.setData({
        formObj: this.data.formObj
      })
    }
  },
  extraTimeEndInput(e) {
    this.data.formObj.seatInput = this.data.formObj.seatInput || {}
    this.data.formObj.seatInput['to'] = e.detail.value.replace(/[^0-9]/g, '')
    this.setData({
      formObj: this.data.formObj
    })
  },
  extraTimeStartInput(e) {
    this.data.formObj.seatInput = this.data.formObj.seatInput || {}
    this.data.formObj.seatInput['from'] = e.detail.value.replace(/[^0-9]/g, '')
    this.setData({
      formObj: this.data.formObj
    })
  },
  /**
   * Start 演出价输入框
   */
  extraPriceStartInput(e) {
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
  verifyExtraPrice1(e) {
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
  verifyExtraPrice2(e) {
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
  formatNumber(num) {
    return Math.round(num * 100) / 100
  },
  doViewTap(e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    // 设置cityStorageKey
    if (url === this.data.filterCityUrl) {
      setStorage(this.data.cityStorageKey, JSON.stringify(this.data.formObj.city))
    }
    app.util.commonViewTap(url)
  }
})
