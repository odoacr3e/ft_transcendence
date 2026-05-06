
const lib = require("../lib/lib.js");
const bcrypt = require("bcryptjs");
const { prisma } = require("../lib/prisma.js")
const { error } = require("node:console");

/** 
 * autenticazione tramite middleware
 * -> per router.post("/", middle1, middle2, middleX ...)
 * -> ogni middleware fa da strato di controllo e ha questa forma di dichiarazione (req, res, next) =>
 * -> per passare al controllo (funzione) successivo va chiamato next() -> significa che il controllo è stato superato,
 * altrimenti viene data una risposta al client di errore
 * 
 * 1. controllo che username e password siano presenti -> checkCredentials
 * 2. controllo che lo user esista nel db e che le credenziali siano giuste -> checkUser
 * 3. generazione token JWT
*/

const checkCredentials = (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password)
		return (res.status(400).json({ error: "Credenziali mancanti" }));
	next();
}

// db.query("SELECT username, password FROM users WHERE username =  $1", [username]);
const checkUser = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await prisma.users.findUnique({ where: { username: String(username) } })
		if (!user || user.password !== bcrypt.compare(password))
			return res.status(401).json({ error: "Credenziali non valide" });
		console.log("User " + user.rows[0].username + " trovato");
		req.user = user.rows[0]; // aggiungo lo user trovato all'oggetto request per averlo anche nel successivo middleware
		next();
	} catch (error) {
		next(error);
	}
};



module.exports = { checkCredentials, checkUser };
