const app = getApp()
const ossTool = require('../../utils/alioss/ossTool.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPersonInfo: true,
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
    showLoading: true,
    dataList: [],
    clickId: '', // 选中的经营体阴影效果
    shadowColor: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 渲染页面
    this.renderPage(options)
    // 获取用户信息
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
  getPcUserInfo: function () {
    let that = this
    let url = app.api.getUserInfo
    let params = {
      UserId: that.data.iyanyiUser.UserId
    }
    app.util.postData.call(that, url, params, 'POST', function(res){
      app.globalData.iyanyiUser.Phone = res.data.Phone
      app.globalData.iyanyiUser.PhoneNumberString = app.util.getPhoneNumberCodeString(res.data.Phone)
      app.globalData.iyanyiUser.NickName = res.data.NickName
      app.globalData.iyanyiUser.Name = res.data.Name
      app.globalData.iyanyiUser.UserName = res.data.UserName
      app.globalData.iyanyiUser.BirthDate = res.data.BirthDate
      app.globalData.iyanyiUser.Email = res.data.Email
      app.globalData.iyanyiUser.IsMale = res.data.IsMale
      app.globalData.iyanyiUser.IsRealChecked = res.data.IsRealChecked
      app.globalData.iyanyiUser.IsUserNameHaveSetted = res.data.IsUserNameHaveSetted
      app.globalData.iyanyiUser.UserPic = res.data.HeadImageUrl
      // 不知道上面的部分还有没有用,先放着了(小程序上部分数据对不上PC的localStorage数据,暂时有什么存什么)
      app.globalData.userData.email = res.data.Email
      app.globalData.userData.headImg = res.data.HeadImageUrl
      app.globalData.userData.isEntityManage = true
      app.globalData.userData.isOrganManage = true
      app.globalData.userData.name = res.data.Name
      app.globalData.userData.phone = res.data.Phone
      app.globalData.userData.userId = that.data.iyanyiUser.UserId
      app.globalData.userData.userName = res.data.UserName
      that.getUserinfo()
      // 需要判断是否选中经营体
      that.shouldChooseEntity()
    })  
  },
  renderPage: function (e) {
    let value = e.show
    if (value === 'qiehuan') {
      this.setData({
        showPersonInfo: false
      })
      wx.setNavigationBarTitle({
        title: '切换',
      })
    }
  },
  shouldChooseEntity: function () {
    let that = this
    console.log(app.globalData.entityInfo.entityID)
    let index = 0
    let rightIndex
    if (app.globalData.entityInfo.entityID) {
      that.data.dataList.forEach(item => {
        if (item.EntityID === app.globalData.entityInfo.entityID) {
          rightIndex = index
        }
        index++
      })
    }
    if (typeof rightIndex === 'number') {
      that.setData({
        shadowColor: true,
        clickId: rightIndex
      })
      console.log(this.data.clickId)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    //首页未登录
    if (!that.data.iyanyiUser.UserId) {
      return false
    }
    that.setData({
      dataList: [],
      showLoading: true,
      hasMore: true
    })
    var params = {
      userID: that.data.iyanyiUser.UserId,
      entityType: 'All',
      pageIndex: 1,
      pageSize: that.data.pageSize
    }
    wx.showNavigationBarLoading()
    that.getOrderList(params, function (res) {
      that.getPcUserInfo()
      that.setData({
        showLoading: false
      })
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      // 一个经营体直接进入
      let entity = res.data.DataRows
      let length = entity.length
      if (that.data.showPersonInfo) {
        if (length === 1) {
          that.storeEntityInfo(entity[0])
          // 存储组织信息
          that.storeOrganInfo(entity[0])
          // 存储员工信息
          that.storeEmployeeInfo(entity[0])
          app.util.commonViewTap('/pages/operaList/operaList', 3)
        }
      }
    })
  },

  inToIndexList:function(e){
    // 选择的经营体有阴影效果
    let that = this
    let cla = e.currentTarget.dataset.index
    console.log(cla)
    that.setData({
      shadowColor: true,
      clickId: cla
    })
    let entity = e.currentTarget.dataset.entity
    // 非切换列表进入才跳转
    if (this.data.showPersonInfo) {
      // 判断是否是剧院
      if (entity.EntityType === 1) { 
        // 剧院
        app.util.commonViewTap('/pages/operaList/operaList', 3)
      } else if (entity.EntityType === 2) {
        // 剧团
        app.util.commonViewTap('/pages/venueList/venueList', 3)
      }
    }
    // 经营体页面暂无,需要将经营体信息存储
    this.storeEntityInfo(entity)
    // 存储组织信息
    this.storeOrganInfo(entity)
    // 存储员工信息
    this.storeEmployeeInfo(entity)
  },
  // 存储经营体信息
  storeEntityInfo: function(entity) {
    app.globalData.entityInfo.entityCover = entity.EntityCoverUrl
    app.globalData.entityInfo.entityID = entity.EntityID
    app.globalData.entityInfo.entityLogo = entity.EntityLogoUrl
    app.globalData.entityInfo.entityName = entity.EntityName
    app.globalData.entityInfo.entityType = entity.EntityType
    app.globalData.entityInfo.saveDataUserId = entity.ManagerUserId
  },
  // 存储组织信息
  storeOrganInfo: function(entity) {
    app.globalData.organInfo.organId = entity.OrganID
    app.globalData.organInfo.organName = entity.OrganName
    app.globalData.organInfo.IsOrganConfirmed = entity.IsOrganConfirmed
  },
  // 存储员工信息
  storeEmployeeInfo: function(entity) {
    let that = this
    let url = app.api.getEmployeeInfo
    let params = {
      userId: that.data.iyanyiUser.UserId,
      entityId: entity.EntityID
    }
    app.util.postData.call(that, url, params, 'GET', function (res) {
      app.globalData.employeeInfo.employeeId = res.data.EmployeeID
      app.globalData.employeeInfo.employeeName = res.data.EmployeeName
      app.globalData.employeeInfo.employeePhoneNumber = res.data.EmployeePhoneNumber
      app.globalData.employeeInfo.employeeEmail = res.data.EmployeeEmail
    })
  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    console.log(url)
    app.util.commonViewTap(url)

    // // 以下为测试oss图片上传的代码
    // wx.chooseImage({
    //   success: function (res) {
    //     var tempFilePaths = res.tempFilePaths
    //     console.log('chooseImage success, temp path is: ', tempFilePaths[0])
    //     ossTool.uploadFile(
    //     {
    //       filePath: tempFilePaths[0],
    //       dir: app.config.ossFilePaths.payimage, // 支付凭证的文件路径
    //       // objectId: 'test.jpg', // 如果指定则使用指定名称。
    //       success: function (res) {
    //         console.log("上传成功,文件地址为:" + res? res.url:'');
    //       },
    //       fail: function (res) {
    //         console.log("上传失败")
    //         if (res&&res.message) {
    //           console.log(res.message);
    //         }
    //       }
    //     })
    //   }
    // })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
    that.onShow()
  },
  // 底部加载
  onReachBottom: function () {
    let that = null
    that = this
    // 还在加载中不执行，没有更多了不执行
    if (!that.data.showLoading && that.data.hasMore) {
      var params = {
        userID: that.data.iyanyiUser.UserId,
        entityType: 'All',
        pageIndex: that.data.pageIndex + 1,
        pageSize: that.data.pageSize
      }
      // wx.showLoading({
      //   title: '加载中'
      // })
      wx.showNavigationBarLoading()
      that.getOrderList(params, function (res) {
        wx.hideNavigationBarLoading()
        // wx.hideLoading()
        wx.stopPullDownRefresh()
        // 需要判断是否选中经营体
        that.shouldChooseEntity()
      })
    }
  },
  getOrderList: function (params, cb) {
    var that = this;
    var url = app.api.getEntitiesByUserIDForPage;
    app.util.postDataList.call(that, url, params, 'GET', cb, function (res) {
      console.log(res)
      wx.hideNavigationBarLoading()
    });
  },
  // 刷新
  refresh: function () {
    this.onShow()
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
  // 解绑
  releaseBtn: function () {
    // 临时测试跳转到用户中心
    // app.util.commonViewTap('/pages/userCenter/userCenter')
    // return

    var that = this;
    wx.showModal({
      title: '解绑微信',
      content: '要解除与微信账号的绑定吗？',
      confirmText: '解绑',
      success: function (res) {
        if (res.confirm) {
          wx.login({
            success: res => {
              that.releaseUser(res.code)
            }
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 解绑操作
  releaseUser: function(wxCode) {
    let that = this
    let url = app.api.unbind
    let params = {
      Code: wxCode
    }
    app.util.postData.call(that, url, params, 'POST',
      function (res) {  // 成功
        console.log(res)
        if (res.statusCode == 200) { // == OK
          
          if (app.globalData) {
            app.globalData.iyanyiUser = undefined          // 清除用户数据
            app.globalData.userData = undefined
            app.globalData.entityInfo = undefined
            app.globalData.employeeInfo = undefined
            app.globalData.organInfo = undefined  
          }
          wx.clearStorageSync()                          // 清理缓存
          app.util.commonViewTap('/pages/login/login')   // 返回登录页面

        } else if (res.statusCode == 460) { // API 请求入参问题，检查 wxCode(临时登录凭证) 是否正确
        } else if (res.statusCode == 461 || res.statusCode == 462) { // 用户不存在或用户为空
        } else if (res.statusCode == 463) {
          // 只能解绑本微信的用户
        } else if (res.statusCode == 464) { // 微信临时凭证过期 - 请确认获取过最近的微信临时登录凭证
          // 返回给上一层，重新调用 wx.login 获取临时凭证然后解绑微信用户。
        } else if (res.statusCode == 500) {
          // 让后台API开发去解决
        } else if (res.statusCode == 500 
                  || res.statusCode == 521 
                  || res.statusCode == 522 
                  || res.statusCode == 524 
                  || res.statusCode == 525) {
          // 让后台API开发去解决
        } else if(res.statusCode == 523) { // 
          // 后台 API 无法访问微信服务器以获取微信会话信息，提示些用户友好的信息
        }
      },
      function (res) {  // 失败
        console.log(res)
      }
    )
  },
  addEntity: function () {
    // this.setData({
    //   showLoading: false,
    //   hasMore: false,
    //   dataList: [{}, {}]
    // })
  },
  // 经营体预览
  jumpToPreview: function () {
  }
})