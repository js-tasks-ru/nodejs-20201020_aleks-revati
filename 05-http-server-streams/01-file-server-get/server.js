const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Wrong path');
    return;
  }

  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);

      res.statusCode = 200;

      stream.pipe(res).on('error', (err) => {
        res.statusCode = 500;
        res.end('Server error');
      });

      stream.on('error', (err) => {
        res.statusCode = 404;
        res.end('File not found');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
