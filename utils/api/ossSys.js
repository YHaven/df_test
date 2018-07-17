// 调用阿里云Oss相关的需要系统后台处理的相关api
var config = require('../config.js')
module.exports = {
  getOssStsTokenUrl: config.host + '/sys/api/v1/aliyunoss/GetSTSToken', // 获取阿里云Oss的STSToken的API地址
  oldSystemBackBaseUrl: 'https://res.52drama.com/'   // 为兼容之前已经通过SystemBackAPI上传的文件等，可设置此基地址查看之前的文件图片等
}