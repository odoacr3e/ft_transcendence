import pg from 'pg';
const { Client } = pg;
import dotenvlib from 'dotenv';
const dotenv = dotenvlib;
dotenv.config();

const conn = new Client({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PWD,
	port: process.env.DB_PORT
})

conn.connect().then((client) => {
	console.log("Collegato al db");
})
.catch(() => {
	console.log("Impossibile connettersi al db");
	process.exit(1);
})

export default conn;