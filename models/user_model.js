const mongoose = require('mongoose');
/**
 * We specify the Schema of the User Entity in this file 
 * 
 * User attributes 
 * - email -> unique
 * - password
 * - name
 * - BU
 * - role
 * - qualifications
 * - team_id <reference to Team>
 * 
 * 
 */


const user_schema = mongoose.Schema({
    email: {    
        type: String,
        required: true,
        unique: true,
        immutable: true, // email is now a immutable field so we can't change the email of the User during a patch request. 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    BU: {
        type: String,
        required: true
    },
    role: {
        type: String, 
        enum: ['ncg', 'mentor', 'admin'],
        required: true
    },
    qualification: {
        type: String, 
        required: true
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
}); 

user_schema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true
    next();
})

module.exports = mongoose.model('User', user_schema);
