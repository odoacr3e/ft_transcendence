
import nodemailer from 'nodemailer'

console.log('EMAIL_USER:', process.env.GMAIL_APP_USER);
console.log('EMAIL_PASS defined:', process.env.GMAIL_APP_PWD);

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

export function bodyOTP(username, otp) {
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

export function bodyRegistration(username) {
	return (`
		<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 480px; margin: 0 auto; background-color: #0d0b14; padding: 32px;">
			<div style="background: linear-gradient(180deg, #1a1625 0%, #100e18 100%); border: 1px solid #3d2f52; border-radius: 8px; padding: 40px 32px; box-shadow: 0 0 40px rgba(107, 70, 193, 0.15);">
				
				<div style="text-align: center; margin-bottom: 24px;">
					<span style="font-size: 40px;">⚔️</span>
				</div>

				<h1 style="color: #d4af37; text-align: center; font-size: 24px; letter-spacing: 2px; margin: 0 0 8px 0; text-transform: uppercase;">
					Benvenuto, ${username}
				</h1>
				<p style="color: #7a6f8a; text-align: center; font-size: 13px; font-style: italic; margin: 0 0 32px 0;">
					Il tuo nome è stato inciso nei registri del regno
				</p>

				<div style="border-top: 1px solid #3d2f52; border-bottom: 1px solid #3d2f52; padding: 24px 0; margin: 24px 0;">
					<p style="color: #c4b8d4; font-size: 15px; line-height: 1.7; margin: 0;">
						Il tuo account è stato forgiato con successo. Da oggi puoi sfidare avversari, 
						scalare le classifiche e conquistare la tua reputazione nell'arena.
					</p>
				</div>

				<div style="text-align: center; margin: 32px 0;">
					<a href="#" style="display: inline-block; background: linear-gradient(135deg, #8b6914 0%, #d4af37 100%); color: #0d0b14; text-decoration: none; padding: 14px 36px; border-radius: 4px; font-weight: bold; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
						Entra nell'Arena
					</a>
				</div>

				<p style="color: #5a5068; font-size: 12px; line-height: 1.6; text-align: center; margin-top: 32px;">
					Se non hai richiesto tu questo account, ignora pure questa missiva.
				</p>

				<hr style="border: none; border-top: 1px solid #2a2438; margin: 24px 0;">
				
				<p style="color: #4a4258; font-size: 11px; text-align: center; letter-spacing: 1px;">
					✦ FT_TRANSCENDENCE ✦
				</p>
			</div>
		</div>
	`);
};