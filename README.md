# anve-upload-upyun 

上传又拍云npm包
[https://github.com/shihao905/upload-upyun.git](https://github.com/shihao905/upload-upyun.git)

## install

```js
$ npm install --save anve-upload-upyun
```

## use

```js
const UpyunUpload = require('anve-upload-upyun');
const path = require('path');

new UpyunUpload({
  /**
   * 上传的服务名
  */
  serviceName: 'testultimavipweb',
  /**
   * 操作员账号
  */
  operatorName: '********',
  /**
   * 操作员密码
  */
  password: '******',
  /**
   * 上传服务器路径
  */
  remoteFilePath: '/test',
  /**
   * 本地文件夹路径
  */
  filePath: path.resolve(__dirname, './dist'),
  /**
   * 是否打开上传前的提示 默认打开
  */
  openConfirm: false,
  /**
   * 上传成功回调
   * @param {array} files [成功文件列表]
  */
  success: function(files) {
    console.log('success',files)
  },
  /**
   * 上传失败回调
   * @param {array} files [失败文件列表]
  */
  error: function(files){
    console.log('error',files)
  }
});
```

## upload the prompt  

![](https://img2.ultimavip.cn/ultimavip/ultimavip-uplaod.png)
