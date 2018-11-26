'use strict'
const upyun = require("upyun");
const fs = require('fs');
const fontColor = require("./style");
const ProgressBar = require("./progress");
const Upyun = upyun.Client;
const Service = upyun.Service;
class UpyunUpload {
  constructor(option) {
    this.serviceName = option.serviceName || '';
    this.operatorName = option.operatorName || '';
    this.password = option.password || '';
    this.filePath = option.filePath || '';
    this.remoteFilePath = option.remoteFilePath || '';
    this.filesList = [];
    this.uploadFiles = [];
    this.errorFiles = [];
    this.confirm();
  }
  confirm() {
    process.stdin.setEncoding('utf8');
    console.log(fontColor.yellow, `请确认上传信息：`);
    console.log(fontColor.green, `---服务名：${this.serviceName}`);
    console.log(fontColor.green, `---操作员：${this.operatorName}`);
    console.log(fontColor.green, `---密码：${this.password}`);
    console.log(fontColor.green, `---本地文件夹路径：${this.filePath}`);
    console.log(fontColor.green, `---上传服务器路径：${this.remoteFilePath}`);
    console.log(fontColor.yellow, `确认开始上传吗(N/y)？`);
    process.stdin.on('data',(input)=>{
      input = input.toString().trim();
      if (['Y', 'y', 'YES', 'yes'].indexOf(input) > -1) {
        this.init(()=>{
          process.exit();
        });
      }else {
        process.exit();
      }
    })
  }
  init(exit) {
    this.getFileList(()=>{
      if (!this.filesList.length) {
        console.log(fontColor.yellow, "未找到可以上传的文件");
        return;
      }
      console.log(fontColor.yellow, "开始上传...");
      let pb = new ProgressBar("上传进度");
      this.filesList.map(file=>{
        this.uploadFile(file,(res)=>{
          this.uploadFiles.push(file);
          if (!res.success) {
            this.errorFiles.push(file);
          }
          pb.render({
            completed: this.uploadFiles.length,
            total: this.filesList.length
          });

          if (this.uploadFiles.length == this.filesList.length) {
            console.log(fontColor.green, "上传完成！");
            exit&&exit();
          }
        });
      })
    })
  }
  getFileList(cb) {
    let filesList = [];
    fs.readdir(this.filePath, (err, files) => {
      if (!err) {
        files.map(path => {
          if (
            path.charAt(0) !== "." &&
            fs.statSync(this.filePath + "/" + path).isFile()
          ) {
            filesList.push({
              key: (this.remoteFilePath || "") + "/" + path,
              localFile: (this.filePath || "") + "/" + path
            });
          }
        });
        this.filesList = filesList;
        cb && cb();
      } else {
        console.log(error);
      }
    });
  }
  uploadFile(file, cb) {
    const client = new Upyun(new Service(this.serviceName, this.operatorName, this.password))
    client.formPutFile(file.key, fs.createReadStream(file.localFile)).then(res=>{
      if (res && res.url) {
        cb&&cb({
          success:true,
          data:res
        })
      } else {
        console.log(fontColor.red, "上传失败：" + file.localFile);
        cb&&cb({
          success:false,
          data:res
        })

      }
    }).catch(error=>{
      console.log('uploadFile error',error)
      cb&&cb({
        success:false,
        data:error
      })
    })
  }
}

module.exports = UpyunUpload;
