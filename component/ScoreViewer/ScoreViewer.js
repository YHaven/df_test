// component/ScoreViewer/ScoreViewer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 分数
     */
    score: {
      type: Number,
      value: 5
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowDetail: false,
    /**
     * 每个分位上的图像源地址数组
     */
    scoreImageSrcs: [],
    image1Src: '../../images/guozhang1.png', // 1分图片
    image0Src: '../../images/guozhang0.png', // 0分图片
    image05Src: '../../images/guozhang0.5.png'  // 0.5分图片
  },
  attached: function () {
    // 根据分值大小设置图片的src
    let src1 = this.data.image1Src
    let src0 = this.data.image0Src
    let src05 = this.data.image05Src
    // 分数按0.5规整
    let dScore = this.data.score
    if (dScore < 0 ) {
      dScore = 0
    } else if (dScore > 5 ) {
      dScore = 5
    }
    dScore = parseInt(dScore / 0.5) * 0.5
    this.data.scoreImageSrcs = [] //置空图片源
    do {
      if (dScore >= 1) {
        this.data.scoreImageSrcs.push(src1)
        dScore = dScore -1
      } else if (dScore >= 0.5){
        this.data.scoreImageSrcs.push(src05)
        dScore = dScore - 0.5
      }
    } while (dScore >= 0.5)
    while (this.data.scoreImageSrcs.length < 5) {
      this.data.scoreImageSrcs.push(src0)
    }
    this.setData({
      scoreImageSrcs: this.data.scoreImageSrcs
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 显示或隐藏分值详情
     */
    showDetail: function () {
      this.setData({
        isShowDetail: !this.data.isShowDetail
      })
    }
  }
})
