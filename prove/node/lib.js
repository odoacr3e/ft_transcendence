const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');

// const ssl = {
// 	key: fs.readFileSync(path.join(__dirname, 'key.pem')),
// 	cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
// 	minVersion: 'TLSv1.2',
// 	secureOptions: require('constants').SSL_OP_NO_SSLv3 |
//     require('constants').SSL_OP_NO_TLSv1 |
//     require('constants').SSL_OP_NO_TLSv1_1
// };

module.exports = { http, url, fs, /* ssl, */ path};