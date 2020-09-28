const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var kycSchema = new Schema({
    mobile: String,
    birthDate: String,
    nationality: String,
    country: String,
    postalCode: String,
    city: String,
    streetName: String,
    streetNumber: String,
    kycStatus: String
});

module.exports = mongoose.model('Kyc', kycSchema);