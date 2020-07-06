const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: String,
    userName: String,
    email: String,
    password: String,
    avatar: String,
    address: String,
    balance: String,
    location: String,
    kyc: {
        mobile: String,
        birthDate: String,
        national: String,
        country: String,
        postalCode: String,
        city: String,
        streetName: String,
        streetNumber: String,
        kycVerified: String
    },
    testAddress:[{address:String,balance:String,password:String}]
});

module.exports = mongoose.model('User', userSchema);