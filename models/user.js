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
        nationality: String,
        country: String,
        postalCode: String,
        city: String,
        streetName: String,
        streetNumber: String,
        kycStatus:String
    },
    testAddress:[{address:String,balance:String,password:String}],
    wallet:{
        privateKey:Buffer,
        publicKey:Buffer,
    }
});


userSchema.set('toObject', { virtuals: true });
const User = mongoose.model('users', userSchema);

module.exports = mongoose.model('User', userSchema);

