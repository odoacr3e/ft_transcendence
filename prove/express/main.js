const lib = require('./lib/lib.js');
const music = require("./music.js");

async function sslOptions(lib)
{
  return {
    key: await lib.fs.readFile('./lib/key.pem'),
    cert: await lib.fs.readFile('./lib/cert.pem'),
    minVersion: 'TLSv1.2',
    secureOptions: require('constants').SSL_OP_NO_SSLv3 |
                require('constants').SSL_OP_NO_TLSv1 |
                require('constants').SSL_OP_NO_TLSv1_1
  };
}

lib.app.use('/music', music);

let tutorial = "loc:\n\
  /       -->   help\n\
  /music?q... -->\n\
                GET: cerchiamo una canzone";

lib.app.get('/', (req, res) => {
	res.write("Nuuuuuu non fotto piu'...\n");
})

async function startServer()
{
	const srv = lib.https.createServer(await sslOptions(lib), lib.app);
	srv.listen(443, () => {
		console.log("Ahahahahahahahaah, io fotto, io fotto ahahahaahah");
	});
}

startServer();