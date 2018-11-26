const slog = require('single-line-log').stdout;
class ProgressBar {
  constructor(description, bar_length) {
    this.description = description || 'Progress';
    this.length = bar_length || 25;
  }
  render(options) {
    let percent = (options.completed / options.total).toFixed(4);
    var cell_num = Math.floor(percent * this.length);  
    // 拼接黑色条
    let cell = '';
    for (let i=0;i<cell_num;i++) {
      cell += '█';
    }
    // 拼接灰色条
    let empty = '';
    for (let i=0;i<this.length-cell_num;i++) {
      empty += '░';
    }
    let cmdText = this.description + ': ' + (100*percent).toFixed(2) + '% ' + cell + empty + ' ' + options.completed + '/' + options.total + '\n';
    slog(cmdText);
  }
}

module.exports = ProgressBar;