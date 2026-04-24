
const lib = require("../lib.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { send } = require("node:process");
const { db } = require("../services/dbConnection.js");

const printBody = async (request, response) => {
	
	const { username, password } = request.body;
	const user = await db.query("SELECT username, password FROM users WHERE username =  $1", [username]);
	if (user.rowCount == 0)
		return response.status(401).json({ error: "Credenziali non valide" });
	if (user.rows[0].password !== password)
		return response.status(401).json({ error: "Credenziali non valide" });
	
	console.log("OK");
	response.send("Arrivata\n");
};

module.exports = { printBody };
