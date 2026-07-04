
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

export async function bodyOTP(username, otp) {
	return (`
	<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background-color: #f4f4f7; padding: 32px;">
		<div style="background-color: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
			<h2 style="color: #1a1a1a; margin-top: 0;">Ciao ${username}!</h2>
			<p style="color: #4a4a4a; font-size: 15px; line-height: 1.5;">
				Grazie per esserti registrato. Usa il codice qui sotto per verificare il tuo account:
			</p>
			<div style="background-color: #f0f0f5; border-radius: 6px; padding: 20px; text-align: center; margin: 24px 0;">
				<span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2d2d2d;">${otp}</span>
			</div>
			<p style="color: #4a4a4a; font-size: 14px; line-height: 1.5;">
				Il codice scade tra <strong>10 minuti</strong>. Se non hai richiesto tu la registrazione, ignora pure questa email.
			</p>
			<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
			<p style="color: #9a9a9a; font-size: 12px; text-align: center;">
				ft_transcendence &middot; Non rispondere a questa email
			</p>
		</div>
	</div>
	`);
}