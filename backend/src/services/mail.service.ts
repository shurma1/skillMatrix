import nodemailer from 'nodemailer';
import config  from 'config';

interface IMailData {
    recipient: string,
    title: string,
    message?: string,
    HTML?: string
}

class MailService {

	public transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: config.get('SMTP.HOST'),
			port: config.get('SMTP.PORT'),
			secure: config.get('SMTP.SECURE'),
			auth: {
				user: config.get('SMTP.USER'),
				pass: config.get('SMTP.PASSWORD'),
			},
		});
	}

	async SendMail(mailData: IMailData){
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to: mailData.recipient,
			subject: mailData.title,
			text: mailData.message,
			html: mailData.HTML,
		});
	}

}

export default new MailService();
