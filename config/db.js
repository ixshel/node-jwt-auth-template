const mongoose = require('mongoose');
require('dotenv').config({ debug: process.env.DEBUG });

// Set here your mongo creds
// mongodb://<username>:<password>@<db-host>:<port>/<database-name>
const MONGOURI = process.env.DB_URI;

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true
        });
        console.log('DB Connected...');
    } catch (error) {
        console.log('DB connection failed: ', error);
        throw error;
    }
}

module.exports = InitiateMongoServer;