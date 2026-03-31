const lib = require('./lib/lib.js');

const music = lib.express.Router();

music.get('/', (req, res) => 
{
	res.write("ZA WARUDO\n");
	res.send(req.params[0]);
});

music.get('/*splat', (req, res) => 
{
	res.status(404);
	res.end(req.params + "\n");
});

module.exports = music;