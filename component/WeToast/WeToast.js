// 默认配置
var TOAST_CONFIG = {
  // 动画时间
  duration: 200,
  // 隐藏卡片时间
  delay: 1500,
  // 默认卡片背景颜色
  defaultBG: 'linear-gradient(-135deg, #e64340 0%, #e64340 100%)',
};

// 消息队列
var MSG_QUEUE = [];

// 消息队列
var MsgQueue = [];

// 是否正在显示
var IS_SHOW = false;

// 是否正在隐藏
var IS_HIDE = false;

// 隐藏卡片时间器
var HIDDEN_TIMMER = null;

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    _showAnimation: null,
    _hideAnimation: null,
    msgId: 0,
    MsgQueue: [],
    toastQueue: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initToast: function() {
      // this._hide();
      // 配置动画
      let animation = wx.createAnimation({
        duration: TOAST_CONFIG['duration'],
        timingFunction: 'ease'
      });

      // 显示动画数据
      animation.opacity(1).translateY(35).step();
      this.data._showAnimation = animation.export();

      // 隐藏动画数据
      animation.opacity(0).translateY(-35).step();
      this.data._hideAnimation = animation.export();
    },
    /**
     * 添加消息到队列
     * opt = {content, title, style}
     */
    _addMsg: function(msg) {
      let newMsgId = this.data.msgId + 1
      if (newMsgId === 100) {
        newMsgId = 1
      }
      MsgQueue.push({
        msgid: newMsgId,
        icon: msg.icon,
        title: msg.title,
        content: msg.content,
        background: msg.style || TOAST_CONFIG['defaultBG'],
        animation: this.data._showAnimation
      })
      this.setData({
        msgId: newMsgId
      })
      this._showMsg()

    },
    _showMsg: function() {
      let toastQueue = MsgQueue
      this.setData({
        toastQueue: toastQueue
      })
      IS_SHOW = true
      setTimeout(
        this._hideMsg.bind(this),
        TOAST_CONFIG['delay'] + TOAST_CONFIG['duration']
      )
    },
    _hideMsg: function() {
      const toastQueue = MsgQueue
      const Msg = MsgQueue.shift()
      Msg.animation = this.data._hideAnimation
      if (MsgQueue.length<=0) {
        
        this.setData({
          toastQueue: [Msg]
        })
        return false
      }
      this.setData({
        toastQueue: toastQueue
      })
      

      // setTimeout(() => {
      //     IS_SHOW = false
      //     this._showMsg()
      //   },
      //   TOAST_CONFIG['duration']
      // );

    },
    _add: function(opt) {
      MSG_QUEUE.push({
        icon: opt['icon'],
        title: opt['title'],
        content: opt['content'],
        boxBG: opt['style'] || TOAST_CONFIG['defaultBG'],
        animation: this.data._showAnimation
      });
      // 如果没在显示，则显示
      if (!IS_SHOW) {
        this._show();
      }
    },

    /**
     * 显示消息
     */
    _show: function() {
      const msg = MSG_QUEUE.shift();
      if (!msg) return;

      this.setData({
        totastOpt: msg
      });
      IS_SHOW = true;

      HIDDEN_TIMMER = setTimeout(
        this._hide.bind(this),
        TOAST_CONFIG['delay'] + TOAST_CONFIG['duration']
      );
    },

    /**
     * 隐藏消息
     */
    _hide: function() {
      if (HIDDEN_TIMMER) {
        clearTimeout(HIDDEN_TIMMER);
      }
      this.setData({
        totastOpt: {
          title: '',
          content: '',
          boxBG: TOAST_CONFIG.defaultBG,
          animation: this.data._hideAnimation
        }
      });
      // 200ms后调用_show
      setTimeout(() => {
        IS_SHOW = false;
        this._show();
      }, TOAST_CONFIG['duration']);
    },

    /**
     * 成功消息
     */
    success: function(content, title = '') {
      this.initToast()
      this._addMsg({
        title,
        content,
        // icon: 'ok',
        // style: 'linear-gradient(-135deg, #429321 0%, #e64340 100%)'
      })
    },

    /**
     * 提示消息
     */
    info: function(content, title = '') {
      this._add({
        title,
        content,
        icon: 'info',
        style: 'linear-gradient(45deg, #009EFD 0%, #77CDFF 100%)'
      })
    },

    /**
     * 警告消息
     */
    warning: function(content, title = '') {
      this._add({
        title,
        content,
        icon: 'attention',
        style: 'linear-gradient(-135deg, #FAD961 0%, #F76B1C 100%)'
      })
    },

    /**
     * 错误消息
     */
    error: function(content, title = '') {
      this._add({
        title,
        content,
        icon: 'cancel',
        style: 'linear-gradient(-135deg, #F5515F 0%, #D63547 36%, #9F041B 100%)'
      })
    },

    /**
     * 设置卡片停留时间
     * 默认2000ms
     */
    setDelay: function(delay = 2000) {
      TOAST_CONFIG['delay'] = delay;
    }

  }
})