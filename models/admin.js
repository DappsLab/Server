const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    fullName: String,
    userName: String,
    email: String,
    password: String,
    avatar: String,
    location: String,
    //! var kyc = new Schema({ name: String });
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

module.exports = mongoose.model('Admin', adminSchema);