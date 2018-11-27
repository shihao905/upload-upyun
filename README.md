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
  serviceName: 'testultimavipweb', // 服务名
  operatorName: 'zishu', // 操作员名
  password: 'zishu123', // 密码
  remoteFilePath: '/zishu', // 上传服务器路径
  filePath: path.resolve(__dirname, './dist') // 本地文件夹路径
});
```

## upload the prompt  

![](https://img2.ultimavip.cn/ultimavip/ultimavip-uplaod.png)
