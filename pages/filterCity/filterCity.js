// pages/filterCity/filterCity.js
import { lists } from './allCitys.js'
import { setStorage, getStorage, removeStorage } from '../../utils/common/storage.js'
var timer = null
var timer_scroll = null
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 所有城市
    allCitys: lists,
    // 所有存在的字母
    letters: lists.map(e => e.GroupName),
    // 选中的城市
    selectedCitys: [],
    // 头部字母显示
    title_selected_show: 'A',
    // 用于导航
    scrollIntoView: 'A',
    // 标记当前所在的字母区域
    selected_letter: 'A',
    StorageKey: 'FilterCity',
    isFolder: false,
    marginTop: 265,
    rpxTopx: Math.round(app.globalData.systemInfo.windowWidth / 750*100)/100  // 70rpx * rpxTopx
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选择城市',
    })
    if (options.key) {
      this.data.StorageKey = options.key
    }
    try{
      this.data.selectedCitys = JSON.parse(getStorage(this.data.StorageKey))
    }catch(e){}
    // 标记选中城市
    this.data.selectedCitys.filter(city => {
      var group = null;
      for (var i = 0; i < this.data.allCitys.length; i++) {
        if (this.data.allCitys[i].GroupName === city.StartLetter) {
          group = this.data.allCitys[i]
          break
        }
      }
      if (group === null) return false
      var c = null;
      for (var j = 0; j < group.Citys.length; j++) {
        if (group.Citys[j].CityCode === city.CityCode) {
          c = group.Citys[j]
          break
        }
      }
      if (c === null) return false
      c.IsSelected = true
      return true
    })
    var scrollViewHeight = Math.round(app.globalData.systemInfo.windowHeight - 265 * this.data.rpxTopx)
    this.setData({
      scrollViewHeight,
      hover_selected_show: this.data.letters.map(()=>0),
      selectedCitys: this.data.selectedCitys,
      allCitys: this.data.allCitys
    })
  },
  switchSelectedCity () {
    if (this.data.isFolder) {
      // 折叠
      this.setData({
        isFolder: !this.data.isFolder,
        marginTop: 265,
        scrollViewHeight: Math.round(app.globalData.systemInfo.windowHeight - 265 * this.data.rpxTopx)
      })
    } else {
      // 展开
      this.setData({
        isFolder: !this.data.isFolder,
        marginTop: 50,
        scrollViewHeight: Math.round(app.globalData.systemInfo.windowHeight - 50 * this.data.rpxTopx)
      })
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.util.commonShareAppMessage()
  },
  // 侧边字母点击事件
  tabLetter(e) {
    const index = e.currentTarget.dataset.index;
    const pos = this.data.letters.indexOf(index)
    this.setData({
      selected_letter: index,
      scrollIntoView: index,
      hover_selected_show: this.data.hover_selected_show.map((v, i) => i === pos ? 1 : 0)
    })

    this.cleanAcitvedStatus(pos);
  },
  // 清除字母选中状态
  cleanAcitvedStatus(pos) {
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      this.data.hover_selected_show[pos] = 0
      this.setData({
        hover_selected_show: this.data.hover_selected_show
      })
      timer = null
    }, 1000);
  },
  clickCity (e) {
    var city = e.currentTarget.dataset.city
    var group = null;
    for(var i = 0; i < this.data.allCitys.length; i++) {
      if (this.data.allCitys[i].GroupName === city.StartLetter) {
        group = this.data.allCitys[i]
        break
      }
    }
    if (group === null) {
      return
    }
    var c = null;
    for(var j = 0; j < group.Citys.length; j++) {
      if (group.Citys[j].CityCode === city.CityCode) {
        c = group.Citys[j]
        break
      }
    }
    if (c === null) {
      return
    }
    var _selectedCitys = this.data.selectedCitys.filter(e => e.CityCode !== city.CityCode);
    if (_selectedCitys.length === this.data.selectedCitys.length) {
      if (this.data.selectedCitys.length >= 5) {
        return
      }
      c.IsSelected = true
      this.data.selectedCitys.push(city)
      this.setData({
        selectedCitys: this.data.selectedCitys,
        allCitys: this.data.allCitys
      })
    } else {
      c.IsSelected = false
      this.setData({
        selectedCitys: _selectedCitys,
        allCitys: this.data.allCitys
      })
    }
  },
  clickClear (e) {
    // var city = Object.assign({}, e.currentTarget.dataset.city)
    // this.setData({
    //   selectedCitys: this.data.selectedCitys.filter(e => e.CityCode !== city.CityCode)
    // })
    this.clickCity(e)
  },
  bindscroll (e) {
    if (timer_scroll !== null) {
      clearTimeout(timer_scroll)
      timer_scroll = null
    }
    timer_scroll = setTimeout(()=>{
      var pos = e.detail.scrollTop
      var pre = 0
      for (var i = 0; i < this.data.allCitys.length; i++) {
        var cur = this.computePos(pre, i + 1)
        if (pos >= pre && pos < cur) {
          if (this.data.selected_letter !== this.data.allCitys[i].GroupName) {
            this.setData({
              selected_letter: this.data.allCitys[i].GroupName,
            })
          }
          break
        } else {
          pre = cur
        }
      }
    }, 100)
  },
  computePos(pre, idx) {
    if (idx === 0) {
      return 0
    }
    var pos = pre + this.data.allCitys[idx - 1].Citys.length * Math.floor(90 * this.data.rpxTopx) + Math.floor(50 * this.data.rpxTopx)
    return pos
  },
  onUnload(){
    setStorage(this.data.StorageKey, JSON.stringify(this.data.selectedCitys))
  }
})