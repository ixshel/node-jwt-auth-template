const mongoose = require('mongoose');

// Set here your mongo creds
// mongodb://<username>:<password>@<db-host>:<port>/<database-name>
const MONGOURI = 'mongodb://localhost:27017/node-template';

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true
        });
        console.log('DB Connected...');
    } catch (error) {
        console.log('DB connection failes: ', error);
        throw error;
    }
}

module.exports = InitiateMongoServer;