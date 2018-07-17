var host = "https://apiwx.52drama.com";
var ossHost = "https://oss.52drama.com"
var resourceHost = 'https://res.52drama.com'
var userImgUrl = 'http://res.52drama.com'
var isDev = true    // 开发
var isTest = false  // 测试
if (isDev) {
  host = 'https://apiwxdev.52drama.com:54817'
  ossHost = 'https://oss-dev.52drama.com'
  resourceHost = 'http://resdev.52drama.com:24804'
}
if (isTest) {
  host = 'https://apiwxdev.52drama.com:64817'
  ossHost = 'https://oss-test.52drama.com'
  resourceHost = 'http://resdev.52drama.com:14804'
}
module.exports = {
  host: host,
  ossHost: ossHost,
  resourceHost: resourceHost,
  userImgUrl: userImgUrl,
  appId: "",
  appKey: "",
  // homepage: '/pages/my/my',
  homepage: '/pages/entityList/entityList',
  // homepage: '/pages/venueDetail/venueDetail',
  homepage: '/pages/myMatters/myMatters',
  // homepage: '/pages/venueSubmitSubscribeOpera/venueSubmitSubscribeOpera',
  // homepage: '/pages/venuePaySubscribeOpera/venuePaySubscribeOpera',
  // homepage: '/pages/operaDetailForTroupe/operaDetailForTroupe',
  // homepage: '/pages/operaDetailForTheater/operaDetailForTheater',
  // homepage: '/pages/bindPhone/bindPhone',
  // homepage: '/pages/operaScreen/operaScreen',
  // homepage: '/pages/userCenter/userCenter',
  // homepage: '/pages/userUserName/userName',
  // homepage: '/pages/userName/name',
  // homepage: '/pages/userNickName/nickName',
  // homepage: '/pages/userPwSet/passwordSetting',
  defaultImg: {
    loginBg: '/images/home_bg.jpg',
    iconCry: '/images/network_time_out_cry.png',
    userDefault: '/images/user-img-default.jpg',
    emptyDefault: '/images/empty_default.png',
    emptyResourceDefault: '/images/empty_resource_default.png',
    emptyResourceDefaultO: '/images/empty_resource_default_o.png',
    actorDefault: '/images/actor-default.jpg',
    iconTheatres: '/images/icon_theatre_s.png',
    iconTroupes: '/images/icon_troupe_s.png',
    iconTheatre: '/images/icon_theatre.png',
    iconTroupe: '/images/icon_troupe.png',
    iconToTop: '/images/icon_to_top.png',
    entityNoPic: '/images/entityNoImg340X212.jpg',
  },
  weixinApi: {
    getaccesstoken: 'https://api.weixin.qq.com/cgi-bin/token',//获取access_token   ?grant_type=client_credential&appid=APPID&secret=APPSECRET {"access_token":"ACCESS_TOKEN","expires_in":7200}
    getwxacodeunlimit: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit'//获取小程序码-临时?access_token=ACCESS_TOKEN
  },
  ShareMessage: {
    title: '发现一个好工具，推荐给您', // 当前小程序名称
    desc: '剧汇王朝POMS', // 描述
    imageUrl: '/images/tran.jpg', // 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    path: '/pages/index/index'  // 当前页面 path ，必须是以 / 开头的完整路径
  },
  // token过期重新获取次数
  refreshTokenTimes: 5,
  // 授权服务器Token终结点
  refreshTokenConfig: {
    client_id: 'MiniProgram',
    grant_type: 'refresh_token',
    client_secret: 'secret',
    endpoint: host + '/ia/connect/token'
  },
  // oss文件存储的目录定义
  ossFilePaths: {
    payimage: 'payimage', // 支付凭证图片
    userlogo: 'userlogo' // 用户头像
  },
  reverseProxyAlias: {
    identityCenterAPI: '/ia',
    userCenterAPI: '/uc',
    userCenterMiddleAPI: '/ucm',
    systemBackAPI: '/sys',
    enterpriseManageAPI: '/om',
    theaterInfoAPI: '/thi',
    troupeInfoAPI: '/tri',
    scheduleBookingAPI: '/book',
    mixSearchAPI: '/mix',
  },
}