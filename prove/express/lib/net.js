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

//ASYNC!!!
async function sslOptions(lib)
{
  return {
    key: await lib.fs.readFile('./key.pem'),
    cert: await lib.fs.readFile('./cert.pem'),
    minVersion: 'TLSv1.2',
    secureOptions: require('constants').SSL_OP_NO_SSLv3 |
                require('constants').SSL_OP_NO_TLSv1 |
                require('constants').SSL_OP_NO_TLSv1_1
  };
}

module.exports = {urlDir, urlArg, sslOptions};