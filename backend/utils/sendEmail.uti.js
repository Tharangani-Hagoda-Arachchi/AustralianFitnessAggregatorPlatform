import nodemailer from "nodemailer";

export const sendEmail = async ({to, subject, html}) => {
    try {
        if (!process.env.SMTP_HOST) {
            console.log('--- EMAIL (dev mode, no SMTP configured) ---');
            console.log(`To: ${to}\nSubject: ${subject}\n${html}`);
            console.log('----------------------------------------------');
            return;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'no-reply@fitnessaggregator.com.au',
            to,
            subject,
            html,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};