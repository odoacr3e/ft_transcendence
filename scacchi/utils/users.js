
const lib = require("../lib/lib.js")

const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const checkEmail = (email) => {
	return (regex.test(email));
}

const checkPassword = (password) => {
	/** @type {{ password: string }} */
	const minLen = password.length >= 8;
	const hasUpper = /[A-Z]/.test(password);
	const hasLower = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
	return (minLen && hasUpper && hasLower && hasNumber && hasSpecial);
}

const checkInputs = (username, email, password) => {
	if (username && username.length < 4)
		return ("Username too short");
	if (email && checkEmail(email))
		return ("Invalid email format");
	if (password && checkPassword(password))
		return ("Invalid password format");
	return ("OK");
}

module.exports = { checkEmail, checkPassword, checkInputs }