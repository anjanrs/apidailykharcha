//simple log rotate module to log one log file per day
const path = require("path");
const rfs = require("rotating-file-stream");
var fs = require("fs");

class AccessLogService {
  constructor() {
    this.logDirectory = path.join(__dirname, "../logs");
  }

  init() {
    // ensure log directory exists
    fs.existsSync(this.logDirectory) || fs.mkdirSync(this.logDirectory);
  }

  // compressLog(source, dest) {
  //   return "cat " + source + " | gzip -c9 > " + dist;
  // }

  // create and return a rotating write stream
  rotateLog() {
    return rfs("access.log", {
      path: this.logDirectory,
      size: "10M", // rotate every 10 MegaBytes written
      interval: "1d", // rotate daily
      // compress: 'gzip' // compress rotated files, can be used external compression command
      compress: true
    });
  }
}

module.exports = AccessLogService;
