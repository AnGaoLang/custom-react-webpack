const Path = require('path');

exports.resolve = (path) => {
  return Path.join(__dirname, path)
}

