const app = getApp()
var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorMsg: false,
    netTimeOut: false,
    showGoTop: false,
    defaultImg: app.config.defaultImg,
    userImgUrl: app.config.userImgUrl,
    userInfo: {},
    iyanyiUser: {},
    hasUserInfo: false,
    hasMore: true,
    pageSize: 10,
    pageIndex: 1,
    showLoading: true,
    dataList: [],
    applyJoinShow: false,
    placeholderSearch: '',
    noDataText: '',
    searchValue: '',
    searchType: '',
    entityInfo: {},
    joinUserName: '',
    joinEntityPicError: '../../images/entityImgError340X212.jpg',
    resHost: app.config.resourceHost,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderPage(options)
    this.getUserinfo()
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
  renderPage: function (e) {
    let value = e.e
    this.setData({
      searchType: value
    })
    if (value === 'juyuan') {
      this.setData({
        placeholderSearch: '搜索剧院',
        noDataText: '没有找到相关剧院'
      })
      wx.setNavigationBarTitle({
        title: '加入剧院' || '剧汇王朝POMS',
      })
    } else {
      this.setData({
        placeholderSearch: '搜索剧团',
        noDataText: '没有找到相关剧团'
      })
      wx.setNavigationBarTitle({
        title: '加入剧团' || '剧汇王朝POMS',
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      showLoading: true,
      hasMore: true,
      dataList:[],
    })
    this.bindsearch()
  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  // 刷新
  refresh: function () {
    this.onShow()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
    that.onShow()
  },
  // 底部加载
  onReachBottom: function () {
    console.log('下拉加载')
    var that = this
    // 还在加载中不执行，没有更多了不执行
    if (!that.data.showLoading && that.data.hasMore) {
      let that = this
      let value = this.data.searchValue
      let url = app.api.getSimilarNameEntity
      let entityType = that.getEntityTypeCnNameByEparams(this.data.searchType)
      let params = {
        userID: app.globalData.iyanyiUser.UserId,
        entityName: value,
        entityType: entityType,
        pageSize: that.data.pageSize,
        pageIndex: that.data.pageIndex + 1
      }
      console.log(that.data.pageIndex)
      // wx.showLoading({
      //   title: '加载中'
      // })
      wx.showNavigationBarLoading()
      that.getOrderList(params, function (res) {
        wx.hideNavigationBarLoading()
        // wx.hideLoading()
        wx.stopPullDownRefresh()
      })
    }
  },
  getOrderList: function (params) {
    var that = this;
    var url = app.api.getSimilarNameEntity;
    var oldList = [];
    if (that.data.pageIndex !== 1) {
      oldList = that.data.dataList
    }
    app.util.postDataList.call(that, url, params, 'GET', function(res) {
      wx.hideNavigationBarLoading()
      // wx.hideLoading()
      let dataList = that.data.dataList
      dataList.forEach(item => {
        // console.log(item)
        if (item.EntityCoverUrl){
          item.EntityCoverUrlFomat = that.data.resHost + item.EntityCoverUrl
        }
        if (item.EntityLogoUrl) {
          item.EntityLogoUrlFomat = that.data.resHost + item.EntityLogoUrl
        }
        // if (item && (item.EntityCoverUrl || item.EntityLogoUrl)) {
        //   let EntityCoverUrl = item.EntityCoverUrl
        //   let EntityLogoUrl = item.EntityLogoUrl
        //   if (item.EntityCoverUrl && EntityCoverUrl.indexOf('52drama.com') === -1) {
        //     item.EntityCoverUrl = that.data.resHost + item.EntityCoverUrl
        //   }
        //   if (item.EntityLogoUrl && EntityLogoUrl.indexOf('52drama.com') === -1) {
        //     item.EntityLogoUrl = that.data.resHost + item.EntityLogoUrl
        //   }
        // }
      })
      // that.data.dataList = oldList.concat(that.data.dataList)
      that.setData({
        dataList: dataList
      })
      wx.stopPullDownRefresh()
    }, function (res) {wx.hideNavigationBarLoading()})
    // console.log(newDataList)
    // 在显示前就将需要的resHost加在url上 
  },
  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
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
  // 申请加入对话框
  applyJoin: function (e) {
    let entity = e.currentTarget.dataset.entity
    this.setData({
      entityInfo: entity,
      applyJoinShow: true
    })
  },
  // 申请加入
  confirmApplyJoin: function (e) {
    let that = this
    // ajax
    let url = app.api.joinEntity
    let entity = this.data.entityInfo
    let value = this.data.joinUserName
    if (!value) {
      let errorMsg = '姓名不能为空'
      topMsgTip.show.call(that, errorMsg, 1500)
    } else if (value.length > 50) {
      let errorMsg = '申请人姓名长度不能超过50'
      topMsgTip.show.call(that, errorMsg, 1500)
    } else {
      let params = {
        OrganRawId: entity.OrganID, // 组织id
        EntityRawId: entity.EntityID, // 经营体id
        UserRawId: this.data.iyanyiUser.UserId, // 申请人的用户id
        FullName: value, // 申请人的姓名
        PhoneNumber: app.globalData.iyanyiUser.Phone, // 电话号码
        SrcAppType: 1, // 1 = 微信小程序
      }
      app.util.postData.call(that, url, params, 'POST',
        function (res) {  // 成功
          that.applyJoinToIng(entity)
          that.setData({
            applyJoinShow: false
          })
        },
        function (res) {  // 失败
          let errorMsg = res.response
          topMsgTip.show.call(that, errorMsg, 1500)
        }
      )    
    }
  },
  // 申请加入绑定姓名
  joinBindUserName: function(e) {
    let value = e.detail.value
    this.setData({
      joinUserName: value
    })
  },
  // 申请加入对话框取消
  cancelApplyJoin: function(e){
    this.setData({
      applyJoinShow: false
    })
  },
  // 搜索函数
  bindsearch: function(e) {
    let that = this
    let value
    this.data.pageIndex = 1
    if (e) {
      value = e.detail.value
      this.setData({
        searchValue: value
      })
    } else {
      value = this.data.searchValue
    }
    console.log(value)
    if (!value) {
      that.setData({
        dataList: []
      })
    } else {
      let url = app.api.getSimilarNameEntity
      let type = this.data.searchType
      let entityType = that.getEntityTypeCnNameByEparams(this.data.searchType)
      let params = {
        userID: app.globalData.iyanyiUser.UserId,
        entityName: value,
        entityType: entityType,
        pageSize: that.data.pageSize,
        pageIndex: 1
      }
      app.util.postData.call(that, url, params, 'GET',
        function (res) {  // 成功
          let newDataList = res.data.DataRows
          // 在显示前就将需要的resHost加在url上
          newDataList.forEach(item => {
            if (item && (item.EntityCoverUrl || item.EntityLogoUrl)) {
              if (item.EntityCoverUrl) {
                item.EntityCoverUrl = that.data.resHost + item.EntityCoverUrl
              } 
              if (item.EntityLogoUrl) {
                item.EntityLogoUrl = that.data.resHost + item.EntityLogoUrl
              }
            }
          })
          console.log(newDataList)
          that.setData({
            dataList: newDataList
          })
          // 判断是否有更多数据
          let length = newDataList.length
          if (length < 10) {
            that.setData({
              hasMore: false
            })
          } else {
            that.setData({
              hasMore: true
            })
          }
          that.setData({
            showLoading: false
          })
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        },
        function (res) {  // 失败
          let errorMsg = res.response
          wx.stopPullDownRefresh()
          topMsgTip.show.call(that, errorMsg, 1500)
        }
      )
    }
  },
  // 判断搜索剧院还是剧团
  getEntityTypeCnNameByEparams: function(enterEntity) {
    let ret = 'ALL'
    if (enterEntity === 'all') {
      ret = 'ALL'
    }
    if (enterEntity === 'juyuan') {
      ret = '剧院'
    }
    if (enterEntity === 'jutuan') {
      ret = '剧团'
    }
    return ret
  },
  // 图片加载错误
  errorImg: function (e) {
    var _errImg = e.target.dataset.errorsrc
    var _objImg = "'" + _errImg + "'"
    var _errObj = {}
    _errObj[_errImg] = this.data.joinEntityPicError
    this.setData(_errObj)
  },
  // 申请加入改成申请中
  applyJoinToIng: function (entity) {
    let that = this
    let newData = {}
    newData = that.data.dataList
    newData.forEach(item => {
      if (item.EntityID === entity.EntityID) {
        item.EntiyAndUserRelation = 1
      }
    })
    that.setData({
      dataList: newData
    })
  },
})