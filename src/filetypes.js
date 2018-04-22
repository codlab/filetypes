const fs = require('fs');
const audiosMatcher = require('./types/audio');
const archivesMatcher = require('./types/archive');
const fontsMatcher = require('./types/font');
const imagesMatcher = require('./types/image');
const videosMatcher = require('./types/video');
const readFile = (file) =>{
  if(file === null)
    return null;
  try {
    return fs.readFileSync(file);
  } catch (err) {
    throw err
  }
}

const readHeader = (file) => {
  return new Promise((resolve, reject) => {
    fs.open(file, 'r', function(status, fd) {
      fs.fstat(fd, (err, stat) => {
        if (err || !stat) {
          reject(err);
          return;
        }
        var buffer = new Buffer(512);
        const read = Math.min(512, stat.size);
        fs.read(fd, buffer, 0, read, 0, function(err, bytes, buffer) {
          fs.close(fd, (err) => {
            if (err) reject(err);
            else resolve(buffer);
          });
        });
      });
    });
  })
}

const findExtension = (mineType) =>{
  //Todo Posibly use reduce;
  const matchers = [archivesMatcher, audiosMatcher, fontsMatcher, imagesMatcher, videosMatcher]
  let types = matchers
    .find((matcher) => matcher.find((mine)=> mine.extension === mineType));
  return types?types.find((mine)=> mine.extension === mineType):null;
}

class FileTypes {

  constructor(file) {
    this._file = file;
    this.version = "1.0.3";
  }

  read() {
    return new Promise((resolve, reject) => {
      readHeader(this._file)
      .then(buffer => {
        this._data = buffer;
        resolve(true);
      });
    })
  }

  guessMineType() {
    if(!this._file || !this._data)
      return null;
      //not checking using the extension, to easy to hack <3

      var found = null; //TODO each
      found = this.closestAudio();
      if(found) return found;
      found = this.closestArchive();
      if(found) return found;
      found = this.closestFont();
      if(found) return found;
      found = this.closestImage();
      if(found) return found;
      found = this.closestVideo();
      if(found) return found;
  }

  closestAudio() {
    return this._isWat(audiosMatcher)
  }

  closestArchive() {
    return this._isWat(archivesMatcher)
  }

  closestFont() {
    return this._isWat(fontsMatcher)
  }

  closestImage() {
    return this._isWat(imagesMatcher)
  }

  closestVideo() {
    return this._isWat(videosMatcher)
  }

  _isWat(wat) {
    const filtered = wat.filter((mine)=> mine.match(this._data));
    return filtered && filtered.length > 0 ? filtered[0] : null;
  }

  isMineSupported(mineType) {
    !!findExtension(mineType);
  }
}

module.exports = FileTypes;
