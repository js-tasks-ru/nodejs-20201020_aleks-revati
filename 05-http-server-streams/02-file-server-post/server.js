const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const sizeStream = new LimitSizeStream({ limit: 1000000 });

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Wrong path');
    return;
  }

  switch (req.method) {
    case 'POST':
      const stream = fs.createWriteStream(filepath, { flags: 'wx' });
      req.pipe(sizeStream).pipe(stream);

      stream.on('error', (err) => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('Fail already');
        } else {
          res.statusCode = 500;
          res.end('Server error');
        }
      });

      stream.on('close', () => {
        res.statusCode = 201;
        res.end('File successful');
      });

      sizeStream.on('error', () => {
        res.statusCode = 413;
        res.end('File exceeds size');
        fs.unlink(filepath, () => { });
      });

      res.on('close', () => {
        if (res.finished) return;
        res.end('Connection failure');
        fs.unlink(filepath, () => { });
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
