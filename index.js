'use strict'
const upyun = require("upyun");
const fs = require('fs');
const path = require('path');
const Upyun = upyun.Client;
const Service = upyun.Service;

// 需要填写自己的服务名，操作员名，密码，通知URL
const serviceName = 'testultimavipweb'
const operatorName = 'zishu'
const password = 'zishu123'
const notifyUrl = ''

// 需要填写本地路径，云存储路径
const localFile =  path.resolve(__dirname, './dist/1111.txt')
const remoteFile = '/zishu/111.txt'


const client = new Upyun(new Service(serviceName, operatorName, password))
client.formPutFile(remoteFile, fs.createReadStream(localFile)).then(res=>{
  console.log('res',res)
}).catch(error=>{
  console.log('error',error)
})
