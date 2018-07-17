const app = getApp()
var aliyunServerURL = "https://oss-dev.52drama.com"
if (app.config.ossHost) {
  aliyunServerURL = app.config.ossHost
}
var config = {
  //aliyun OSS config
  accessid: 'LTAIWpr5rFsnxlUV',
  accesskey: 'T8fpt5PFFg1jHGCdEQZTfm975IYKrT',
  timeout: 87600, //这个是上传文件时Policy的失效时间
  aliyunServerURL: aliyunServerURL
};
module.exports = config