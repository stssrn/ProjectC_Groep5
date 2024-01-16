import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

interface MailOptions extends SendMailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

class Mailer {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });
    }

    async sendMail(options: MailOptions): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                ...options,
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

export const mailer = new Mailer();
