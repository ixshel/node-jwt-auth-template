require('dotenv').config({ debug: process.env.DEBUG });
const http = require('https');
const querystring = require('querystring');

const sendEZTextingMessage = async (options) => {
    try {
        const parameters = {
            user: process.env.EZTEXTING_USERNAME,
            pass: process.env.EZTEXTING_PASSWORD,
            phonenumber: ((options.to).toString()).replace(/\+1/g, '').replace(/\s/g, '').replace(/\D/g, ''),
            subject: '',
            message: options.message
        }

        // GET parameters as query string : "?id=123&type=post"
        const get_request_args = querystring.stringify(parameters);

        // Final url is "http://usefulangle.com/get/ajax.php?id=123&type=post"
        const options = {
            url: process.env.EZTEXTING_URI,
            port: "80",
            path: "api/sending/" + get_request_args,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        await http.request(options, (response, error) => {
            return cb(error || response);
        });

    } catch (error) {
        console.log('EZTexting message failed: ', error);
        throw error;
    }
}

module.exports = sendEZTextingMessage;