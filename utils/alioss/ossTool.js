const app = getApp()
const ossConfig = require('./config.js');
const Base64 = require('./Base64.js');

require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');

// 上传文件
const uploadFile = function (args) {
  let filePath = args.filePath;
  let dir = args.dir;
  let objectId = args.objectId; // 如果指定则使用指定名称。
  let successCB = args.success ? args.success : args.successCB;
  let errorCB = args.fail ? args.fail : args.errorCB;
  if (!filePath || filePath.length < 9) {
    errorCB({
        message: '选择的文件路径有误'
    })
    return;
  }
  // num传入的数字，n需要的字符长度
  // 例如：传入6，需要的字符长度为3，调用方法后字符串结果为：006
  let PrefixInteger = function(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }
  if (!objectId) {
    // 如果未指定则使用时间戳名称。
    let fileSuffix = get_suffix(filePath);
    let date = new Date();
    var monthStr = date.getFullYear() + '' + PrefixInteger(date.getMonth()+1,2);
    objectId = monthStr + '/' + (date.getTime()) + fileSuffix;
  }
  //const aliyunFileKey = dir+filePath.replace('wxfile://', '')；

  const aliyunFileKey = dir + '/' + objectId;
  const aliyunServerURL = ossConfig.aliyunServerURL;
  const accessid = ossConfig.accessid;
  const policyBase64 = getPolicyBase64();
  const signature = getSignature(policyBase64);

  console.log('开始上传文件…');
  console.log('aliyunFileKey=', aliyunFileKey);
  wx.uploadFile({
      url: aliyunServerURL, //仅为示例，非真实的接口地址
      filePath: filePath,
      name: 'file',
      formData: {
          'key': aliyunFileKey,
          'OSSAccessKeyId': accessid,
          'policy': policyBase64,
          'Signature': signature,
          'success_action_status': '200',
      },
      success: function (res) {
          if (res.statusCode != 200) {
            errorCB(res)
              return;
          }
          console.log('上传文件成功', res)
          successCB({url: aliyunServerURL + '/' + aliyunFileKey}); // 成功时返回上传文件的全路径
      },
      fail: function (err) {
          err.wxaddinfo = aliyunServerURL;
          errorCB(err)
      },
  })
}
// 获取文件后缀名
const get_suffix = function (filename) {
  if (!filename) {
    return ''
  }
  let pos = filename.lastIndexOf('.')
  let suffix = ''
  if (pos != -1) {
    suffix = filename.substring(pos)
  }
  return suffix
}
const getPolicyBase64 = function () {
    let date = new Date();
    date.setHours(date.getHours() + ossConfig.timeout);
    let srcT = date.toISOString();
    const policyText = {
        "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 指定了Post请求必须发生在2020年01月01日12点之前("2020-01-01T12:00:00.000Z")。
        "conditions": [
            ["content-length-range", 0, 20 * 1024 * 1024] // 设置上传文件的大小限制,1048576000=1000mb
        ]
    };

    const policyBase64 = Base64.encode(JSON.stringify(policyText));
    return policyBase64;
}

const getSignature = function (policyBase64) {
    const accesskey = ossConfig.accesskey;

    const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
        asBytes: true
    });
    const signature = Crypto.util.bytesToBase64(bytes);

    return signature;
}

module.exports = uploadFile;
module.exports = {
  uploadFile: uploadFile // 上传文件
}