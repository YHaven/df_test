// component/PreviewImage/PreviewImage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    indicatorDots: {
      type: Boolean,
      value: false
    },
    indicatorColor: {
      type: String,
      value: 'rgba(0, 0, 0, 0.3)'
    },
    indicatorActiveColor: {
      type: String,
      value: '#000'
    },
    autoplay: {
      type: Boolean,
      value: false
    },
    interval: {
      type: Number,
      value: 5000
    },
    duration: {
      type: Number,
      value: 500
    },
    photos: {
      type: Array,
      value: [
        {
          id: '1111111',
          title: 'test',
          src: 'http://bpic.588ku.com/element_origin_min_pic/16/10/30/528aa13209e86d5d9839890967a6b9c1.jpg',
          info: 'dsfsdfsd对方第三方第三方士大夫'
        },
        {
          id: '22222',
          title: 'test',
          src: 'http://bpic.588ku.com/element_origin_min_pic/16/10/30/528aa13209e86d5d9839890967a6b9c1.jpg',
          info: 'dsfsdfsd对方第三方第三方士大夫'
        },
        {
          id: '33333',
          title: 'test',
          src: 'http://bpic.588ku.com/element_origin_min_pic/16/10/30/62e3ca3a02dddb002eff00482078d194.jpg',
          info: 'dsfsdfsd对方第三方第三方士大夫'
        },
        {
          id: '44444',
          title: 'test',
          src: 'http://bpic.588ku.com/element_origin_min_pic/16/10/31/c7167fcfb4ebcd12621c05b0c852e98e.jpg',
          info: 'dsfsdfsd对方第三方第三方士大夫'
        },
        {
          id: '55555',
          title: 'test',
          src: 'http://bpic.588ku.com/element_origin_min_pic/16/10/30/528aa13209e86d5d9839890967a6b9c1.jpg',
          info: 'dsfsdfsd对方第三方第三方士大夫'
        },
      ]
    },
    id: {
      type: String,
      value: 'previewImage'
    },
    isOpen: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindchange (e) {
      this.setData({
        current: e.detail.current + 1
      })
    },
    noMaopao () {
      return false
    },
    closePhotoBox (e) {
      this.setData({
        isOpen: false
      })
    },
    openPhotoBox(){
      this.setData({
        isOpen: true
      })
    },
    disabledPullDown () {
      return false
    }
  }
})
