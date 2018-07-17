// pages/searchOperaList/searchOperaList.js
const app = getApp()
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    height: app.globalData.systemInfo.windowHeight,
    isPreSpace: true,
    dataList: {
      items: [],
      troupes: []
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.entityInfo.entityName || '剧汇王朝POMS',
    })
    if (options.key) {
      this.data.keyword = options.key
    }
    this.setData({
      keyword: this.data.keyword,
      dataList: {
        items: [],
        troupes: []
      },
      canChange: true
    })
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
    this.bindchange({ detail: { value: this.data.keyword } })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.util.commonShareAppMessage()
  },
  bindchange(e) {
    let that = this
    that.setData({
      keyword: e.detail.value
    })
    if (!e.detail.value.trim()) {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
      that.setData({
        isPreSpace: true,
        dataList: {
          items: [],
          troupes: []
        }
      })
      return
    }

    var callback = function () {
      if (!that.data.canChange) return
      let url = app.api.TheaterVenueQuickQuery
      let parms = { QueryName: e.detail.value.trim(), VenueTipCount: 5, TheaterTipCount: 5 }
      wx.showNavigationBarLoading()
      that.data.canChange = false
      app.util.postData.call(that, url, parms, 'POST',
        function (res) {
          wx.hideNavigationBarLoading()
          that.data.canChange = true
          if (res.statusCode == 200) {
            try {
              that.setData({
                isPreSpace: false,
                dataList: { items: res.data.TipVenues, troupes: res.data.TipTheaters }
              })
            } catch (e) { console.log(e) }

          } else {
            console.log(res);
          }
        },
        function (err) { wx.hideNavigationBarLoading(); that.data.canChange = true; });
    }
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(callback, 500)
  },
  cancel() {
    wx.navigateBack()
  },
  bindconfirm(e) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.data.searchForm.QueryName = e.detail.value
    prevPage.data.searchForm.SpecifyVenueId = ''
    prevPage.data.searchForm.SpecifyTheaterId = ''
    prevPage.data.isRefresh = true
    app.util.commonViewTap('', 99)
  },
  selectedItem(e) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.data.searchForm.QueryName = e.currentTarget.dataset.name
    if (e.currentTarget.dataset.type === 'item') {
      prevPage.data.searchForm.SpecifyVenueId = e.currentTarget.dataset.id
      prevPage.data.searchForm.SpecifyTheaterId = ''
    } else if (e.currentTarget.dataset.type === 'troupe') {
      prevPage.data.searchForm.SpecifyVenueId = ''
      prevPage.data.searchForm.SpecifyTheaterId = e.currentTarget.dataset.id
    }
    prevPage.data.isRefresh = true
    app.util.commonViewTap('', 99)
  }
})