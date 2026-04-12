
import conn from "./dbConnection.js";

const args = process.argv.slice(2);

const username = args[0];
const pwd = args[1];

if (!username || !pwd)
{
	console.log("Use node login.js <username> <password>");
	process.exit(1);
}

function checkUser() {
	return new Promise((resolve, reject) => {
		conn.query('SELECT * FROM users where username = $1 AND password = $2', [username, pwd])
		.then((res) => resolve(res.rowCount > 0))
		.catch(err => reject(err));
	})
}

checkUser().then((res) => {
	if (res > 0)
		console.log("User " + username + " loggato con successo");
	else
		console.log("User non trovato");
	conn.end();
})
.catch((err) => {
	console.log(err);
})