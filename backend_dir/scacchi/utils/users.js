
import * as lib from "../lib/lib.js";

const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const userRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,18}[a-zA-Z0-9]$/;

export const checkEmail = (email) => {
	return (emailRegex.test(email));
}

export const checkPassword = (password) => {
	/** @type {{ password: string }} */
	const minLen = password.length >= 8;
	const hasUpper = /[A-Z]/.test(password);
	const hasLower = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
	return (minLen && hasUpper && hasLower && hasNumber && hasSpecial);
}

export const checkUsername = (username) => {
	return (userRegex.test(username));
}

export const checkInputs = (username, email, password) => {
	if (username && !checkUsername(username))
		return ("Username too short");
	if (email && !checkEmail(email))
		return ("Invalid email format");
	if (password && !checkPassword(password))
		return ("Invalid password format");
	return ("OK");
}
