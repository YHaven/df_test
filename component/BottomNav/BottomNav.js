// component/BottomNav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navActive:{
      type: String,
      value: '1'
    },
    isTroupe: {
      type: Boolean,
      value: false,
      observer: '_changeIsTroupe'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    urls: [
      '/pages/operaList/operaList',
      '/pages/scheduleBoard/scheduleBoard',
      '/pages/myMatters/myMatters',
      '/pages/my/my'
    ],
    titles: ['剧目', '档期', '事项', '我的'],
    icons: ['icon-wode1', 'icon-dangqi', 'icon-school-dbsx-web', 'icon-wode2']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    doNavViewTap:function(e){
      let pages = getCurrentPages()
      let thisRoute = '/'+pages[pages.length - 1].route
      
      var data = e.currentTarget.dataset;
      var url = data.url
      if (thisRoute != url){
        wx.reLaunch({
          url
        })
      }
    },
    _changeIsTroupe (newVal, oldVal) {
      if (newVal) {
        this.setData({
          // TODO: 四个主页的路径
          urls: [
            '/pages/venueList/venueList',
            '/pages/scheduleBoard/scheduleBoard',
            '/pages/myMattersForTroupe/myMattersForTroupe',
            '/pages/my/my'
          ],
          // TODO: 四个标题
          titles: ['场厅', '档期', '事项', '我的'],
          // TODO: icon
          icons: ['icon-wode1', 'icon-dangqi', 'icon-school-dbsx-web', 'icon-wode2']
        })
      } else {
        this.setData({
          urls: [
            '/pages/operaList/operaList',
            '/pages/scheduleBoard/scheduleBoard',
            '/pages/myMatters/myMatters',
            '/pages/my/my'
          ],
          titles: ['剧目', '档期', '事项', '我的'],
          icons: ['icon-wode1', 'icon-dangqi', 'icon-school-dbsx-web', 'icon-wode2']
        })
      }
    }
  }
})
