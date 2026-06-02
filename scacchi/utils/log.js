
import * as lib from "../lib/lib.js";
import { colors } from "./colors.js";
const { logfd } = lib.include;

async function printLog(message, color) {
	const now = new Date().toLocaleString('sv-SE');
	console.log(`[ ${now} ] ${color}${message}${colors.reset}`);
	await logfd.write(`[ ${now} ] ${message}\n`);
}

export { printLog };