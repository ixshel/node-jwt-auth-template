/**
 * This will be the model to save our registered
 * users
 * Roles: ['Admin', 'User']
 */

 const mongoose = require('mongoose');

 const UserSchema = mongoose.Schema({
     username: {
         type: String,
         required: true
     },
     email: {
         type: String,
         required: true
     },
     password: {
         type: String,
         required: true
     },
     role: {
         type: String,
         enum: ["admin", "user"],
         default: "user"
     },
     createdAt: {
         type: Date,
         default: Date.now()
     }
 });

 module.exports = mongoose.model('user', UserSchema);