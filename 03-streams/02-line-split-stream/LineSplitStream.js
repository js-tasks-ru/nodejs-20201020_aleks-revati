const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.strArr = '';
    this.str = '';
  }

  _transform(chunk, encoding, callback) {
    this.strArr = chunk.toString(this.encoding).split(os.EOL);
    this.strArr.forEach((item, index) => {
      if (this.strArr.length === 1) {
        this.str += item;
        return;
      } else if (index === 0) {
        this.push(this.str.concat(item));
        this.str = '';
        return;
      } else if (index === this.strArr.length - 1) {
        this.str = item;
        return;
      } else {
        this.push(item);
      }
    });
    callback();
  }

  _flush(callback) {
    callback(null, this.str);
  }
}

module.exports = LineSplitStream;
