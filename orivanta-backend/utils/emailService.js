const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async sendContactForm(formData) {
        const { firstName, lastName, email, phone, subject, message } = formData;
        
        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #667eea; }
                .value { margin-top: 5px; }
                .footer { text-align: center; padding: 15px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Contact Form Submission - Orivanta</h2>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">Name:</div>
                        <div class="value">${firstName} ${lastName}</div>
                    </div>
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value">${email}</div>
                    </div>
                    ${phone ? `<div class="field">
                        <div class="label">Phone:</div>
                        <div class="value">${phone}</div>
                    </div>` : ''}
                    <div class="field">
                        <div class="label">Service Interest:</div>
                        <div class="value">${subject}</div>
                    </div>
                    <div class="field">
                        <div class="label">Message:</div>
                        <div class="value">${message}</div>
                    </div>
                </div>
                <div class="footer">
                    <p>Received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    <p>From: Orivanta Contact Form</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: `"${firstName} ${lastName}" <${process.env.EMAIL_FROM}>`,
            to: process.env.EMAIL_TO,
            replyTo: email,
            subject: `New Contact: ${subject} - ${firstName} ${lastName}`,
            html: htmlTemplate,
            text: `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service: ${subject}
Message: ${message}
            `
        };

        return await this.transporter.sendMail(mailOptions);
    }

    async sendAutoReply(email, firstName) {
        const autoReplyTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { text-align: center; padding: 15px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Thank You for Contacting Orivanta!</h2>
                </div>
                <div class="content">
                    <p>Hi ${firstName},</p>
                    <p>Thank you for reaching out to us! We've received your message and will get back to you within 24 hours.</p>
                    <p>Our team is excited to learn more about your project and discuss how we can help transform your business.</p>
                    <p><strong>What happens next?</strong></p>
                    <ul>
                        <li>We'll review your project details</li>
                        <li>Schedule a discovery consultation</li>
                        <li>Provide strategic recommendations</li>
                        <li>Discuss partnership opportunities</li>
                    </ul>
                    <p>Best regards,<br>The Orivanta Team</p>
                </div>
                <div class="footer">
                    <p>Orivanta - Digital Transformation Partners</p>
                    <p>Email: support@orivanta.in | Phone: +91 94734 21755</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const autoReplyOptions = {
            from: `"Orivanta Team" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Thank you for contacting Orivanta - We\'ll be in touch soon!',
            html: autoReplyTemplate
        };

        return await this.transporter.sendMail(autoReplyOptions);
    }
}

module.exports = new EmailService();
