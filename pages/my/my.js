const app = getApp()
var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({
  data: {
    headImg: '../../images/user-img-default.jpg',
    altHeadImg: '头像',
    userName: 'ougege',
    text1: '预约剧目单',
    text2: '场厅受约单',
    text3: '切换',
    itemText1: '待审核',
    itemText2: '待支付',
    itemText3: '待确认',
    itemText4: '待评价',
    itemText5: '全部',
    altArrowImg: '箭头',
    iconImg: '../../images/icon_arrow_right.png',
    isTroupe: true, // 是否剧团
    entityDisabled: false // 有权限
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow () {
    // 改变title
    wx.setNavigationBarTitle({
      title: app.globalData.entityInfo.entityName
    })
    // 设置下面的导航栏显示剧院或剧团模式
    this.setData({
      isTroupe: app.globalData.entityInfo.entityType === 2
    })
  },
  // 切换跳转经营体列表
  jumpEntityList: function(e) {
    app.util.commonViewTap('/pages/entityList/entityList?show=' + e.currentTarget.dataset.id)
  },
  // 跳转用户中心
  jumpToUserCenter: function(e) {
    app.util.commonViewTap('/pages/userCenter/userCenter')
  },
  // 跳转预约单
  jumpOperaOrder: function () {
    if (this.data.isTroupe) {
      // 预约场厅单
    } else {
      // 预约剧目单
    }
  },
  // 跳转受约单
  jumpOperaOrderBy: function () {
    if (this.data.isTroupe) {
      // 剧目受约单
    } else {
      // 场厅受约单
    }
  },
  // 跳转我的经营体(剧院或剧团)
  jumpMyEntity: function () {
    let that = this
    let url = app.api.GetOrganEntityByEntityID
    let params = {
      entityId: that.data.iyanyiUser.UserId
    }
    app.util.postData.call(that, url, params, 'GET', function (res) {
      if (res.IsEntityDisabled) {
        that.setData({
          entityDisabled: true
        })
      } else {
        if (that.data.isTroupe) {
          app.util.commonViewTap('/pages/operaOrderList/operaOrderList') // 剧团
        } else {
          app.util.commonViewTap('/pages/operaOrderList/operaOrderList') // 剧院
        }
      }
    })
  }
})