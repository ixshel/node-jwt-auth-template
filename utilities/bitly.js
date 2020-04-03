require('dotenv').config({ debug: process.env.DEBUG });
const { BitlyClient } = require('bitly');
const bitly = new BitlyClient(process.env.BITLY_ACCESS_TOKEN, {});

const uriShortener = async (uri) => {

    try {
        return await bitly.shorten(uri);
    } catch (error) {
        console.log('Bitly uri shorten failed: ', error);
        throw error;
    }
}

module.exports = uriShortener;

