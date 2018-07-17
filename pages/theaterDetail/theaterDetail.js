// pages/theaterDetail/theaterDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 剧院Id
    theaterId: undefined,
    theaterInfo: {
      Name: '内蒙古自治区呼伦贝尔人民政府民族1212dsa是大大大撒歌舞剧院',
      ShowTypeStr: '话剧/歌剧/音乐剧/芭蕾/舞剧/...',
      PerformanceUseLinkerTel: '18989485739',
      PerformanceUseLinker: '张师傅',
      RatingDescription: { RatingValue: 4.9, RatingDescription: "评价很好" },
      FullAddress: '安徽省合肥市合肥大剧院(东门)'
    },
    showVenue: false, //是否显示全部剧场标签页
    hasMore: false,
    defaultImg: app.config.defaultImg,
    // venueList: [],
    venueList: [
      {
        Name: '世界经典原版音乐剧《猫》Cats +百老汇浪漫音乐剧《I Do！I Do！》中文版+外百老外百老外百查实的sad计划是的哈USD',
        MinShowPrice: 40000,
        IsFixPrice: false,
        IsIncomeShare: true,
        IsPublished: true
      },
      {
        Name: '12121世界经典原版音乐剧《猫》Cats +百老汇浪漫音乐剧《I Do！I Do！》中文版+外百老外百老外百查实的sad计划是的哈USD',
        MinShowPrice: 40000,
        IsFixPrice: true,
        IsIncomeShare: false,
        IsPublished: true
      },
      {
        Name: '世界经典原版音乐剧《猫》Cats +百老汇浪漫音乐剧《I Do！I Do！》中文版+外百老外百老外百查实的sad计划是的哈USD',
        MinShowPrice: 40000,
        IsPublished: false
      },
    ], // 剧场列表
    // 富文本信息
    richIntro: {
      title: '简介',
      hasValue: true, // 是否有值
      isExpand: true, // 是否已展开
      richInfo: '<p>大飒飒da<span style="color: #FF0000;">DW1</span>1212</p><p>2323DSAD</p><p><img src="https://res.52drama.com/UE/upload/66318d03-7166-4b86-9803-e75e4d5e21f0/image/20180716/6366733517841859926414730.jpg" alt="Logo.jpg"/></p>'// 富文本信息
    },
    richQualification: {
      title: '资质',
      hasValue: true,
      isExpand: true,
      nodes: {}
    },
    richHonor: {
      title: '荣誉',
      hasValue: true,
      isExpand: true,
      nodes: {}
    },
    richHrInfo: {
      title: '人力资源',
      hasValue: true,
      isExpand: true,
      nodes: {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.id) {
      that.setData({
        theaterId: options.id
      })
    }
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

  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
    that.onShow()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  // 获取剧院详情信息
  gettheaterDetail: function () {

  },
  // 切换Tab页显示
  doSwitch: function (e) {
    var data = e.currentTarget.dataset;
    this.setData({
      showVenue: data.isshowvenue === 'true' ? true : false
    })
  },
  showRichText: function (e) {
    let that = this
    var data = e.currentTarget.dataset;
    if (data.item === '简介') {
      this.setData({
        richIntro: {
          isExpand: !this.data.richIntro.isExpand // 展开收起
        }
      })
    } else if (data.item === '资质') {
      this.setData({
        richQualification: {
          hasValue: richQualification.hasValue,
          isExpand: !richQualification.isExpand, // 展开收起
          nodes: richQualification.nodes// 富文本信息
        }
      })
    } else if (data.item === '荣誉') {
      this.setData({
        richHonor: {
          hasValue: richHonor.hasValue,
          isExpand: !richHonor.isExpand, // 展开收起
          nodes: richHonor.nodes// 富文本信息
        }
      })
    } else if (data.item === '人力资源') {
      this.setData({
        richHrInfo: {
          hasValue: richHrInfo.hasValue,
          isExpand: !richHrInfo.isExpand, // 展开收起
          nodes: richHrInfo.nodes// 富文本信息
        }
      })
    }
  },
  /**
   * 拨打电话
   */
  callTel: function (e) {
    var data = e.currentTarget.dataset;
    if (data.telnumber) {
      wx.makePhoneCall({
        phoneNumber: data.telnumber
      })
    }
  }
})