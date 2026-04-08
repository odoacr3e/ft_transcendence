const fs = require("fs");

function urlDir(url)
{
  let noJ = url.substring(0, url.lastIndexOf("/") + 1);
  return noJ;
}

function urlArg(url)
{
  let noJ = url.substring(url.lastIndexOf("/") + 1, url.length);
  return noJ;
}

function sslOptions()
{
  return {
    key: fs.readFileSync('./lib/key.pem'),
    cert: fs.readFileSync('./lib/cert.pem'),
    minVersion: 'TLSv1.2',
    secureOptions: require('constants').SSL_OP_NO_SSLv3 |
                require('constants').SSL_OP_NO_TLSv1 |
                require('constants').SSL_OP_NO_TLSv1_1
  };
}

module.exports = {urlDir, urlArg, sslOptions};