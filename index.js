'use strict'
const upyun = require("upyun");
const fs = require('fs');
const path = require('path');
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
    this.loadSuccess = option.success || (()=>{});
    this.loadError = option.error || (()=>{});
    this.remoteFilePath = option.remoteFilePath || '';
    if (typeof option.openConfirm == 'boolean') {
      this.openConfirm = option.openConfirm;
    } else {
      this.openConfirm = true;
    }
    this.filesList = [];
    this.uploadFiles = [];
    this.errorFiles = [];
    this.openConfirm ? this.confirm() : this.init();
    this.uploading = false;
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
      if (this.uploading) return;
      input = input.toString().trim();
      if (['Y', 'y', 'YES', 'yes'].indexOf(input) > -1) {
        this.uploading = true;
        this.init(()=>{
          process.exit();
          this.uploading = false;
        });
      }else {
        process.exit();
      }
    })
  }
  init(exit) {
    this.getFileList((list)=>{
      this.filesList = list;
      if (!this.filesList.length) {
        console.log(fontColor.yellow, "未找到可以上传的文件");
        return;
      }
      console.log(fontColor.yellow, "开始上传...");
      let pb = new ProgressBar("上传进度");
      this.filesList.map(file=>{
        this.uploadFile(file,(res)=>{
          this.uploadFiles.push(file);
          !res && this.errorFiles.push(file);
          pb.render({
            completed: this.uploadFiles.length,
            total: this.filesList.length
          });

          if (this.uploadFiles.length == this.filesList.length) {
            console.log(fontColor.green, "上传完成！");
            if (this.errorFiles.length) {
              console.log(fontColor.red, this.errorFiles.map(res=>(`上传失败：${res.localFile}`)).join('\n'))
              this.loadError(this.errorFiles);
            } else {
              this.loadSuccess(this.uploadFiles);
            }
            exit&&exit();
          }
        });
      })
    })
  }
  getFileByDir(dirPath,list){
    fs.readdirSync(dirPath).map(url => {
      let u = dirPath + "/" + url;
      if (u.charAt(0) !== "." && fs.existsSync(u)) {
        if (fs.statSync(u).isDirectory()) {
          this.getFileByDir(u,list);
        } else {
          list.push({
            key: this.remoteFilePath + u.slice(this.filePath.length),
            localFile: u
          })
        }
      }
    })
  }
  getFileList(cb) {
    let filesList = [];
    this.getFileByDir(this.filePath, filesList);
    cb && cb(filesList);
  }
  uploadFile(file, callBack) {
    const client = new Upyun(new Service(this.serviceName, this.operatorName, this.password))
    client.putFile(file.key, fs.readFileSync(file.localFile)).then(res=>{
      callBack(res);
    }).catch(error=>{
      callBack(false);
      console.log(fontColor.red, "上传失败：" + file.localFile);
    })
  }
}

module.exports = UpyunUpload;
