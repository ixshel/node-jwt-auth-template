require('dotenv').config({ debug: process.env.DEBUG });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    port: process.env.EMAIL_PORT,
    secure: true
});

const sendEmail = async (options) => {
    try {

        await transporter.sendMail({
            from: process.env.MAIL_SENDER,
            to: options.to,
            sunbject: options.sunbject,
            html: options.mailBody // test: String
        }, (error, mail) => {
            if (error) throw error;
            console.log('Email sent: ', email);
        })
    } catch (error) {
        console.log('Mail exception: ', e);
        throw e;
    }
};

module.exports = sendEmail;