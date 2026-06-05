
import * as lib from "../lib/lib.js";
import { colors, tag } from "./colors.js";
const { logfd } = lib.include;

const textColor = {
	info: colors.brightWhite,
	ok:   colors.green,
	db:   colors.magenta,
	warn: colors.yellow,
	err:  colors.red
};

async function printLog(message, type = 'info') {
	const now = new Date().toLocaleString('sv-SE');
	console.log(`${colors.dim(`[ ${now} ]`)} ${tag[type] ?? tag.info}  ${(textColor[type] ?? colors.white)(message)}`);
	// await logfd.write(`[ ${now} ] [${type.toUpperCase()}] ${message}\n`);
}

export const log = {
  info:  (msg) => printLog(msg, 'info'),
  ok:    (msg) => printLog(msg, 'ok'),
  db:    (msg) => printLog(msg, 'db'),
  warn:  (msg) => printLog(msg, 'warn'),
  err:   (msg) => printLog(msg, 'err'),

  banner: (port) => {
    // const line = colors.green('─'.repeat(40));
    // console.log(`\n${line}`);
    console.log(colors.green(colors.bold('  ✓  Server in ascolto')));
    console.log(colors.dim(`     http://localhost:${port}  •  NODE_ENV=${process.env.NODE_ENV}`));
    // console.log(`${line}\n`);
  },

  header: (name, version) => {
    const sep = colors.dim('─'.repeat(60));
    console.log(`\n${sep}`);
    console.log(colors.dim(`  ${name}  v${version}  •  NODE_ENV=${process.env.NODE_ENV}`));
    console.log(`${sep}\n`);
  },
};
