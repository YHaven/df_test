const app = getApp()
const ossTool = require('../../utils/alioss/ossTool.js');
var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text1: '头像',
    text2: '用户名',
    text3: '姓名',
    text4: '昵称',
    text5: '性别',
    text6: '生日',
    text7: '密码设置',
    text8: '解绑微信',
    text9: '已绑定',
    headImg: '../../images/user-img-default.jpg',
    altHeadImg: '头像',
    altArrowImg: '箭头',
    altWeChat: '已绑定',
    iconImg: '../../images/icon_arrow_right.png',
    wechatImg: '../../images/icon_weixin_green.png',
    userName: '',
    isUserNameHaveSetted: false,
    Name: '',
    nickName: '',
    sex: '',
    birthday: '',
    userInfo: {},
    iyanyiUser: {},
    index: 0,
    array: ['男', '女'],
    isTroupe: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserinfo()
    // 判断用户名是否被修改过
    if (options.UserNameHaveSetted) {
      this.setData({
        isUserNameHaveSetted: true
      })
    }
  },
  getUserinfo: function () {
    if (app.globalData.iyanyiUser) {
      this.setData({
        userInfo: app.globalData.userInfo,
        iyanyiUser: app.globalData.iyanyiUser,
        hasUserInfo: true
      })
      this.renderInfo()
    }
  },
  getPcUserInfo: function () {
    let that = this
    let url = app.api.getUserInfo
    let params = {
      UserId: that.data.iyanyiUser.UserId
    }
    app.util.postData.call(that, url, params, 'POST', function (res) {
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
      // 上面的好像没用了,目前采用userData存储
      // app.globalData.userData.email = res.data.Email
      // app.globalData.userData.headImg = res.data.HeadImageUrl
      // app.globalData.userData.isEntityManage = true
      // app.globalData.userData.isOrganManage = true
      // app.globalData.userData.name = res.data.Name
      // app.globalData.userData.phone = res.data.Phone
      // app.globalData.userData.userId = that.data.iyanyiUser.UserId
      // app.globalData.userData.userName = res.data.UserName
      that.getUserinfo()
    })
  },
  renderInfo: function() {
    let that = this
    let birDateStr = null
    try{ 
      let date = new Date(that.judgeInfoEmpty(app.globalData.iyanyiUser.BirthDate))
      birDateStr = app.globalData.iyanyiUser.BirthDate ? app.util.formatDate(date, 'yyyy-MM-dd'):'未填写'
    } catch (error){
      birDateStr = that.judgeInfoEmpty(app.globalData.iyanyiUser.BirthDate)
    }
    let headImgUrl = '../../images/user-img-default.jpg'
    if (app.globalData.iyanyiUser.UserPic) {
      headImgUrl = app.globalData.iyanyiUser.UserPic
    }
    console.log(this.data.hasUserInfo)
    if (this.data.hasUserInfo) {
      this.setData({
        headImg: headImgUrl,
        userName: that.judgeInfoEmpty(app.globalData.iyanyiUser.UserName),
        name: that.judgeInfoEmpty(app.globalData.iyanyiUser.Name),
        nickName: that.judgeInfoEmpty(app.globalData.iyanyiUser.NickName),
        sex: that.judgeMale(app.globalData.iyanyiUser.IsMale),
        birthday: birDateStr,
        isUserNameHaveSetted: app.globalData.iyanyiUser.IsUserNameHaveSetted
      })
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
      hasMore: true,
      isTroupe: app.globalData.entityInfo.entityType === 2
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
    })
  },
  getOrderList: function (params, cb) {
    var that = this;
    var url = app.api.getEntitiesByUserIDForPage;
    app.util.postDataList.call(that, url, params, 'GET', cb, function (res) {
      console.log(res)
      wx.hideNavigationBarLoading()
    });
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
  // 刷新
  refresh: function () {
    this.onShow()
  },
  // 解绑
  releaseBtn: function () {
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
  releaseUser: function (wxCode) {
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
            app.globalData.iyanyiUser = undefined // 清除用户数据
            app.globalData.userData = undefined
            app.globalData.entityInfo = undefined  
            app.globalData.employeeInfo = undefined  
            app.globalData.organInfo = undefined  
          }
          wx.clearStorageSync()                          // 清理缓存
          app.util.commonViewTap('/pages/login/login', 3)   // 返回登录页面

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
        } else if (res.statusCode == 523) { // 
          // 后台 API 无法访问微信服务器以获取微信会话信息，提示些用户友好的信息
        }
      },
      function (res) {  // 失败
        console.log(res)
      }
    )
  },
  // 设置用户头像
  bindTapHeadImg: function () {
    let that = this
    let imgUrl = ''
    var cb = function (res) {
      let url = app.api.modifyHeadImg
      imgUrl = res.url // 头像
      let params = {
        UserId: app.globalData.iyanyiUser.UserId, // 用户主键
        Name: app.globalData.iyanyiUser.Name, // 用户名
        NickName: app.globalData.iyanyiUser.NickName, // 昵称
        IsMale: app.globalData.iyanyiUser.IsMale, // 性别
        BirthDate: app.globalData.iyanyiUser.BirthDate, // 出生日期
        HeadImageUrl: imgUrl
      }
      app.util.postData.call(that, url, params, 'POST',
        function (res) {  // 成功
          console.log(res)
          app.globalData.iyanyiUser.UserPic = imgUrl
          that.setData({
            headImg: imgUrl
          })
        },
        function (res) {  // 失败
          let errorMsg = res.response
          topMsgTip.show.call(that, errorMsg, 1500)
        }
      )
    }
    var fail_cb = function (res) {
      that.setData({
        errorMsg: '上传头像失败,请重新上传'
      })
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log('chooseImage success, temp path is: ', tempFilePaths[0])
        ossTool.uploadFile(
          {
            filePath: tempFilePaths[0],
            dir: app.config.ossFilePaths.userlogo, // 用户头像的文件夹路径
            success: function (res) {
              console.log("上传成功,文件地址为:" + res ? res.url : '');
              cb(res)
            },
            fail: function (res) {
              if (res) {
                console.log(res);
              }
              fail_cb(res)
            }
          })
      }
    })
  },
  // 跳转用户名页面
  bindTapUserName: function() {
    if(app.globalData.iyanyiUser.IsUserNameHaveSetted) {
      return
    }
    app.util.commonViewTap('/pages/userUserName/userName')
  },
  // 跳转姓名页面
  bindTapName: function() {
    app.util.commonViewTap('/pages/userName/name')
  },
  // 跳转昵称页面
  bindTapNickName: function() {
    app.util.commonViewTap('/pages/userNickName/nickName')
  },
  // 跳转密码设置页面
  bindTapPwSet: function() {
    app.util.commonViewTap('/pages/userPwSet/passwordSetting')
  },
  // 性别弹出
  bindTapSex: function(e) {
    let that = this
    let url = app.api.modifyMale
    console.log(e.detail.value)
    let value = Number(e.detail.value) === 0 ? 1 : 0
    console.log(value)
    let params = {
      UserId: app.globalData.iyanyiUser.UserId, // 用户主键
      Name: app.globalData.iyanyiUser.Name, // 用户名
      NickName: app.globalData.iyanyiUser.NickName, // 昵称
      IsMale: value, // 性别
      BirthDate: app.globalData.iyanyiUser.BirthDate, // 出生日期
      HeadImageUrl: app.globalData.iyanyiUser.UserPic // 头像
    }
    app.util.postData.call(that, url, params, 'POST',
      function (res) {  // 成功
        console.log(res)
        app.globalData.iyanyiUser.IsMale = value
        that.renderInfo()
      },
      function (res) {  // 失败
        let errorMsg = res.response
        topMsgTip.show.call(that, errorMsg, 1500)
      }
    )
  },
  // 生日弹出
  bindTapBirth: function(e) {
    let that = this
    let url = app.api.modifyBirthday
    let value = e.detail.value
    let params = {
      UserId: app.globalData.iyanyiUser.UserId, // 用户主键
      Name: app.globalData.iyanyiUser.Name, // 用户名
      NickName: app.globalData.iyanyiUser.NickName, // 昵称
      IsMale: app.globalData.iyanyiUser.IsMale, // 性别
      BirthDate: value, // 出生日期
      HeadImageUrl: app.globalData.iyanyiUser.UserPic // 头像
    }
    app.util.postData.call(that, url, params, 'POST',
      function (res) {  // 成功
        console.log(res)
        app.globalData.iyanyiUser.BirthDate = value
        that.renderInfo()
      },
      function (res) {  // 失败
        let errorMsg = res.response
        topMsgTip.show.call(that, errorMsg, 1500)
      }
    )
  },
  // 判断用户信息是否为空,判断用户性别
  judgeInfoEmpty: function(e) {
    if (!e) {
      return '未填写'
    } else {
      return e
    }
  },
  judgeMale: function(e) {
    // console.log(e)
    if (!e) {
      return '女'
    } else {
      return '男'
    }
  }
})