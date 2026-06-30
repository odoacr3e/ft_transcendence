
import nodemailer from 'nodemailer'

const sender = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_APP_PWD
	}
});

/**
 * @param {Object} params
 * @param {string} params.to - Indirizzo email del destinatario.
 * @param {string} params.subject - Oggetto dell'email.
 * @param {string} params.body - Contenuto dell'email (testo o HTML).
 */
export async function sendEmail({ to, subject, body }) {
	// try {
		return await sender.sendMail({
			from: '"ChessZ" <' + process.env.GMAIL_USER + '>',
			to: to,
			subject: subject,
			html: body
		});
	// } catch (error) {
	// 	console.log("Error sending mail: ", error);
	// 	throw error;
	// }
}