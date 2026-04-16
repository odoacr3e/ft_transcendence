
const { Pool } = require('pg');
require('dotenv').config();


const db = new Pool({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PWD,
	port: process.env.DB_PORT,
	max: 100
});

db.connect().then(() => {
	console.log("Db collegato");
}).catch(() => {
	console.log("Db non connesso");
});

module.exports = {db};
