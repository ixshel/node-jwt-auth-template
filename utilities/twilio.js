require('dotenv').config({ debug: process.env.DEBUG });
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendTwilioMessage = async (options) => {
    try {
        await twilio.messages.create({
            from: process.env.TWILIO_TO_NUMBER,
            to: options.to,
            body: options.body
        }, (error, message) => {
            if (error) throw error;
            console.log('Message: ', message);
        })
    } catch (error) {
        console.log('Twilio message failed: ', error);
        throw error;
    }
}

module.exports = sendTwilioMessage;