(function() {
  var fs, getLecture, getPlaylist, getPublicFile;
  fs = require('fs');
  getPublicFile = function(file) {
    var data, filename;
    if (file === '/') {
      filename = './public/index.html';
    } else {
      filename = './public' + file;
    }
    try {
      data = fs.readFileSync(filename, 'utf-8');
      return data;
    } catch (error) {
      return '';
    }
  };
  getLecture = function(id) {
    return console.log('try to get lecture');
  };
  getPlaylist = function(id) {
    return console.log('try to get playlist');
  };
  exports.route = function(req, res) {
    var file, parts;
    console.log(req);
    file = getPublicFile(req.url);
    if (file.length > 0) {
      res.end(file);
      return;
    }
    parts = req.url.split('/');
    if (parts.length > 1) {
      switch (parts[1]) {
        case 'lecture':
          if (parts.length > 2) {
            return getLecture(parts[2]);
          }
          break;
        case 'playlist':
          if (parts.length > 2) {
            return getPlaylist(parts[2]);
          }
          break;
        case 'module':
          if (parts.length > 2) {
            return handleModule();
          }
          break;
        default:
          return console.log('unrecognized command');
      }
    }
  };
}).call(this);
