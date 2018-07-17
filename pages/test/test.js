// pages/test/test.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: '请输入名称',
    df_input_class: 'aa',
    df_input_style: 'background: red;',
    id: '',
    range: [['a','b'],['c','d']],
    photoBoxId: 'photoBoxId',
    nodes: JSON.parse('[{"name":"p","attrs":{"style":"color:red;"},"children":[{"type":"text","text":"地方大幅度付费的沙大道所大所多"}],"type":"node"},{"name":"p","children":[{"name":"img","attrs":{"src":"https://res.52drama.com/UE/upload/66318d03-7166-4b86-9803-e75e4d5e21f0/image/20180613/6366449466274476382818788.jpg","alt":"3885730_124701000519_2.jpg"},"type":"node"}],"type":"node"}]')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  clickClear (e) {
    console.log(e)
  },
  change (e, opt) {
    console.log(e, opt)
  }, 
  bindsearch (e) {
    console.log(e)
  },
  openPhotoBox(){
    this.selectComponent("#" + this.data.photoBoxId).openPhotoBox()
  },
  testToast: function () {
    this.selectComponent('#topMsgTips').success('中文呢')
  }
})